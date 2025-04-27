"use client"

import React, { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import OutlinedInput from "@mui/material/OutlinedInput"
import Loading from "@/components/Loading"
import "@/styles/filterbar.css"

const LocationSelection = ({ onCountyChange, isCustomStyle = false, value = "" }) => {
	const [countyData, setCountyData] = useState([])
	const [selectedCounty, setSelectedCounty] = useState("")
	const [isCountyDisabled, setIsCountyDisabled] = useState(false)

	useEffect(() => {
		fetch("/county.json")
			.then((response) => response.json())
			.then((data) => {
				if (Array.isArray(data.counties)) {
					setCountyData(data.counties)
				} else {
					throw new Error("Invalid JSON format")
				}
			})
			.catch(() => {
				throw new Error("Failed to load locations")
			})
	}, [])

	useEffect(() => {
		if (value === "Select County") {
			setSelectedCounty("")
		} else {
			setSelectedCounty(value)
		}
	}, [value])

	if (countyData.length === 0) {
		return (
			<Loading />
		)
	}

	const CountyChange = (event) => {
		setSelectedCounty(event.target.value)
		setIsCountyDisabled(true)
		setTimeout(() => {
			setIsCountyDisabled(false)
		}, 600)

		if (onCountyChange) {
			onCountyChange(event.target.value)
		}

	}

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
			}}
		>
			<FormControl
				fullWidth
				margin="normal"
				sx={{
					backgroundColor: "transparent",
					borderRadius: "5px",
					boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
				}}
			>
				<InputLabel
					id="demo-multiple-name-label"
					sx={{
						fontWeight: "500",
						fontSize: "0.9rem",
						fontStyle: "normal",
						color: isCustomStyle ? "white" : "black",
						borderColor: isCustomStyle ? "white" : "black",
					}}
				>
					Select County
				</InputLabel>
				<Select
					labelId="demo-multiple-name-label"
					id="demo-multiple-name"
					value={selectedCounty}
					onChange={CountyChange}
					input={<OutlinedInput label="Select County" />}
					sx={{
						background: isCustomStyle ? "#ffffff1a" : "transparent",
						color: isCustomStyle ? "white" : "black",
						borderRadius: "8px",
						"& .MuiOutlinedInput-notchedOutline": {
							borderColor: isCustomStyle ? "#fff3" : "black",
						},
						"&:hover .MuiOutlinedInput-notchedOutline": {
							borderColor: isCustomStyle ? "#fff3" : "black",
						},
						"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderColor: isCustomStyle ? "#fff3" : "black",
						},
						"& .MuiSelect-icon": {
							color: isCustomStyle ? "white" : "black",
						},
					}}
				>
					{countyData.map((county, index) => (
						<MenuItem
							key={index}
							value={county}
							disabled={isCountyDisabled}
							sx={{
								fontSize: "0.9rem",
								color: "#333",
								"&:hover": {
									backgroundColor: "#f0f0f0",
								},
							}}
						>
							{county}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	)
}

export default LocationSelection
