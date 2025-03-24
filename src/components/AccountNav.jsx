"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import { AppProvider } from "@toolpad/core/AppProvider"
import { Account } from "@toolpad/core/Account"
import signOut from "@/api/user/signOut"
import { useRouter } from "next/navigation"
import Loading from "@/components/Loading"
import getUserDetails from "@/api/user/getUserDetails"
import useSessionCheck from "@/utils/hooks/useSessionCheck"

const AccountNav = () => {
	const [users, setUser] = useState([])
	const [currentSession, setSession] = useState(null)
	const [userData, setUserData] = useState(null)
	const { session, loading, status} = useSessionCheck()
	const router = useRouter()

	const authentication = useMemo(() => {
		return {
			signOut: async () => {
				setUser(null)
				setSession(null)
				setUserData(null)
				const res = signOut()
				if (res) {
					console.log("Signed out")
					router.push("/login")
				}
			},
		}
	}, [currentSession])

	useEffect(() => {
		const checkSession = async () => {
			try {
				if(session != null) {
				if (session.user == null && loading == false) {
					router.push("/login")
				} else {
					setSession(session)
					setUser(session.user)
					const fetch = await getUserDetails(session.user.email)
					if (fetch.error) {
						console.error("Error fetching user data:", fetch.error)
					} else {
						setUserData(fetch.userData)
						setSession((prevSession) => ({
							...prevSession,
							user: {...fetch.userData },
						}))
					}
				}
			}
			} catch (error) {
				console.error("Error during session check:", error)
				router.push("/login")
			}
		}

		if(!loading){
			checkSession()
		}
	}, [session, loading, router])

	if (loading) {
		return <Loading />
	}

	return (
		<div style={{ padding: "0" }}>
			<AppProvider authentication={authentication} session={currentSession}>
				<Account
					sx={{ padding: "0" }}
					slotProps={{
						signInButton: {
							style: { display: "none" },
						},
					}}
				/>
			</AppProvider>
		</div>
	)
}

export default AccountNav
