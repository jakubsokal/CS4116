"use server"

import { createClient } from "@/utils/supabase/server"

const userCheck = async () => {
	const supabase = await createClient()
	const { data, error } = await supabase.auth.getSession()

	if (error || !data?.session) {
		return { loggedIn: false, status: 401 }
	}

	return { session: data.session, status: 200 }
}

export default userCheck
