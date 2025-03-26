import { supabase } from '@/utils/supabase/client';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { email } = req.body;

		try {
			const { data } = await supabase
				.from('users')
				.select('email, first_name, last_name')
				.eq('email', email)

			const combinedData = data.map(user => ({
				email: user.email,
				name: `${user.first_name} ${user.last_name}`,
			}))

			return res.status(200).json({ message: "Successful Search", data: combinedData[0] });
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	}
	
	return res.status(400).json({ error: 'Invalid request' });
}