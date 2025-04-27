"use client";
import React from "react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import "@/styles/filterbar.css";

const ReviewRating = () => {
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
				<Rating className="cs4116-rating-stars" name="half-rating" defaultValue={0} precision={0.5} />
				<Rating className="cs4116-rating-stars" name="half-rating2" defaultValue={0} precision={0.5} />
			</Stack>
		</div>
	);
};

export default ReviewRating;
