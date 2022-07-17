import React, { useEffect, useState } from "react";
import Hello from "./Navbar";
import Navbar from "./Navbar";
import Postu from "./Postu";

const Dashboard = () => {
  const [user, setUser] = useState("");
  useEffect(() => {
    const token = "Bearer " + localStorage.getItem("token");
    if (token) {
      const getUser = async () => {
        const response = await fetch(
          "http://localhost:9002/resourceShare/user/getUser",
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
        setUser(data.user);
      };
      getUser();
    } else {
      alert("You are not signed in login first");
      window.location.href = "/login";
    }
  }, []);

  return (
    <div>
      <Navbar/>
      <center style={{margin:"20px"}}><h2 style={{textAlign:"center"}}>Welcome 👋 {user.name || "Name"} </h2></center>
      <br></br>
      <Postu/>
    </div>
  );
};

export default Dashboard;