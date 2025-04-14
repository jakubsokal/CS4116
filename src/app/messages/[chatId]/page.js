"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Loading from '@/components/Loading';
import '@/styles/Chat.css';
import useSessionCheck from '@/utils/hooks/useSessionCheck';

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

  const params = useParams();
  const router = useRouter();
  const { session, loading: sessionLoading } = useSessionCheck();
  const chatId = params.chatId;

  const reportReasons = [
    "Inappropriate Content",
    "Spam",
    "Harassment",
    "Offensive Language"
  ];

  const fetchChatPartnerDetails = useCallback(async (chatPartnerId) => {
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
  }, []);

  const fetchMessages = useCallback(async () => {
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
        setMessages(data.data);
        const unreadMessages = data.data.filter(msg => 
          msg.receiver_id === session.user.user_id && 
          msg.chat_id === parseInt(chatId) && 
          msg.read === 0
        ).length;
        setUnreadCount(unreadMessages);
        
        const chatPartnerId = data.data[0]?.sender_id === session.user.user_id 
          ? data.data[0]?.receiver_id 
          : data.data[0]?.sender_id;
        
        if (chatPartnerId) {
          fetchChatPartnerDetails(chatPartnerId);
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [chatId, session, fetchChatPartnerDetails]);

  useEffect(() => {
    if (!sessionLoading && session?.user?.user_id) {
      fetchMessages();
    }
  }, [chatId, session, sessionLoading, fetchMessages]);

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
    if (!newMessage.trim() || !session?.user?.user_id) return;

    try {
      const response = await fetch('/api/messages/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message_text: newMessage.trim(),
          sender_id: session.user.user_id,
          receiver_id: messages[0]?.sender_id === session.user.user_id 
            ? messages[0]?.receiver_id 
            : messages[0]?.sender_id,
          chat_id: chatId
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setNewMessage('');
      fetchMessages();
    } catch (error) {
      setError(error.message);
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
        <Navbar />
        <div className="chat-container">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-page">
        <Navbar />
        <div className="chat-container">
          <div className="error-message">
            <p>Error: {error}</p>
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
      <Navbar />
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-header-content">
            <button onClick={() => router.push('/messages')} className="back-button">
              Back to Messages
            </button>
          </div>
        </div>
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="no-messages">No messages in this conversation</div>
          ) : (
            messages.map((message) => (
              <div
                key={message.message_id}
                className={`message ${message.sender_id === session?.user?.user_id ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  <p className="message-text">{message.message_text}</p>
                  <span className="message-time">
                    {new Date(message.sent_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
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
                </div>
                <div className="message-sender">
                  {message.sender_id === session?.user?.user_id 
                    ? "Me" 
                    : chatPartnerDetails[message.sender_id]?.name || 'User'}
                </div>
              </div>
            ))
          )}
        </div>
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
