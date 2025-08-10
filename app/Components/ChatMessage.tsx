"use client";

import { useState } from 'react';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
  message: string;
  sender: string;
  timestamp: string;
  isOwnMessage?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, newMessage: string) => void;
  messageId: string;
}

// Sample data interface for testing
export interface SampleMessage {
  id: string;
  message: string;
  sender: string;
  timestamp: string;
  isOwnMessage: boolean;
}

// Sample data for testing
export const sampleMessages: SampleMessage[] = [
  {
    id: "msg_1",
    message: "Hey! How's it going?",
    sender: "Alice",
    timestamp: "2:30 PM",
    isOwnMessage: false
  },
  {
    id: "msg_2",
    message: "I'm doing great! Just finished working on a new project.",
    sender: "You",
    timestamp: "2:32 PM",
    isOwnMessage: true
  },
  {
    id: "msg_3",
    message: "That sounds exciting! What kind of project?",
    sender: "Alice",
    timestamp: "2:33 PM",
    isOwnMessage: false
  },
  {
    id: "msg_4",
    message: "It's a messaging app with some cool features like message editing and deletion.",
    sender: "You",
    timestamp: "2:35 PM",
    isOwnMessage: true
  },
  {
    id: "msg_5",
    message: "Wow, that's impressive! Can't wait to see it in action.",
    sender: "Alice",
    timestamp: "2:36 PM",
    isOwnMessage: false
  }
];

function ChatMessage({ 
  message, 
  sender, 
  timestamp, 
  isOwnMessage = false, 
  onDelete, 
  onEdit, 
  messageId 
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editMessage, setEditMessage] = useState(message);
  const [showActions, setShowActions] = useState(false);

  const handleEdit = () => {
    if (onEdit && editMessage.trim() !== message) {
      onEdit(messageId, editMessage.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditMessage(message);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(messageId);
    }
  };

  return (
    <div 
      className={`${styles.messageContainer} ${isOwnMessage ? styles.ownMessage : styles.otherMessage}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={styles.messageHeader}>
        <span className={styles.sender}>{sender}</span>
        <span className={styles.timestamp}>{timestamp}</span>
      </div>
      
    
        <div className={styles.messageContent}>
          {message}
        </div>

      {showActions && (
        <div className={styles.actionButtons}>
          <button 
            // onClick={() => setIsEditing(true)}
            className={`${styles.actionButton} ${styles.editButton}`}
            title="Edit message"
          >
            ✏️
          </button>
          <button 
            // onClick={handleDelete}
            className={`${styles.actionButton} ${styles.deleteButton}`}
            title="Delete message"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;