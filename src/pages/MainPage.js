import React, { useEffect, useState } from "react";

const MainPage = () => {
  const [post, setPost] = useState("");
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    // const token = "Bearer " + localStorage.getItem("token");
    const token = "Bearer " + localStorage.getItem("token");
    if (token) {
      const getPost = async () => {
        const response = await fetch(
          "http://localhost:9002/resourceShare/user/Posts",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
          }
        );
        const data = await response.json();
        if (data.status === "fail") {
          alert(data.message);
          window.location.href = "/login";
        }
        console.log(data);
        setPost(data);
        console.log(post);
      };
      getPost();
    } else {
      alert("You are not signed in login first");
      window.location.href = "/login";
    }
  };

  return (
    <div>
      <h2>Post Topic</h2>
      <h1>HELLO WORLD</h1>

      {post &&
        post.posts.map((item) => (
          <div>
            <h1>{item.topic}</h1>
            <h1>{item.subject}</h1>
            {/* <h1>{item.photos}</h1> */}
            {/* {item.photos.length > 0 && item.photos.map((pho) => <h2>{pho}</h2>)} */}
            {/* {item.photos.length > 0 &&
              item.photos.map((pho) => (
                <img src="client/public/images/post/tour-62ccf9f27bed7c0570768714-1658027360973-1.jpeg" />
              ))} */}
          </div>
        ))}
      {/* {post.posts.map((data) => (
        <h2>{data.subject}</h2>
      ))} */}

      {/* {post.posts.map((data) => (<>)} */}

      <img
        src={
          window.location.origin +
          "tour-62ccf9f27bed7c0570768714-1658027360973-1.jpg"
        }
        alt="here"
        srcset=""
      />
      {/* <h2>{post.message}</h2> */}
    </div>
  );
};

export default MainPage;
