"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Loading from '@/components/Loading';
import '@/styles/Chat.css';
import useSessionCheck from '@/utils/hooks/useSessionCheck';
import ReviewForm from '@/components/ReviewPopup';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [inquiry, setInquiry] = useState(null);
  const params = useParams();
  const router = useRouter();
  const { session, loading: sessionLoading } = useSessionCheck();
  const chatId = params.chatId;

  const isBusiness = session?.user?.permission === 1;

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId || !session?.user?.user_id) return;

      try {
        const response = await fetch(`/api/messages/getChatMessages?chatId=${chatId}`, {
          headers: {
            'x-user-id': session.user.user_id,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        setMessages(data.data || []);

        const unread = data.data.filter(msg =>
          msg.receiver_id === session.user.user_id &&
          msg.chat_id === parseInt(chatId) &&
          msg.read === 0
        ).length;

        setUnreadCount(unread);

        const uniqueUserIds = [...new Set(data.data.map(msg => [msg.sender_id, msg.receiver_id]).flat())];
        uniqueUserIds.forEach(userId => fetchUserDetails(userId));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserDetails = async (userId) => {
      try {
        const res = await fetch(`/api/user/getUserDetailsId?userId=${userId}`);
        const data = await res.json();
        if (data.data) {
          setUserDetails(prev => ({ ...prev, [userId]: data.data }));
        }
      } catch (err) {
        console.error('User detail fetch error:', err);
      }
    };

    const fetchInquiry = async () => {
      try {
        const res = await fetch(`/api/conversations/getByChat?chatId=${chatId}`);
        const data = await res.json();
        if (res.ok) setInquiry(data);
      } catch (err) {
        console.error("Error fetching inquiry:", err);
      }
    };

    if (!sessionLoading && session?.user?.user_id) {
      fetchMessages();
      fetchInquiry();
    }
  }, [chatId, session, sessionLoading]);

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
            {unreadCount > 0 && (
              <div className="unread-messages-indicator">
                {unreadCount}
              </div>
            )}
            {isBusiness && (
              <button className="btn btn-success">
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
              const isReviewForm = message.message_text?.startsWith("__review_form__");
              const inquiryId = isReviewForm ? message.message_text.split("::")[1] : null;

              return (
                <div
                  key={message.message_id}
                  className={`message ${message.sender_id === session?.user?.user_id ? 'sent' : 'received'} ${isReviewForm ? 'review-form-message' : ''}`}
                >
                  <div className="message-content">
                    {isReviewForm && inquiryId ? (
                      <ReviewForm
                        inquiry={{ inquiry_id: inquiryId }}
                        onComplete={() =>
                          setMessages((prev) =>
                            prev.filter((msg) => msg.message_id !== message.message_id)
                          )
                        }
                      />
                    ) : (
                      <>
                        <p className="message-text">{message.message_text}</p>
                        <span className="message-time">
                          {new Date(message.sent_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="message-sender">
                    {userDetails[message.sender_id]?.name || 'User'}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            placeholder="Type a message..."
            className="chat-input"
          />
          <button className="send-button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
