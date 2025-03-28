"use server"

import { createClient } from "@/utils/supabase/server"

const signOut = async () => {
	const supabase = await createClient()
	const { error } = await supabase.auth.signOut()

	if (error) {
		return false
	}

	return true
}

export default signOut
