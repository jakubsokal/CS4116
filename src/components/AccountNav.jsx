"use client"

import React, { useState, useMemo, useEffect } from "react"
import { AppProvider } from "@toolpad/core/AppProvider"
import { Account } from "@toolpad/core/Account"
import userCheck from "@/api/user/userCheck"
import signOut from "@/api/user/signOut"
import { redirect } from "next/navigation"
import Loading from "@/components/Loading"
import getUserDetails from "@/api/user/getUserDetails"

const AccountNav = () => {
	const [user, setUser] = useState([])
	const [session, setSession] = useState(null)
	const [userData, setUserData] = useState(null)
	const [loading, setLoading] = useState(true)

	const authentication = useMemo(() => {
		return {
			signOut: async () => {
				setUser(null)
				setSession(null)
				setUserData(null)
				const res = signOut()
				if (res) {
					console.log("Signed out")
					redirect("/")
				}
			},
		}
	}, [session])

	useEffect(() => {
		const checkSession = async () => {
			try {
				const session = await userCheck()
				if (session.loggedIn === false) {
					redirect("/login")
				} else {
					setSession(session)
					
					setUser(session.user)
					const fetch = await getUserDetails(session.session.user.email)
					console.log("User data:", fetch.user)
					if (fetch.error) {
						console.error("Error fetching user data:", fetch.error)
					} else {
						setUserData(fetch.user)
						setSession((prevSession) => ({
							...prevSession,
							user: { ...prevSession.user, ...fetch.user },
						}))
					}
				}
			} catch (error) {
				console.error("Error during session check:", error)
				redirect("/login")
			} finally {
				setLoading(false)
			}
		}

		checkSession()
	}, [])

	if (loading) {
		return <Loading />
	}

	return (
		<div style={{ padding: "0" }}>
			<AppProvider authentication={authentication} session={session}>
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
