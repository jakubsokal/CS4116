"use server"

import { createClient } from "@/utils/supabase/server"

const signOut = async () => {
	const supabase = await createClient()
	const { error } = await supabase.auth.signOut()

	if (error) {
		console.error("Error signing out:", error.message)
		return false
	}

	return true
}

export default signOut
