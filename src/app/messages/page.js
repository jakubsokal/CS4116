"use client"

import Navbar from '@/components/Navbar'
import useSessionCheck from '@/utils/hooks/useSessionCheck'
import '@/styles/Messages.css'
import { useState, useEffect, useCallback } from 'react'
import Loading from '@/components/Loading'
import { useRouter } from 'next/navigation'
import BusinessNavbar from '@/components/BusinessNavbar';

export default function Messages() {
  const [load, setLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [currentSession, setSession] = useState([])
  const [userDetails, setUserDetails] = useState([])
  const { session, loading } = useSessionCheck()
  const router = useRouter()
  const [messageRequests, setMessageRequests] = useState([]);
  const [messsagesLoaded, setMessagesLoaded] = useState("")

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

  const getServiceName = useCallback(async (InquiryId, messageId) => {
    if (!InquiryId) return
    try {
      const res = await fetch(`/api/messages/getServiceNameByConvoId?InquiryId=${InquiryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await res.json()
      if (result.data) {
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.convo_id === messageId
              ? { ...message, serviceName: result.data[0].services.service_name }
              : message
          )
        )
      }
    } catch (error) {
      console.error("Error fetching service name:", error)
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
        await Promise.all(messageResult.data.map(async (message) => {
          if (message.inquiry_id) {
            await getServiceName(message.inquiry_id, message.convo_id)
          }
          if (!userDetails[message.participantId]) {
            await getUserDetails(message.participantId)
          }
        }))
        setLoading(false)
      }
    } catch (error) {
      console.error("Error searching for messages:", error)
    } finally {
      setLoading(false)
    }
  }, [getUserDetails, currentSession?.user?.user_id, userDetails, getServiceName])

  const getMessageRequests = useCallback(async () => {
    if (!currentSession?.user?.user_id) return;

    try {
      const res = await fetch(`/api/messages/getMessageRequests?userId=${currentSession.user.user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();
      if (result.data) {
        setMessageRequests(result.data);
      }
    } catch (error) {
      console.error("Error fetching message requests:", error);
    }
  }, [currentSession?.user?.user_id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (loading) {
        return
      }

      if (session) {
        setSession(session)
      } else {
        router.push('/login')
      }

      if (currentSession.user?.user_id && !messsagesLoaded) {
        setMessagesLoaded(true)
        await getMessages()
        await getMessageRequests()
      }
    }

    fetchMessages()
  }, [currentSession?.user?.user_id, messsagesLoaded, getMessages, getMessageRequests, session, router, loading])

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      {session?.business ? (
        <BusinessNavbar />
      ) : (<Navbar />)}
      <div className="cs4116-messages-container">
        <div className="cs4116-messages-list">
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
                    {!load ? (
                      <>
                        <span>{userDetails[message.participantId]?.name || <Loading />}</span>
                        <span>{message.serviceName ? message.serviceName : ""}</span>
                      </>
                    ) : <Loading />}
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