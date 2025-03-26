import { useState } from "react";

export default function InquiryPopup({ senderId, receiverId, onClose }) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/inquiries", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_id: senderId,
        receiver_id: receiverId,
      }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div className="popup">
      <h2>Send Inquiry</h2>
      <form onSubmit={handleSubmit}>
        <button type="submit">Send</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
