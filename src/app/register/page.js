"use client"

import Navbar from "@/components/Navbar"; 
import RegisterForm from "@/components/RegisterForm"; 

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import Loading from "@/components/Loading"
import useSessionCheck from "@/utils/hooks/useSessionCheck"

export default function Register() {
  const { session, loading, status } = useSessionCheck()
  const router = useRouter()

	useEffect(() => {
		if (!loading) {
			if (session != null) {
				console.info("Status:", status, "User logged in")
				router.push("/")
			} else {
				console.info("Status:", status, "User is not logged in")
			}
		}
	}, [session, status, loading, router])

	if (loading) {
		return <Loading />
	}
  
  return (
    <div className="min-h-screen">
      <Navbar /> 
      <div className="pt-20 pb-10">
        <RegisterForm />
      </div>
    </div>
  );
}
