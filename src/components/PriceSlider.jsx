"use client";
import "@/styles/filterbar.css";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { useState } from "react";

function valuetext(value) {
	return `${value}`;
}

const minDistance = 25;

const PriceSlider = ({onPriceChange, isResetting}) => {
	const [value, setValue] = useState([0, 1000]);

	const handleChange = (event, newValue, activeThumb) => {
		if (!Array.isArray(newValue)) {
			return;
		}

		let updatedValue = value;

		if (activeThumb === 0) {
			updatedValue = [Math.min(newValue[0], value[1] - minDistance), value[1]];
		} else {
			updatedValue = [value[0], Math.max(newValue[1], value[0] + minDistance)];
		}
		setValue(updatedValue);

		if (!isResetting && onPriceChange) {
			onPriceChange(updatedValue);
		}
	};

	return (
		<Box sx={{ width: 300, px: 5 }}>
			<div className="cs4116-price-show" style={{ display: "flex", justifyContent: "space-between" }}>
				<Typography
					id="non-linear-slider"
					gutterBottom
					className="cs4116-price-show-text"
					sx={{ fontFamily: "Urbanist-Bold" }}
				>
					€{value[0]}
				</Typography>
				<Typography
					id="non-linear-slider"
					gutterBottom
					className="cs4116-price-show-text"
					sx={{ fontFamily: "Urbanist-Bold" }}
				>
					€{value[1]}
				</Typography>
			</div>
			<Slider
				min={5}
				step={5}
				max={1000}
				getAriaLabel={() => "Minimum distance"}
				value={value}
				onChange={handleChange}
				valueLabelDisplay="auto"
				getAriaValueText={valuetext}
				disableSwap
				sx={{
					color: "#ff5125",
					"& .MuiSlider-thumb": {
						height: 24,
						width: 24,
					},
				}}
			/>
		</Box>
	);
}

export default PriceSlider;
