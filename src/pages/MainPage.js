import React, { useEffect, useState } from "react";

const MainPage = () => {
  const [post, setPost] = useState("");
  useEffect(() => {
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
        if (!data.status === "fail") {
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
  }, []);

  return (
    <div>
      <h2>h</h2>
      {/* <h1>HELLO WORLD</h1>
      {post.posts.map((data) => (
        <h2>{data.subject}</h2>
      ))} */}
      {post.posts.map((ele) => {
        return <h2>{ele.subject}</h2>;
      })}
    </div>
  );
};

export default MainPage;
