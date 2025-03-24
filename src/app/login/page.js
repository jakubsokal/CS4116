"use client"

import Navbar from "@/components/Navbar"
import LoginForm from "@/components/LoginForm"
import Loading from "@/components/Loading"
import useSessionCheck from "@/utils/hooks/useSessionCheck"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function Login() {
	const { session, loading, status } = useSessionCheck()

	useEffect(() => {
		if (!loading) {
			if (session != null) {
				console.info("Status:", status, "User is already logged in")
				redirect("/")
			} else {
				console.info("Status:", status, "User is not logged in")
			}
		}
	}, [session, status, loading])

	if (loading) {
		return <Loading />
	}

	return (
		<div>
			<Navbar />
			<LoginForm />
		</div>
	)
}
