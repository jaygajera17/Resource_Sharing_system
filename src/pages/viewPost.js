import React, { useEffect, useState } from "react";

const MainPage = () => {
  const [post, setPost] = useState("");

  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    // const token = "Bearer " + localStorage.getItem("token");
    const str = window.location.pathname;
    const id = str.substring(10);
    const token = "Bearer " + localStorage.getItem("token");

    if (token) {
      const getPost = async () => {
        const response = await fetch(
          `http://localhost:9002/resourceShare/user/viewPost/${id}`,
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
        setPost(data.post);
        console.log(data.post);
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
      <h1>HELLO WORLD{post.topic}</h1>
    </div>
  );
};

export default MainPage;
