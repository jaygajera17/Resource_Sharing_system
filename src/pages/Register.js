import { useState } from 'react'
import { Router, usenavigate } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { Navigate } from "react-router-dom";
import  './login.css'
function App() {
	//const navigate = useNavigate()
	const history = useHistory()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

	async function registerUser(event) {
		event.preventDefault()

		const response = await fetch('http://localhost:9002/resourceShare/user/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				email,
				password,
        passwordConfirm,
			}),
		})

		const data = await response.json()
console.log(data);
		if (data.status === 'success') {
			//window.location.replace("https://google.com/");
			// <Link to="/">Home</Link>
            // <Redirect to='/redirect-example' />
			window.location.href = '/Login'
			// <Navigate to="/login" replace={true} />
		}
	}

	return (
		
		<body>
    <div class="bg-img">
      <div class="content">
        <header>Register</header>
        <form onSubmit={registerUser}>
          <div class="field">
            <span class="fa fa-user"></span>
            <input type="text" value={name}
                    onChange={(e) => setName(e.target.value)} required placeholder="Name"/>
          </div>
          <div class="field space">
            <span class="fa fa-user"></span>
            <input type="text" value={email}
                    onChange={(e) => setEmail(e.target.value)} required placeholder="Email "/>
         
		  </div>
          <div class="field space">
            <span class="fa fa-lock"></span>
            <input type="password"  value={password} onChange={(e) => setPassword(e.target.value)} class="pass-key" required placeholder="Password"/>
           
          </div>
          <div class="field space">
            <span class="fa fa-lock"></span>
            <input type="password"  value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} class="pass-key" required placeholder="Confirm Password"/>
           
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
          <a href="/login">Signup Now</a>
        </div>
      </div>
    </div>

    


  </body>
		
	)
}

export default App