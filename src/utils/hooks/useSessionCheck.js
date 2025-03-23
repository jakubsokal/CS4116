import { useState, useEffect } from "react"
import userCheck from "@/api/user/userCheck"
import { redirect } from "next/navigation"

const useSessionCheck = () => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const [session, setSession] = useState(null)
	const [status, setStatus] = useState(null)

	useEffect(() => {
		const checkSession = async () => {
			const session = await userCheck()
			if (session.loggedIn === false) {
				setStatus(401)
				setLoading(false)
			}else {
				setStatus(200)
				setUser(session.session.user)
				setSession(session)
				setLoading(false)
			}
		}

		checkSession()
	}, [])

	return { user, session, loading, status}
}

export default useSessionCheck