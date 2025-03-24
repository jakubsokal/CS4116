import { useState, useEffect } from "react"
import userCheck from "@/api/user/userCheck"

const useSessionCheck = () => {
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
				setSession(session.session)
				setLoading(false)
			}
		}

		checkSession()
	}, [])

	return { session, loading, status}
}

export default useSessionCheck