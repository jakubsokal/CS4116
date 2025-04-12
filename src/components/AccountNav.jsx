"use client"

import React, { useState, useMemo, useEffect } from "react"
import { AppProvider } from "@toolpad/core/AppProvider"
import { Account } from "@toolpad/core/Account"
import signOut from "@/api/user/signOut"
import { useRouter } from "next/navigation"
import Loading from "@/components/Loading"
import useSessionCheck from "@/utils/hooks/useSessionCheck"
import { Button, Stack } from '@mui/material';
import { AccountPreview, SignOutButton, AccountPopoverFooter } from '@toolpad/core/Account';
import { FaEdit } from 'react-icons/fa';


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
					router.push("/business/editProfile");
				}}
			>
				Edit Profile
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

	const authentication = useMemo(() => {
		return {
			signOut: async () => {
				setSession(null)
				const res = await signOut()
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
						popoverContent: currentSession.business ? { component: CustomMenu } : {},
					}}
				/>
			</AppProvider>
		</div>
	)
}

export default AccountNav
