"use client";
import "@/styles/filterbar.css";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";

const ReviewRating = ({onRatingChange, isResetting}) => {
	const [selectedMinRating, setSelectedMinRating] = useState(0);
	const [selectedMaxRating, setSelectedMaxRating] = useState(0);

	useEffect(() => {
		setSelectedMinRating(0);
		setSelectedMaxRating(5);
	}, [isResetting]);

	const handleMinRatingChange = (e, newVal) => {
		setSelectedMinRating(newVal);
	if (!isResetting && onRatingChange) {
		onRatingChange(newVal, selectedMaxRating);
	}
};

	const handleMaxRatingChange = (e, newVal) => {
		setSelectedMaxRating(newVal);
	if (!isResetting && onRatingChange) {
		onRatingChange(selectedMinRating, newVal);
	}
};

	return (
		<div style={{ display: "flex", flexDirection: "row" }}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: "2px 7px 10px 0px",
				}}
			>
				<p className="cs4116-rating-text">Min Rating</p>
				<p className="cs4116-rating-text">Max Rating</p>
			</div>
			<Stack className="cs4116-rating" spacing={1}>
				<Rating
				className="cs4116-rating-stars"
				name="half-rating"
				value={selectedMinRating}
				onChange={handleMinRatingChange}
				defaultValue={0}
				precision={0.5} />

				<Rating
				className="cs4116-rating-stars"
				name="half-rating2"
				value={selectedMaxRating}
				onChange={handleMaxRatingChange}
				defaultValue={5}
				precision={0.5} />
			</Stack>
		</div>
	);
};

export default ReviewRating;
