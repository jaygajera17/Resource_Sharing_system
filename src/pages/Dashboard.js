import React, { useEffect, useState } from "react";

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
      <h1>HELLO WORLD</h1>
      <h1>Your Data: {user.name || "Name"} </h1>
    </div>
  );
};

export default Dashboard;
