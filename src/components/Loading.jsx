import React from "react"
import { Box, CircularProgress } from "@mui/material"

const Loading = () => {
	return (
		<div>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<CircularProgress
					sx={{
						"& svg": {
							color: "#ff5125",
						},
					}}
				/>
			</Box>
		</div>
	)
}

export default Loading
