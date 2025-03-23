"use server"

import { createClient } from "@/utils/supabase/server"

async function getUserDetails(email) {
	const supabase = await createClient()

	try {
		const { data, error } = await supabase
			.from('users')
			.select('email, first_name, last_name')
			.eq('email', email)

		if (error) {
			console.error("Error fetching data:", error)
			return { status: 400, error: error.message }
		}
    
    const combinedData = data.map(user => ({
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
	}))

		return { user: combinedData[0], status: 200 }

	} catch (err) {
		console.error("Exception fetching data:", err)

		return { status: 500, error: err.message }
	}
}

export default getUserDetails
