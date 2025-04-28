"use client"

import signOut from "@/api/user/signOut"
import Loading from "@/components/Loading"
import useSessionCheck from "@/utils/hooks/useSessionCheck"
import { Button, Stack } from '@mui/material'
import { Account, AccountPopoverFooter, AccountPreview, SignOutButton } from "@toolpad/core/Account"
import { AppProvider } from "@toolpad/core/AppProvider"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { FaEdit } from 'react-icons/fa'


function CustomMenu() {
	const router = useRouter();
	return (
		<Stack direction="column">
			<AccountPreview variant="expanded" />
			<Button
				variant="text"
				sx={{ textTransform: 'capitalize', display: 'flex', mx: 'auto', left: 0 }}
				size="small"
				startIcon={<FaEdit />}
				disableElevation
				onClick={() => {
					router.push("/business/viewProfile");
				}}
			>
				Manage Profile
			</Button>
			<AccountPopoverFooter>
				<SignOutButton />
			</AccountPopoverFooter>
		</Stack>
	);
}

const AccountNav = () => {
	const [currentSession, setSession] = useState(null)
	const { session, loading } = useSessionCheck()
	const router = useRouter()
	const [waiting, setWaiting] = useState(true)

	const authentication = useMemo(() => {
		return {
			signOut: async () => {
				try {
					const success = await signOut()
					if (success) {
						setSession(null)
						console.log("Signed out")
						router.push("/login")
					}
				} catch (error) {
					console.error("Error during sign out:", error)
				}
			},
		}
	}, [])

	useEffect(() => {
		if (session != null) {
			setSession(session)
			setWaiting(false)
		}
	}, [session])

	if (loading || waiting) {
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
						popoverContent: currentSession?.business ? { component: CustomMenu } : undefined,
					}}
				/>
			</AppProvider>
		</div>
	);
}

export default AccountNav
