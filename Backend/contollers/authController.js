const { promisify } = require("util");
const User = require("./../models/userModel");
const Post = require("./../models/postModel");
const crypto = require("crypto");
const multer = require("multer");
const sharp = require("sharp");
// const dr = require("./../../Hacks/client/public/images/posts/");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

const jwt = require("jsonwebtoken");
const { response } = require("express");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true,
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
  });
};

//* <------------------------- Sign In ------------------------->

exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newUser = await User.create(req.body);

  createSendToken(newUser, 201, res);
  // const token = signToken(newUser.__id);

  // res.status(200).json({
  //   message: "success",
  //   token,
  //   data: { use: newUser },
  // });
});

//* <------------------------- Log In ------------------------->

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  // const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);

  // const token = signToken(user.__id);

  // res.status(200).json({
  //   status: "success",
  //   token,
  // });
});

exports.protect = catchAsync(async (req, res, next) => {
  req.requestTime = new Date().toISOString;

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  //* 2) verify token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //* 3) check if user is still exist

  const freshUser = await User.findById(decoded.id);

  console.log(freshUser);
  if (!freshUser) {
    return next(
      new AppError("The user belonging to this token is not exist", 401)
    );
  }

  if (freshUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again")
    );
  }

  req.user = freshUser;
  next();
});

exports.getUser = catchAsync(async (req, res, next) => {
  // console.log(req.headers);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  //* 2) verify token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //* 3) check if user is still exist

  const freshUser = await User.findById(decoded.id);

  res.status(200).json({
    status: "success",
    user: freshUser,
  });
});

//*<--------------------- Forget Password ------------------------->

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user exist with this email", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/resourceShare/user/resetPassword/${resetToken}`;

  const message = `Forgot your password ? submit a PATCH request with your new password and password confirm to ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    res.status(200).json({
      status: "succes",
      message: "Token send to email !!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error in sending mail, Try again", 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = signToken(user.__id);

  res.status(200).json({
    message: "success",
    token,
  });

  next();
});

//*   ---------------------POSTS ----------

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new AppError("Not an image! Please upload only images.", 400), false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// exports.uploadPostImages = upload.fields({ name: "images", maxCount: 5 });

exports.uploadPostImages = upload.array("photos", 5);

exports.resizePostPhoto = catchAsync(async (req, res, next) => {
  console.log(req.files);
  if (!req.files) return next();
  // const postPhotoName = `post-${req.user.id}-${Date.now()}`;
  // req.file.filename = `post-${req.user.id}-${Date.now()}.jpeg`;

  // await sharp(req.files.buffer)
  //   .resize(500, 500)
  //   .toFormat("jpeg")
  //   .jpeg({ quality: 90 })
  //   .toFile(`public/images/posts/${postPhotoName}`);
  req.body.photos = [];

  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `tour-${req.user.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`C:/Vacation/Hacks/client/public/images/post/${filename}`);

      req.body.photos.push(filename);
    })
  );

  next();
});

exports.addPost = catchAsync(async (req, res, next) => {
  // console.log(req.body);

  if (!req.body.subject || !req.body.description || !req.body.topic) {
    return next(new AppError("Please provide valid data", 400));
  }

  // console.log(req.user);
  const creator = req.user.id;
  const { subject, topic, description } = req.body;

  let photos = [];
  if (req.body.photos) photos = req.body.photos;
  console.log(photos);

  const newPost = await Post.create({
    creator,
    subject,
    topic,
    description,
    photos,
  });

  res.status(200).json({
    message: "success",
    post: newPost,
  });
});

exports.myPost = catchAsync(async (req, res, next) => {
  const posts = await Post.find({ creator: req.user.id });

  res.status(200).json({
    message: "success",
    posts,
  });
});

exports.getPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find().populate("creator");

  res.status(200).json({
    message: "success",
    posts,
  });
});

exports.viewPost = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const post = await Post.findById(req.params.id).populate("creator");

  res.status(200).json({
    message: "success",
    post,
  });
});