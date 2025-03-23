"use client"

import Navbar from "@/components/Navbar"
import LoginForm from "@/components/LoginForm"
import Loading from "@/components/Loading"
import useSessionCheck from "@/utils/hooks/useSessionCheck"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { useSearchParams } from 'next/navigation'

export default function Login() {
	const { user, loading, status } = useSessionCheck()
	 
	useEffect(() => {
		if (user != null) {
			console.info("Status:", status, "User is already logged in")
			redirect("/")
		} else {
			console.info("Status:", status, "User is not logged in")
		}
	}, [user, status])

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
