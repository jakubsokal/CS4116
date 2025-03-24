"use client"

import Navbar from "@/components/Navbar"; 
import RegisterForm from "@/components/RegisterForm"; 

import React, { useEffect } from "react"
import { redirect } from "next/navigation"
import Loading from "@/components/Loading"
import useSessionCheck from "@/utils/hooks/useSessionCheck"

export default function Register() {
  const { session, loading, status } = useSessionCheck()

	useEffect(() => {
		if (!loading) {
			if (session != null) {
				console.info("Status:", status, "User logged in")
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
      <RegisterForm />
    </div>
  );
}
