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
        <span className={styles.sender}>{isOwnMessage ? "You" : sender}</span>
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