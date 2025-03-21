"use client";

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import CircularProgress from "@mui/material/CircularProgress";

const LocationSelection = () => {
	const [countyData, setCountyData] = useState([]);
	const [selectedCounty, setSelectedCounty] = useState("");
	const [isCountyDisabled, setIsCountyDisabled] = useState(false);

	useEffect(() => {
		fetch("/county.json")
			.then((response) => response.json())
			.then((data) => {
				if (Array.isArray(data.counties)) {
					setCountyData(data.counties);
				} else {
					throw new Error("Invalid JSON format");
				}
			})
			.catch(() => {
				throw new Error("Failed to load locations");
			});
	}, []);

	if (countyData.length === 0) {
		return (
			<Box
				sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
			>
				<CircularProgress
					sx={{
						"& svg": {
							color: "#ff5125",
						},
					}}
				/>
			</Box>
		);
	}

	const CountyChange = (event) => {
		setSelectedCounty(event.target.value);
		setIsCountyDisabled(true);
		setTimeout(() => {
			setIsCountyDisabled(false);
		}, 600);
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", fullWidth: "true" }}>
			<FormControl fullWidth margin="normal">
				<InputLabel id="demo-multiple-name-label">Select County</InputLabel>
				<Select
					labelId="demo-multiple-name-label"
					id="demo-multiple-name"
					value={selectedCounty}
					onChange={CountyChange}
					input={<OutlinedInput label="Select County" />}
				>
					{countyData.map((county, index) => (
						<MenuItem key={index} value={county} disabled={isCountyDisabled}>
							{county}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
};

export default LocationSelection;
