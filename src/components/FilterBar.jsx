"use client"
import Slider from "@/components/PriceSlider";
import ReviewRating from "@/components/ReviewRating";
import "@/styles/filterbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import dynamic from "next/dynamic";
import { useState } from "react";
const LocationSelector = dynamic(() => import('@/components/LocationSelection'), { ssr: false });

const FilterBar = ({onCountyChange, onPriceChange, onCategoryChange, onRatingChange, onResetButton, isResetting}) => {
	const [selectedCategories, setSelectedCategories] = useState([]);

	const categoryMap = {
		soccer: 1,
		gaa:2,
		hurling:3,
		rugby:4,
		basketball:5,
		gym:6,
		swimming:7,
		running:8,
	}

	const handleCategoryChange = (e) => {
		const { value, checked } = e.target;
		const categoryInt = parseInt(value, 8);
		let updatedCategories = [...selectedCategories];

		if (checked) {
			updatedCategories.push(categoryInt);
		} else {
			updatedCategories = updatedCategories.filter((category) => category !== categoryInt);
		}

		setSelectedCategories(updatedCategories);

		if (onCategoryChange) {
		onCategoryChange(updatedCategories);
		}
	};

	return (
		<div className="cs4116-filterbar-main">
			<div className="accordion accordion-flush" id="accordionFlushExample">
				<div className="accordion-item">
					<h2 className="accordion-header">
						<button
							className="accordion-button collapsed"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#flush-collapseOne"
							aria-expanded="false"
							aria-controls="flush-collapseOne"
						>
							Category
						</button>
					</h2>
					<div
						id="flush-collapseOne"
						className="accordion-collapse collapse"
						data-bs-parent="#accordionFlushExample"
					>
						<div className="accordion-body">
							<ul>
								{Object.entries(categoryMap).map(([name, id]) => (
									<li key ={id}>
										<label className={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</label>
											<input
												type="checkbox"
												value={id}
												id={name}
												onChange={handleCategoryChange}
												checked={selectedCategories.includes(id)}
											/>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
				<div className="accordion-item">
					<h2 className="accordion-header">
						<button
							className="accordion-button collapsed"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#flush-collapseTwo"
							aria-expanded="false"
							aria-controls="flush-collapseTwo"
						>
							Price
						</button>
					</h2>
					<div
						id="flush-collapseTwo"
						className="accordion-collapse collapse"
						data-bs-parent="#accordionFlushExample"
					>
						<Slider onPriceChange={onPriceChange}
						isResetting={isResetting}/>
					</div>
				</div>
				<div className="accordion-item">
					<h2 className="accordion-header">
						<button
							className="accordion-button collapsed"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#flush-collapseThree"
							aria-expanded="false"
							aria-controls="flush-collapseThree"
						>
							Rating
						</button>
					</h2>
					<div
						id="flush-collapseThree"
						className="accordion-collapse collapse"
						data-bs-parent="#accordionFlushExample"
					>
						<div className="accordion-body">
							<div className="cs4116-rating">
								<ReviewRating onRatingChange={onRatingChange}
								isResetting={isResetting}/>
							</div>
						</div>
					</div>
				</div>
				<div className="accordion-item">
					<h2 className="accordion-header">
						<button
							className="accordion-button collapsed"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#flush-collapseFour"
							aria-expanded="false"
							aria-controls="flush-collapse"
						>
							Location
						</button>
					</h2>
					<div
						id="flush-collapseFour"
						className="accordion-collapse collapse"
						data-bs-parent="#accordionFlushExample"
					>
						<div className="accordion-body">
							<LocationSelector onCountyChange={onCountyChange}/>
						</div>
					</div>
				</div>
			</div>
			<div className="cs4116-filterbar-button">
				<button className="reset-filter-button" onClick={onResetButton}>
					Reset Filters
				</button>
				</div>
		</div>
	);
};

export default FilterBar;
