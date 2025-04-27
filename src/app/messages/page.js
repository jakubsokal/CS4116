"use client"

//remembver tomnorrow look at the getting convos as there could be a better way to do it 

/*if (message.inquiry_id) {
            getSeriveName(message.inquiry_id, message.convo_id)
          }*/

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
  const [serviceName, setServiceName] = useState("")
  const [messageRequests, setMessageRequests] = useState([]);

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

  const getSeriveName = useCallback(async (InquiryId, messageId) => {
    if (!InquiryId) return
    try {
      const res = await fetch(`/api/messages/getSerivceNameByConvoId?InquiryId=${InquiryId}`, {
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
        messageResult.data.forEach((message) => {
          console.log(!message?.serviceName )
          if (message.inquiry_id && !message?.serviceName) {
            getSeriveName(message.inquiry_id, message.convo_id)
          }
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
  }, [getUserDetails, currentSession?.user?.user_id, userDetails, getSeriveName])

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

  const handleMessageRequest = async (requestId, action) => {
    try {
        const response = await fetch('/api/messages/handleMessageRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                request_id: requestId,
                action
            }),
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || `Failed to ${action} message request`);
        }

        // Refresh message requests and messages
        getMessageRequests();
        getMessages();
        
        alert(`Message request ${action}ed successfully!`);
    } catch (error) {
        console.error(`Error ${action}ing message request:`, error);
        alert(`Failed to ${action} message request. Please try again.`);
    }
  };

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
      getMessageRequests()
    }
  }, [currentSession?.user?.user_id, getMessages, getMessageRequests, session, router, loading])

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <Navbar />
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
                   <span>{userDetails[message.participantId]?.name || <Loading />}</span> 
                    <span>{message.serviceName !== null ? message.serviceName : ""}</span>
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