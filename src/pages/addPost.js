import { useState } from 'react'
// import { countDocuments } from '../../../Backend/models/userModel'
import  './login.css'
function App() {
    const [subject, setSubect] = useState("");
    const [topic, setTopic] = useState("");
    const [description, setDescription] = useState("");
  
    async function addPost(event) {
      // console.log(req.body);
      event.preventDefault();
      const token = "Bearer " + localStorage.getItem("token");
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
			
        
  
  <body>
    <div class="bg-img">
      <div class="content">
        <header>ADD POST</header>
        <form onSubmit={addPost}>
          <div class="field">
            <span class="fa fa-pen"></span>
            <input type="text" value={subject}
                    onChange={(e) => setSubect(e.target.value)} required placeholder="Subject"/>
          </div>
          <div class="field space">
            <span class="fa fa-pen" style={{color:"black"}}></span>
            <input type="text"  value={topic} onChange={(e) => setTopic(e.target.value)} class="pass-key" required placeholder="Topic"/>
           
          </div>
          <div class="field space">
          <span class="fa fa-pen" style={{color:"black"}}></span>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          placeholder=" Description"
          rows="3" cols="40"
        />
      <div></div>
      </div>
          <div class="field">
            <input  type="submit"
                    value="Add" />
          </div>
        </form>
       
      </div>
    </div>

    


  </body>


			
			
    
  </div>

	)
}

export default App
