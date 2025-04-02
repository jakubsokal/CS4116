import { useState, useEffect, use } from "react"
import userCheck from "@/api/user/userCheck"

const useSessionCheck = () => {
	const [loading, setLoading] = useState(true)
	const [currentSession, setSession] = useState(null)
	const [status, setStatus] = useState(null)

	useEffect(() => {
		const checkSession = async () => {
			const session = await userCheck()
			if (session.loggedIn === false) {
				setStatus(401)
				setLoading(false)
			} else {
				setStatus(200)
				setSession(session.session)
				try {
					const res = await fetch(`/api/user/getUserDetailsEmail?email=${session.session.user.email}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
					});

					const result = await res.json();

					if (result.data) {
						setSession((prevSession) => ({
							...prevSession,
							user: { ...result.data },
						}))
					}
					setLoading(false)
				} catch (error) {
					console.error("Error during session check:", error)
					setLoading(false)
				}
			}
		}

		checkSession()
	}, [])

	return { session: currentSession, loading, status }
}

export default useSessionCheck