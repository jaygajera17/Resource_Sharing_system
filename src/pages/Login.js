import { useState } from 'react'
// import { countDocuments } from '../../../Backend/models/userModel'
import  './login.css'
function App() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	async function loginUser(event) {

		// console.log(req.body);
		event.preventDefault()

		const response = await fetch('http://localhost:9002/resourceShare/user/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})

		const data = await response.json()

		if (data.status==="success") {
			localStorage.setItem('token', data.token)
			alert('Login successful')
			window.location.href = '/dashboard'
		} else {
			alert('Please check your username and password')
		}
	}
	

	return (
		<div>
			
        
  
  <body>
    <div class="bg-img">
      <div class="content">
        <header>Login Form</header>
        <form onSubmit={loginUser}>
          <div class="field">
            <span class="fa fa-user"></span>
            <input type="text" value={email}
                    onChange={(e) => setEmail(e.target.value)} required placeholder="Email or Phone"/>
          </div>
          <div class="field space">
            <span class="fa fa-lock"></span>
            <input type="password"  value={password} onChange={(e) => setPassword(e.target.value)} class="pass-key" required placeholder="Password"/>
           
          </div>
          <div class="pass">
            <a href="#">Forgot Password?</a>
          </div>
          <div class="field">
            <input  type="submit"
                    value="Login" />
          </div>
        </form>
        <div class="signup">Don't have account?
          <a href="/">Signup Now</a>
        </div>
      </div>
    </div>

    


  </body>


			
			
    
  </div>

	)
}

export default App