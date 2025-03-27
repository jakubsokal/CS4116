"use client"

import React, { useState, useEffect } from "react"
import "@/styles/servicedialog.css"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import Typography from "@mui/material/Typography"
import DialogTitle from "@mui/material/DialogTitle"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import OutlinedInput from "@mui/material/OutlinedInput"
import Rating from "@mui/material/Rating"
import Loading from "@/components/Loading"

const ServiceDialog = (service) => {
	const [open, setOpen] = React.useState(false)
	const theme = useTheme()
	const fullScreen = useMediaQuery(theme.breakpoints.down("md"))
	const [loading, setLoading] = useState(false)
	const [listofTiers, setListofTiers] = useState([])
	const [isTierDisabled, setIsTierDisabled] = useState(false)
	const [selectedTier, setTier] = useState("")
	const [business, setBusiness] = useState([])
	const [reviews, setReviews] = useState([])
	const [userReviews, setUserReviews] = useState([])

	const businessApi = async () => {
		setLoading(true)
		try {
			const res = await fetch(`/api/business/getBusinessDetails?businessId=${service.service.business_id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!res.ok) {
				throw new Error(res.error)
			}

			const result = await res.json()
			if (result.data) {
				setBusiness(result.data)
			}
		} catch (error) {
			console.error("Error fetching business details:", error)
		} finally {
			setLoading(false)
		}
	}

	const reviewsApi = async () => {
		setLoading(true)
		try {
			const res = await fetch(`/api/reviews/getReview?serviceId=${service.service.service_id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!res.ok) {
				throw new Error(res.error)
			}

			const result = await res.json()
			if (result.data) {
				setReviews(result.data)
			}
		} catch (error) {
			console.error("Error fetching reviews:", error)
		} finally {
			setLoading(false)
		}
	}

	const userReviewApi = async () => {
		setLoading(true)
		try {
			const userDataPromises = reviews.map(async (review) => {
				const res = await fetch(`/api/user/getUserDetailsId?userId=${review.user_id}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				})

				if (!res.ok) {
					throw new Error(res.error)
				}

				const jsonData = await res.json()
				return { ...jsonData, review }
			})

			const result = await Promise.all(userDataPromises)

			if (result.length > 0) {
				setUserReviews(result)
			}
		} catch (error) {
			console.error("Error fetching user reviews:", error)
		} finally {
			setLoading(false)
		}
	}

	const serviceTierApi = async () => {
		setLoading(true)
		try {
			const res = await fetch(`/api/tier/getTierByServiceId?serviceId=${service.service.service_id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!res.ok) {
				throw new Error(res.error)
			}


			const result = await res.json()
			console.log("RESULT:", result.length)
			if (result.data.length > 0) {

				setListofTiers(result.data)
			}
		} catch (error) {
			console.error("Error fetching user reviews:", error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		businessApi()
		reviewsApi()
	}, [service.service.business_id, service.service.service_id])

	useEffect(() => {
		const reviewContainer = document.querySelector('.cs4116-dialog-reviews')
		if (reviewContainer) {
			reviewContainer.scrollTop = 0
		}
	}, [userReviews])

	const handleClickOpen = async () => {
		setLoading(true)
		try {
			await userReviewApi()
			await serviceTierApi()
			setTimeout(() => {
				const reviewContainer = document.querySelector('.cs4116-dialog-reviews')
				if (reviewContainer) {
					reviewContainer.scrollTop = 0
				}
			}, 0)
		} catch (error) {
			console.error("Error fetching user reviews:", error)
		} finally {
			setLoading(false)
			setOpen(true)
		}
	}

	const handleClose = () => {
		setOpen(false)
		setTier("")
		setListofTiers([])
	}

	const handleContact = () => {
		console.log("Contacting User")
	}

	const handleInquire = () => {
		console.log("Contacting Business")
	}

	const TierSelect = (event) => {
		setTier(event.target.value)
		setIsTierDisabled(true)
		setTimeout(() => {
			setIsTierDisabled(false)
		}, 600)
	}

	if (loading) {
		return <Loading />
	}

	return (
		<div className="cs4116-dialog-main">
			{!loading && (
				<Button
					className="cs4116-open"
					variant="outlined"
					onClick={handleClickOpen}
				>
					View Business
				</Button>
			)}
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
							<div>{business.business_name}</div>
						</DialogTitle>
						<DialogActions className="cs4116-dialog-actions">
							<Button
								className="cs4116-inq-btn"
								autoFocus
								onClick={handleInquire}
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
								{business.profile_picture ? (
									<img className="cs4116-business-profile-pic" src={business.profile_picture}></img>
								) : (
									<img src="https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png"></img>
								)}
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
									{listofTiers.map((tier) => (
										<MenuItem
											key={tier.tier_id}
											value={tier.name}
											disabled={isTierDisabled}
										>
											{tier.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<Typography
								className="cs4116-dialog-data"
								variant="body1"
								component="div"
							>
								<div className="cs4116-dialog-text-container">
									<p style={{ marginBottom: "0", marginTop: "5px", fontSize: "20px"}}>Business Rating:&nbsp;</p>
								<Rating className="cs4116-dialog-rating" value={business.avg_rating} precision={0.1} readOnly />
								</div>
								{selectedTier && (
									<div className="cs4116-dialog-info">

										<div className="cs4116-dialog-text-container">Tier Price:
											<p className="cs4116-dialog-text">
												&nbsp;€{listofTiers.find((tier) => tier.name === selectedTier)?.price}
											</p>
										</div>
										<div className="">Tier Description:
											<p className="cs4116-dialog-text">
												{listofTiers.find((tier) => tier.name === selectedTier)?.description}
											</p>

										</div>
									</div>
								)}
							</Typography>
						</DialogContent>
						<div className="cs4116-dialog-reviews">
							{loading ? (
								<Loading />
							) :
								userReviews.length > 0 ? (
									<div className="cs4116-grid-review">
										{userReviews.map((userReview) => (
											<div
												key={`${userReview.data.user_id}${userReview.review.review_id}`}
												className="cs4116-grid-review-item"
											>
												<div className="cs4116-grid-splitter">
													<div>
														<p>{userReview.data.name}</p>
														<h3>{userReview.review.service_name}</h3>
														<p>{userReview.review.description}</p>
														<div
															style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
														>
															<p className="cs4116-rating-grid">{userReview.review.rating}</p>
															<Rating
																value={userReview.review.rating}
																precision={0.1}
																readOnly
															/>
														</div>
													</div>
													<div>
														<Button
															className="cs4116-inq-btn"
															autoFocus
															onClick={handleContact}
														>
															Contact
														</Button>
													</div>
												</div>
											</div>
										))}

									</div>
								) : (
									<p style={{ color: "red", position: "relative" }}>This Service Has No Reviews</p>
								)}
						</div>
					</div>
				</Dialog>
			)}
		</div>
	)
}

export default ServiceDialog
