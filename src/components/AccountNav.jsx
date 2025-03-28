"use client"

import React, { useState, useMemo, useEffect } from "react"
import { AppProvider } from "@toolpad/core/AppProvider"
import { Account } from "@toolpad/core/Account"
import signOut from "@/api/user/signOut"
import { useRouter } from "next/navigation"
import Loading from "@/components/Loading"
import useSessionCheck from "@/utils/hooks/useSessionCheck"

const AccountNav = () => {
	const [users, setUser] = useState([])
	const [currentSession, setSession] = useState(null)
	const { session, loading, status } = useSessionCheck()
	const router = useRouter()

	const authentication = useMemo(() => {
		return {
			signOut: async () => {
				setUser(null)
				setSession(null)
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
				if (session != null) {
					if (session.user == null && loading == false) {
						router.push("/login")
					} else {
						setSession(session)
						const res = await fetch(`/api/user/getUserDetailsEmail?email=${session.user.email}`, {
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
					}
				}
			} catch (error) {
				console.error("Error during session check:", error)
				router.push("/login")
			}
		}

		if (!loading) {
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
