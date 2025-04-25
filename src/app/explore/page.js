"use client"

import Filterbar from "@/components/FilterBar"
import Loading from "@/components/Loading"
import Navbar from "@/components/Navbar"
import ServiceDialog from "@/components/ServiceDialog"
import "@/styles/explore.css"
import useSessionCheck from "@/utils/hooks/useSessionCheck"
import Rating from "@mui/material/Rating"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useCallback, useEffect, useState } from "react"


export default function Explore() {
  return(
    <Suspense fallback={<Loading />}>
      <ExplorePage />
    </Suspense>
  )
}

function ExplorePage() {
  const [serviceList, setListings] = useState([])
  const [load, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const [tiers, setTiers] = useState({})
  const router = useRouter()

  const serviceApi = useCallback(async () => {
    setLoading(true)
    const query = searchParams.get("query")
    const location = searchParams.get("location")
    //const category = searchParams.get("category") etc...
    let sendTo = `/api/service/getAllServices`

    //for searching by query and location
    if (query || location) {
      sendTo = `/api/service/getFilteredServices?`
      if (query)
        sendTo += `words=${query}&`
      if (location)
        sendTo += `location=${location}`
    }
    

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

  const handleCountyChange = (location) => {
    const params = new URLSearchParams(searchParams.toString())
    if (location) {
      params.set("location", location)
    } else {
      params.delete("location")
    }
    router.push(`/explore?${params.toString()}`)
  }

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
    <Suspense fallback={<Loading />}>
    <div>
      <Navbar />
      <Filterbar onCountyChange={handleCountyChange}/>
      <div className="explore container">
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
    </Suspense>
  )
}