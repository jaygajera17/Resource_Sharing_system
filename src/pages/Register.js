import { useState } from 'react'
import { Router, usenavigate } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { Navigate } from "react-router-dom";


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
		
		<div>
			<h1>Register</h1>
			<form onSubmit={registerUser}>
				<input
					value={name}
					onChange={(e) => setName(e.target.value)}
					type="text"
					placeholder="Name"
				/>
				<br />
				<input
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					type="email"
					placeholder="Email"
				/>
				<br />
				<input
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					type="password"
					placeholder="Password"
				/>
        <input
					value={passwordConfirm}
					onChange={(e) => setPasswordConfirm(e.target.value)}
					type="password"
					placeholder="confirmPassword"
				/>
				<br />
				<button type="submit">SUBMIT</button>
			</form>
		</div>
		
	)
}

export default App