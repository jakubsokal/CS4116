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
	const [countyData, setCountyData] = useState({});
	const [selectedCounty, setSelectedCounty] = useState("");
	const [selectedArea, setSelectedArea] = useState("");
	const [isCountyDisabled, setIsCountyDisabled] = useState(false);
	const [isAreaDisabled, setIsAreaDisabled] = useState(false);

	useEffect(() => {
		fetch("/towns.json")
			.then((response) => response.json())
			.then((data) => {
				const groupedByCounty = data.reduce((result, town) => {
					const county = town.county;
					if (!result[county]) result[county] = [];
					result[county].push(town.name);
					return result;
				}, {});

				setCountyData(groupedByCounty);
			})
			.catch(() => {
				throw new Error("Failed to load locations");
			});
	}, []);

	if (Object.keys(countyData).length === 0) {
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

	const AreaChange = (event) => {
		setSelectedArea(event.target.value);
		setIsAreaDisabled(true);
		setTimeout(() => {
			setIsAreaDisabled(false);
		}, 600);
	};

	const sortedCounties = Object.keys(countyData).sort();
	const sortedTowns = selectedCounty
		? [...countyData[selectedCounty]].sort()
		: [];

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
					{sortedCounties.map((selected) => (
						<MenuItem
							key={selected}
							value={selected}
							disabled={isCountyDisabled}
						>
							{selected}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			{selectedCounty && (
				<FormControl fullWidth margin="normal">
					<InputLabel id="demo-multiple-name-label">
						Select Town/City
					</InputLabel>
					<Select
						labelId="demo-multiple-name-label"
						id="demo-multiple-name"
						value={selectedArea}
						onChange={AreaChange}
						input={<OutlinedInput label="Select Town/City" />}
					>
						{sortedTowns.map((selected) => (
							<MenuItem
								key={selected}
								value={selected}
								disabled={isAreaDisabled}
							>
								{selected}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			)}
		</Box>
	);
};

export default LocationSelection;
