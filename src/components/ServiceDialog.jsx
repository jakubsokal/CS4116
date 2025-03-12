"use client";
import React, { useState } from "react";
import { Fragment } from "react";
import "@/styles/servicedialog.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import Rating from "@mui/material/Rating";

const ServiceDialog = () => {
	const [open, setOpen] = React.useState(false);
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
	const desc = "This is a description of the service";

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const tiers = ["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5"];

	const [listofTiers, setListofTiers] = useState(tiers);
	const [isTierDisabled, setIsTierDisabled] = useState(false);
	const [selectedTier, setTier] = useState("");

	const TierSelect = (event) => {
		setTier(event.target.value);
		setIsTierDisabled(true);
		setTimeout(() => {
			setIsTierDisabled(false);
		}, 600);
	};

	return (
		<div className="cs4116-dialog-main">
			<Button
				className="cs4116-open"
				variant="outlined"
				onClick={handleClickOpen}
			>
				Open responsive dialog
			</Button>
			{open && (
				<Dialog
					className="cs4116-background-dialog"
					fullScreen={fullScreen}
					open={open}
					onClose={handleClose}
					aria-labelledby="responsive-dialog-title"
				>
					<div className="cs41160-dialog-header">
						<DialogTitle id="responsive-dialog-title">
							{"Name of the servicessssssssssssssssssss"}
						</DialogTitle>
						<DialogActions className="cs4116-dialog-actions">
							<Button
								className="cs4116-inq-btn"
								autoFocus
								onClick={handleClose}
							>
								Inquire
							</Button>
							<Button
								className="cs4116-viewpf-btn"
								autoFocus
								onClick={handleClose}
							>
								View Profile
							</Button>
						</DialogActions>
					</div>
					<div className="cs4116-dialog-body">
						<DialogContent className="cs4116-dialog-content">
							<FormControl
								className="cs4116-dialog-form"
								fullWidth
								margin="normal"
							>
								<img src="https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png"></img>
								<InputLabel className="cs4116-dialog-input">
									Select Tier
								</InputLabel>
								<Select
									className="cs4116-dialog-select"
									labelId="demo-multiple-name-label"
									id="demo-multiple-name"
									value={selectedTier}
									onChange={TierSelect}
									input={<OutlinedInput label="Select Tier" />}
								>
									{listofTiers.map((selected) => (
										<MenuItem
											key={selected}
											value={selected}
											disabled={isTierDisabled}
										>
											{selected}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<Typography
								className="cs4116-dialog-data"
								variant="body1"
								component="div"
							>
								<Rating className="cs4116-dialog-rating" value={2} readOnly />
								<div className="cs4116-dialog-info">
									<div>Business Name: </div>
									<div>Description: {desc}</div>
									<div>Location: {desc}</div>
									<div>Phone Number: {desc}</div>
									<div>Open Hour: 10:00</div>
									<div>Close Hour: 10:00</div>
								</div>
							</Typography>
						</DialogContent>
						<div className="cs4116-dialog-reviews">Reviews</div>
					</div>
				</Dialog>
			)}
		</div>
	);
};

export default ServiceDialog;
