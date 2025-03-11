"use client";
import { useState } from "react";
import React from "react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

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
				<p>Min Rating</p>
				<p>Max Rating</p>
			</div>
			<Stack spacing={1}>
				<Rating name="half-rating" defaultValue={0} precision={0.5} />
				<Rating name="half-rating2" defaultValue={0} precision={0.5} />
			</Stack>
		</div>
	);
};

export default ReviewRating;
