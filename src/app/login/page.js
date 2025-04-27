"use client"

import Navbar from "@/components/Navbar"
import LoginForm from "@/components/LoginForm"
import Loading from "@/components/Loading"
import useSessionCheck from "@/utils/hooks/useSessionCheck"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Login() {
	const { session, loading, status } = useSessionCheck()
	const router = useRouter()

	useEffect(() => {
		if (loading) return;

		if (session) {
			console.info("Status:", status, "User is already logged in");
			const routes = {
				2: "/admin",
				1: "/business",
			};
			router.push(routes[session?.user?.permission] || "/");
		}
	}, [session, status, loading, router]);

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
