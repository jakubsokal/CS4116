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
						const updatedSession = { user: { ...result.data } };
						if (result.data.permission === 1) {
							try {
								const res = await fetch(`/api/business/getBusinessDetails?userId=${result.data.user_id}`, {
									method: 'GET',
									headers: {
										'Content-Type': 'application/json',
									},
								});
								if (res.ok) {
									const businessRes = await res.json();
									updatedSession.business = { ...businessRes.data };
								}
							} catch (error) {
								console.error("Error fetching business details:", error);
							}
						}
						setSession((prevSession) => ({
							...prevSession,
							...updatedSession,
						}));
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