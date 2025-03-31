"use client"

import Navbar from "@/components/Navbar"
import Filterbar from "@/components/FilterBar"
import Loading from "@/components/Loading"
import useSessionCheck from "@/utils/hooks/useSessionCheck"
import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import ServiceDialog from "@/components/ServiceDialog"
import Rating from "@mui/material/Rating"
import "@/styles/explore.css"

export default function Explore() {
  const [serviceList, setListings] = useState([])
  const [load, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const [tiers, setTiers] = useState({})

  const serviceApi = useCallback(async () => {
    setLoading(true)
    const query = searchParams.get("query")
    const sendTo = (!query)
      ? `/api/service/getAllServices`
      : `/api/service/getFilteredServices?words=${query}`

    try {
      const res = await fetch(sendTo, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "An unknown error occurred while fetching services")
      }

      if (result.data) {
        setListings(result.data)
      }

    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  const getTiers = useCallback(async () => {
    try {
      const tierData = await Promise.all(
        serviceList.map(async (service) => {
          const res = await fetch(`/api/tier/getTierByServiceId?serviceId=${service.service_id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })

          const result = await res.json()

          if (!res.ok) {
            throw new Error(result.error || `Failed to fetch tiers for service ID: ${service.service_id}`)
          }
          return { service_id: service.service_id, tiers: result.data }
        })
      )


      const tierMap = tierData.reduce((acc, { service_id, tiers }) => {
        acc[service_id] = tiers
        return acc
      }, {})

      setTiers(tierMap)
    } catch (error) {
      console.error("Error fetching tiers:", error)
    }
  }, [serviceList])

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      await serviceApi()
      setLoading(false)
    }

    fetchListings()
  }, [serviceApi])

  useEffect(() => {
    if (serviceList.length > 0) {
      getTiers()
    }
  }, [serviceList, getTiers])

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
                <div>
                  <div style={{display: "flex"}}>Price:&nbsp;
                  {tiers[service.service_id] ? (
                    <>
                      {tiers[service.service_id].length > 0 && (
                        <p key={tiers[service.service_id][0].id}>
                          €{tiers[service.service_id][0].price}
                        </p>
                      )}
                      {tiers[service.service_id].length > 1 && (
                        <p key={tiers[service.service_id][tiers[service.service_id].length - 1].id}>
                          -€{tiers[service.service_id][tiers[service.service_id].length - 1].price}
                        </p>
                      )}
                    </>
                  ) : (
                    <Loading />
                  )}
                  </div>
                </div>
                <ServiceDialog service={service} />
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
