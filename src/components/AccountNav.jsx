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
		if (session != null) {
			setSession(session)
		}
	}, [session])

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
