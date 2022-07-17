import { useEffect, useState } from "react";
// import { countDocuments } from '../../../Backend/models/userModel'

function App() {
  const [user, setUser] = useState("");
  const [subject, setSubect] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const token = "Bearer " + localStorage.getItem("token");

  useEffect(() => {
    loadData();
  }, []);

  let UserData;

  const loadData = async () => {
    // const token = "Bearer " + localStorage.getItem("token");
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
        UserData = await response.json();
        if (UserData.status === "fail") {
          alert(UserData.message);
          window.location.href = "/login";
        }
        console.log(UserData);
        setUser(UserData);
        console.log("user" + user);
      };
      getUser();
    } else {
      alert("You are not signed in login first");
      window.location.href = "/login";
    }
  };

  async function addPost(event) {
    // console.log(req.body);
    event.preventDefault();
    const token = "Bearer " + localStorage.getItem("token");
    const id = user._id;
    // const token = "Bearer " + localStorage.getItem("token");
    if (token) {
      const getPost = async () => {
        const response = await fetch(
          "http://localhost:9002/resourceShare/user/addPost",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
            body: JSON.stringify({
              subject,
              topic,
              description,
            }),
          }
        );

        const data = await response.json();
        console.log(data);
        if (data.message === "fail") {
          alert("post not added");
          window.location.href = "/Dashboard";
        } else if (data.message === "success") {
          alert("post added");
          window.location.href = "/Posts";
        }
        // console.log(post);
      };
      getPost();
    } else {
      alert("You are not signed in login first");
      window.location.href = "/login";
    }
  }

  return (
    <div>
      <h1>ADD POST</h1>
      <form onSubmit={addPost}>
        <input
          value={subject}
          onChange={(e) => setSubect(e.target.value)}
          type="text"
          placeholder="subject"
        />
        <br />
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          type="text"
          placeholder="topic"
        />
        <br />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          placeholder="description"
        />
        <br />
        <input type="submit" value="submit" />
      </form>
    </div>
  );
}

export default App;
