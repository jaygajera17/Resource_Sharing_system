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
  }, []);

  return (
    <div>
            <h2 style={{textAlign: "center"}}>Card Example</h2>
            <div className="w3-container" style={{ display: "flex",flexWrap: "wrap", margin: "10px auto" }}>
                {post.posts.map((ele,ind) => (
                    <div className="w3-card-4" style={{ display: "flex",minWidth: "20%" ,flexDirection:"column", margin:"20px",borderRadius:"10px"}}>
                        <header className="w3-container w3-light-grey">
                            <h3 style={{textAlign: "center"}}>{ele.subject}</h3><hr/>
                        </header>
                        <div className="w3-container">
                            <p>Id: {ele.id}</p>
                            <p>Age: {ele.age}</p>
                            <p>Position: {ele.position}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
  );
};

export default MainPage;