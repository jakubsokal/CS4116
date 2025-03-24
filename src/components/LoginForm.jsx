"use client"

import React from "react"
import { useState } from "react"
import "@/styles/LoginForm.css"
import { FaUser, FaLock } from "react-icons/fa"
import Loading from "@/components/Loading"
import { login } from "@/api/login/login"
import { redirect } from 'next/navigation'
import useSessionCheck from "@/utils/hooks/useSessionCheck"

const LoginForm = () => {
	const [error, setError] = useState(null)
	const [load, setLoading] = useState(false)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [user, setUser] = useState([])
	const {loading} = useSessionCheck()

	const handleOnSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		const res = await login(email, password)
		if (res.status == 200) {
			setUser(res.data)
			console.info("Status:", res.status, "Successfully login")
			redirect("/")
		} else {
			setError(res.error)
			console.error("Status:", res.status, "Error logging in:", res.error)
		}
		setLoading(false)
	}

	if (loading) {
		return <Loading />
	}

	return (
		<div className="wrapper">
			<form onSubmit={handleOnSubmit}>
				<h1>Login</h1>
				{error && <p style={{ color: "red" }}>{error}</p>}
				<div className="input-box">
					<input
						type="text"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<FaUser className="icon" />
				</div>
				<div className="input-box">
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<FaLock className="icon" />
				</div>

				<div className="remember-forgot">
					<label>
						<input type="checkbox" />
						Remember me
					</label>
					<a href="#">Forgot password?</a>
				</div>
				<button type="submit">
					{load ? (
						<Loading/>
					) : (
						"Login"
					)}
				</button>
				<div className="register-link">
					<p>
						Don't have an account? <a href="/register">Register</a>
					</p>
				</div>
			</form>
		</div>
	)
}

export default LoginForm
