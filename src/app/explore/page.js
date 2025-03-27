"use client"

import Navbar from "@/components/Navbar"
import Filterbar from "@/components/FilterBar"
import Loading from "@/components/Loading"
import useSessionCheck from "@/utils/hooks/useSessionCheck"
import { useEffect, useState } from "react"
import ServiceDialog from "@/components/ServiceDialog"
import Rating from "@mui/material/Rating"
import "@/styles/explore.css"

export default function Explore() {
  const [filters, setFilters] = useState({})
  const [serviceList, setListings] = useState([])
  const [load, setLoading] = useState(true)

  const serviceApi = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/service/getAllServices", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        throw new Error(res.error)
      }

      const result = await res.json()

      if (result.data) {
        setListings(result.data)
      }
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      await serviceApi()
      setLoading(false)
    }

    fetchListings()
  }, [filters])

  const { loading } = useSessionCheck()

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <Navbar />
      <Filterbar />
      <div className="container">
        {loading || load ? (
          <Loading />
        ) : serviceList.length > 0 ? (
          <div className="cs4116-grid-explore">
            {serviceList.map((service) => (
              <div
                key={service.service_id}
                className="cs4116-grid-item-explore"
              >
                <h3>{service.service_name}</h3>
                <p>{service.category}</p>
                <p>{service.description}</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <p className="cs4116-rating-grid">{service.avg_rating}</p>
                  <Rating value={service.avg_rating} precision={0.1} readOnly />
                </div>
                <p>Location: {service.location}</p>
                <ServiceDialog service={service}/>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "red", position: "relative" }}>
            No services found
          </p>
        )}
      </div>
    </div>
  )
}
