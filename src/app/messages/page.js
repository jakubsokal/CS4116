"use client"

import Navbar from '@/components/Navbar'
import useSessionCheck from '@/utils/hooks/useSessionCheck'
import '@/styles/Messages.css'
import { useState, useEffect, useCallback } from 'react'
import Loading from '@/components/Loading'
import { useRouter } from 'next/navigation'

export default function Messages() {
  const [load, setLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [currentSession, setSession] = useState([])
  const [userDetails, setUserDetails] = useState([])
  const { session, loading } = useSessionCheck()
  const router = useRouter()

  const getUserDetails = useCallback(async (participantId) => {
    const res = await fetch(`/api/user/getUserDetailsId?userId=${participantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await res.json()

    if (result.data) {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        [participantId]: result.data,
      }))
    }
  }, [])

  const getMessages = useCallback(async () => {
    setLoading(true)

    try {
      const messageRes = await fetch(`/api/messages/getMessagesByUserId?userId=${currentSession?.user?.user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const messageResult = await messageRes.json()

      if (messageResult.data) {
        setMessages(messageResult.data)
        messageResult.data.forEach((message) => {
          if (!userDetails[message.participantId]) {
            getUserDetails(message.participantId)
          }
        })
      }
    } catch (error) {
      console.error("Error searching for messages:", error)
    } finally {
      setLoading(false)
    }
  }, [getUserDetails, currentSession?.user?.user_id, userDetails])

  useEffect(() => {
    if (loading) {
      return
    }
  
    if (session) {
      setSession(session)
    } else {
      router.push('/login')
    }
  
    if (currentSession.user?.user_id) {
      getMessages()
    }
  }, [currentSession?.user?.user_id, getMessages, session, router, loading])

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <Navbar />
      <div className="cs4116-messages-container">
        <div className="cs4116-messages-list" style={{ padding: "0", top: "50%" }}>
          {messages && messages.length > 0 ? (
            messages.map((message, index) => (
              <div 
                key={`${message.convo_id}-${index}`} 
                className={`cs4116-message-item ${message.unreadMessages > 0 ? 'unread' : ''}`}
              >
                <div className="cs4116-message-sender" style={{ color: "black" }}>
                  {message.unreadMessages > 0 && (
                    <div className="cs4116-unread-messages">{message.unreadMessages}</div>
                  )}
                  <div className="cs4116-message-sender-name">
                    {userDetails[message.participantId]?.name || <Loading />}
                  </div>
                </div>
                <button className="cs4116-message-button" onClick={() => router.push(`/messages/${message.convo_id}`)}>
                  Open Chat
                </button>
              </div>
            ))
          ) : (
            <div className="cs4116-no-messages">No messages available</div>
          )}
        </div>
      </div>
    </div>
  )
} 