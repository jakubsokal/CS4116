"use client";

import { useState, useEffect, useCallback, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Loading from '@/components/Loading';
import '@/styles/Chat.css';
import useSessionCheck from '@/utils/hooks/useSessionCheck';
import BusinessNavbar from '@/components/BusinessNavbar';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatPartnerDetails, setChatPartnerDetails] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [receiverId, setReceiverId] = useState(null);
  const [isClosed, setIsClosed] = useState(false);
  const [inquiry, setInquiry] = useState(null);
  const [messageRequestStatus, setMessageRequestStatus] = useState(null);
  const [isConversationAccepted, setIsConversationAccepted] = useState(false);
  const [isConversationRejected, setIsConversationRejected] = useState(false);
  const [isMessageRequestReceiver, setIsMessageRequestReceiver] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { session, loading: sessionLoading } = useSessionCheck();
  const chatId = params.chatId;

  const isBusiness = session?.user?.permission === 1;

  const reportReasons = [
    "Inappropriate Content",
    "Spam",
    "Harassment",
    "Offensive Language"
  ];

  useEffect(() => {
    const checkSession = async () => {
      if (sessionLoading) return;
      if (session == null) {
        router.push('/login');
      } else if (session.user.permission === 2) {
        router.push('/admin');
      }
    }; 
    checkSession();
  }, [session, router, sessionLoading]);

  const fetchChatPartnerDetails = useCallback(async (chatPartnerId) => {
    if (chatPartnerDetails[chatPartnerId]) {
      return;
    }

    try {
      const response = await fetch(`/api/user/getUserDetailsId?userId=${chatPartnerId}`);
      const chatPartnerData = await response.json();
      if (chatPartnerData.data) {
        setChatPartnerDetails(prev => ({
          ...prev,
          [chatPartnerId]: chatPartnerData.data
        }));
      }
    } catch (error) {
      console.error('Error fetching chat partner details:', error);
    }
  }, [chatPartnerDetails]);

  const fetchMessages = useCallback(async () => {
    if(messagesLoaded) return;
    
    if (!chatId) {
      setError('Invalid chat ID');
      return;
    }
    
    if (!session?.user?.user_id) {
      setError('Please log in to view messages');
      return;
    }

    try {
      const response = await fetch(`/api/messages/getChatMessages?chatId=${chatId}`, {
        method: 'GET',
        headers: {
          'x-user-id': session.user.user_id,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.data) {
        setIsClosed(data.isClosed == 1);
        setMessages(data.data);
        const unreadMessages = data.data.filter(msg =>
          msg.receiver_id === session.user.user_id &&
          msg.chat_id === parseInt(chatId) &&
          msg.read === 0
        ).length;
        setUnreadCount(unreadMessages);

        const chatPartnerId = data.receiver_id

        if (chatPartnerId) {
          fetchChatPartnerDetails(chatPartnerId);
        }
        setMessagesLoaded(true);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [chatId, session, fetchChatPartnerDetails, messagesLoaded]);

  const fetchInquiry = useCallback(async () => {
    try {
      const res = await fetch(`/api/inquiries/getByChat?chatId=${chatId}`);
      const data = await res.json();

      if (res.ok && data.inquiryData) {
        setInquiry(data.inquiryData);
        setIsConversationAccepted(true);
      }
    } catch (err) {
      console.error("Error fetching inquiry:", err);
    }
  }, [chatId]);

  const fetchMessageRequestStatus = useCallback(async () => {
    if (!chatId || !session?.user?.user_id) return;
    
    try {
      const res = await fetch(`/api/messages/getMessageRequestStatus?chatId=${chatId}&userId=${session.user.user_id}`);
      const data = await res.json();

      if (res.ok && data) {
        console.log("Inquiry data:", data);
        setMessageRequestStatus(data.status);
        setReceiverId(parseInt(data.receiver_id));
        setIsConversationAccepted(data.status === 1 || !data.request_id);
        setIsConversationRejected(data.status === 2);
        setIsMessageRequestReceiver(data.isReceiver); 
      }
    } catch (err) {
      console.error("Error fetching message request status:", err);
    }
  }, [chatId, session?.user?.user_id]);

  const handleServiceComplete = async () => {
    if (!chatId || !session?.user?.user_id ) return;

    const receiverId = messages[0]?.sender_id === session.user.user_id
      ? messages[0]?.receiver_id
      : messages[0]?.sender_id;

    const messageText = `Thank you so much for completing the service! Please leave a review.`;
    
    setMessagesLoaded(false);
    try {
      const statusResponse = await fetch('/api/messages/updateConversationStatus', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId
        }),
      });

      if (!statusResponse.ok) {
        const statusData = await statusResponse.json();
        throw new Error(statusData.error || 'Failed to update conversation status');
      }

      const response = await fetch('/api/messages/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message_text: messageText,
          sender_id: session.user.user_id,
          receiver_id: receiverId,
          chat_id: chatId,
          isReview: 1,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setMessagesLoaded(false);
      await fetchMessages();
    } catch (err) {
      setError("Failed to complete service: " + err.message);
    }
  };

  const handleMessageRequest = async (action) => {
    if (!chatId || !session?.user?.user_id) return;
    
    try {
      const statusRes = await fetch(`/api/messages/getMessageRequestStatus?chatId=${chatId}&userId=${session.user.user_id}`);
      const statusData = await statusRes.json();
      
      if (!statusData.request_id) {
        setError("Message request not found");
        return;
      }

      const response = await fetch('/api/messages/handleMessageRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_id: statusData.request_id,
          action: action  
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        if (action === 'accept') {
          setIsConversationAccepted(true);
          setIsConversationRejected(false);
        } else {
          setIsConversationAccepted(false);
          setIsConversationRejected(true);
        }
        setMessageRequestStatus(action === 'accept' ? 1 : 2);
      }
    } catch (error) {
      console.error('Error handling message request:', error);
      setError('Failed to handle message request');
    }
  };

    useEffect(() => {
    const fetchData = async () => {
      if (!sessionLoading && session?.user?.user_id && !messagesLoaded) {
        await fetchMessages();
        await fetchInquiry();
        await fetchMessageRequestStatus();
      }
    };
    fetchData();
  }, [chatId, session, sessionLoading, messagesLoaded, fetchMessages, fetchInquiry, fetchMessageRequestStatus]);

  useEffect(() => {
    const pollInterval = setInterval(() => {
      if (session?.user?.user_id && chatId) {
        fetchMessages();
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [session?.user?.user_id, chatId, fetchMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !chatId || !session?.user?.user_id) {
      setError("Missing required information to send message.");
      return;
    }

    if (!isConversationAccepted && messageRequestStatus !== null) {
      setError("Cannot send messages until the conversation is accepted.");
      return;
    }
    
    const receiverId = chatPartnerDetails[1]?.user_id

    if (!receiverId) {
      console.log("Receiver ID:", receiverId);
      setError("Unable to determine message recipient. Please try refreshing the page.");
      return;
    }
    
    if (receiverId === session.user.user_id) {
      setError("You cannot send messages to yourself.");
      return;
    }
    
    setMessagesLoaded(false);
    try {
      const response = await fetch('/api/messages/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message_text: newMessage,
          sender_id: session.user.user_id,
          receiver_id: receiverId,
          chat_id: chatId,
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setNewMessage('');
      setMessagesLoaded(false);
      await fetchMessages(); 
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to send message. Please try again.");
    }
  };

  const handleReportMessage = async (messageId) => {
    if (!reportReason) {
      setErrorMessage('Please select a reason for reporting');
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 3000);
      return;
    }

    if (!session?.user?.user_id) {
      setErrorMessage('You must be logged in to report messages');
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 3000);
      return;
    }

    try {
      const response = await fetch('/api/reports/createReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': session.user.user_id
        },
        body: JSON.stringify({
          message_id: messageId,
          user_id: selectedMessage.sender_id,
          reported_by: session.user.user_id,
          contents: selectedMessage.message_text,
          reason: reportReason,
          reviewed: 0
        })
      });

      const data = await response.json();

      if (data.error) {
        if (data.error.includes('table may not exist')) {
          setErrorMessage('The reporting system is not yet set up. Please try again later.');
        } else {
          setErrorMessage(data.error);
        }
        setShowErrorNotification(true);
        setTimeout(() => setShowErrorNotification(false), 3000);
        return;
      }

      setReportModalOpen(false);
      setReportReason('');
      setSelectedMessage(null);
      setShowSuccessNotification(true);

      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
    } catch (error) {
      console.error('Error reporting message:', error);
      setErrorMessage(error.message);
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 3000);
    }
  };

  const openReportModal = (message) => {
    setSelectedMessage(message);
    setReportModalOpen(true);
  };

  if (sessionLoading || loading) {
    return (
      <div className="chat-page">
        {isBusiness ? (
          <BusinessNavbar />
        ) : ( <Navbar /> )}
        <div className="chat-container">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-page">
        {isBusiness ? (
          <BusinessNavbar />
        ) : ( <Navbar /> )}
        <div className="chat-container">
          <div className="error-message">
            <p style={{color: 'white'}}>Error: {error}</p>
            <button onClick={() => router.push('/messages')} className="back-button">
              Back to Messages
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      {isBusiness ? (
          <BusinessNavbar />
        ) : ( <Navbar /> )}
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-header-content">
            <button onClick={() => router.push('/messages')} className="back-button">
              Back to Messages
            </button>
            {!isConversationAccepted && !isConversationRejected && messageRequestStatus === 0 && isMessageRequestReceiver && (
              <div className="message-request-actions">
                <button 
                  className="accept-button"
                  onClick={() => handleMessageRequest('accept')}
                >
                  Accept
                </button>
                <button 
                  className="reject-button"
                  onClick={() => handleMessageRequest('reject')}
                >
                  Reject
                </button>
              </div>
            )}
            {isBusiness && !isClosed && (
              <button className="cs4116-chat-complete-button" onClick={handleServiceComplete}>
                Mark Service as Completed
              </button>
            )}
          </div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="no-messages">No messages in this conversation</div>
          ) : (
            messages.map((message) => {
              const isReviewMessage = message.isReview === 1 && inquiry?.isReviewed === 0;
              return (
                <div
                  key={message.message_id}
                  className={`message ${message.sender_id === session?.user?.user_id ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    <p className="message-text">{message.message_text}</p>
                    <span className="message-time">
                      {new Date(message.sent_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {message.sender_id !== session?.user?.user_id && (
                      <button
                        className="report-button"
                        onClick={() => openReportModal(message)}
                      >
                        Report
                      </button>
                    )}
                    {isReviewMessage && message.sender_id !== session?.user?.user_id && (
                      <div className="review-message">
                        <button className="review-button" onClick={() => router.push(`/review/${inquiry.inquiry_id}`)}>
                          Leave a Review
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="message-sender">
                    {message.sender_id === session?.user?.user_id
                      ? "Me"
                      : chatPartnerDetails[message.sender_id]?.name || 'User'}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {isClosed ? (
          <div className="pending-conversation-notice">
            <p>This conversation has been closed. You cannot send messages.</p>
          </div>
        ) : isConversationRejected ? (
          <div className="rejected-conversation-notice">
            <p>This conversation has been rejected. You cannot send messages.</p>
          </div>
        ) : isConversationAccepted ? (
          <form onSubmit={handleSendMessage} className="chat-input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="chat-input"
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </form>
        ) : (
          <div className="pending-conversation-notice">
            <p>This conversation is pending acceptance. Messages cannot be sent until the other user accepts the conversation request.</p>
          </div>
        )}

        {reportModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Report Message</h3>
              <div className="report-reasons">
                {reportReasons.map((reason) => (
                  <label key={reason} className="report-reason-option">
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason}
                      checked={reportReason === reason}
                      onChange={(e) => setReportReason(e.target.value)}
                    />
                    {reason}
                  </label>
                ))}
              </div>
              <div className="modal-buttons">
                <button onClick={() => setReportModalOpen(false)}>Cancel</button>
                <button onClick={() => handleReportMessage(selectedMessage.message_id)}>
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccessNotification && (
          <div className="success-notification">
            Message successfully reported
          </div>
        )}

        {showErrorNotification && (
          <div className="error-notification">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
