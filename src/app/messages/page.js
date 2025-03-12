"use client";

import Navbar from '@/components/Navbar';
import '@/styles/Messages.css';

export default function Messages() {
  return (
    <div>
      <Navbar />
      <div className="cs4116-messages-container">
        <h1>Messages</h1>
        <div className="cs4116-messages-list">
        </div>
      </div>
    </div>
  );
} 