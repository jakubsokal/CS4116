"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Loading from '@/components/Loading';
import '@/styles/Chat.css';
import useSessionCheck from '@/utils/hooks/useSessionCheck';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const params = useParams();
  const router = useRouter();
  const { session, loading: sessionLoading } = useSessionCheck();
  const chatId = params.chatId;

  useEffect(() => {
    console.log('Chat ID:', chatId);
    console.log('Session:', session);
    console.log('Session Loading:', sessionLoading);
    
    const fetchMessages = async () => {
      if (!chatId) {
        console.log('No chat ID provided');
        setError('Invalid chat ID');
        return;
      }

      if (!session?.user?.user_id) {
        console.log('No user session:', session);
        setError('Please log in to view messages');
        return;
      }

      try {
        console.log('Fetching messages for chat:', chatId);
        console.log('User ID:', session.user.user_id);
        const response = await fetch(`/api/messages/getChatMessages?chatId=${chatId}`, {
          headers: {
            'x-user-id': session.user.user_id,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        
        console.log('Response data:', data);
        
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
          console.log('Unread messages count:', unreadMessages);
          setUnreadCount(unreadMessages);
          
          const uniqueUserIds = [...new Set(data.data.map(msg => [msg.sender_id, msg.receiver_id]).flat())];
          console.log('Unique user IDs:', uniqueUserIds);
          uniqueUserIds.forEach(userId => {
            fetchUserDetails(userId);
          });
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserDetails = async (userId) => {
      try {
        console.log('Fetching user details for:', userId);
        const response = await fetch(`/api/user/getUserDetailsId?userId=${userId}`);
        const data = await response.json();
        console.log('User details response:', data);
        
        if (data.data) {
          setUserDetails(prev => ({
            ...prev,
            [userId]: data.data
          }));
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (!sessionLoading && session?.user?.user_id) {
      fetchMessages();
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
                </div>
                <div className="message-sender">
                  {userDetails[message.sender_id]?.name || 'User'}
                </div>
              </div>
            ))
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