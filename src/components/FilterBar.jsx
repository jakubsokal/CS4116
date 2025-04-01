"use client"
import React, {Suspense} from "react";
import "@/styles/filterbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Slider from "@/components/PriceSlider";
import dynamic from "next/dynamic";
const LocationSelector = dynamic(() => import('@/components/LocationSelection'), { ssr: false });
import Rating from "@/components/ReviewRating";

const FilterBar = () => {
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
								<li>
									<label className="soccer">Soccer</label>
									<input type="checkbox" id="soccer" />
								</li>
								<li>
									<label className="gaa">Football</label>
									<input type="checkbox" id="gaa" />
								</li>
								<li>
									<label className="hurling">Hurling</label>
									<input type="checkbox" id="hurling" />
								</li>
								<li>
									<label className="rugby">Rugby</label>
									<input type="checkbox" id="rugby" />
								</li>
								<li>
									<label className="bball">Basketball</label>
									<input type="checkbox" id="bball" />
								</li>
								<li>
									<label className="gym">Gym</label>
									<input type="checkbox" id="gym" />
								</li>
								<li>
									<label className="swimming">Swimming</label>
									<input type="checkbox" id="swimming" />
								</li>
								<li>
									<label className="running">Running</label>
									<input type="checkbox" id="running" />
								</li>
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
						<Slider />
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
								<Rating />
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
							<LocationSelector />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilterBar;
