"use client";

import { useState } from "react";
import styles from "./ChatMessage.module.css";

interface ChatMessageProps {
  message: string;
  sender: string;
  timestamp: string;
  isOwnMessage?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, newMessage: string) => void;
  onAddToAIContext?: (messageId: string, message: string) => void;
  messageId: string;
  isRead: boolean;
}

// Sample data interface for testing
export interface MessageModel {
  id: string;
  message: string;
  sender: string;
  timestamp: string;
  isOwnMessage: boolean;
  isRead: boolean;
}

function ChatMessage({
  message,
  sender,
  timestamp,
  isOwnMessage = false,
  onDelete,
  onEdit,
  onAddToAIContext,
  messageId,
  isRead,
}: ChatMessageProps) {
  const [isAIContext, setIsAIContext] = useState(styles.editButton);
  const [editMessage, setEditMessage] = useState(message);
  const [showActions, setShowActions] = useState(false);
  const [deleteTimeout, setDeleteTimeout] = useState(200);
  const handleEdit = () => {
    if (onEdit && editMessage.trim() !== message) {
      onEdit(messageId, editMessage.trim());
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(messageId);
    }
  };
  return (
    <div
      className={`${styles.messageContainer} ${
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setTimeout(() => setShowActions(false), deleteTimeout);
      }}
    >
      <div className={styles.messageHeader}>
        <span className={styles.sender}>{isOwnMessage ? "You" : sender}</span>
        <span className={styles.timestamp}>{timestamp}</span>
      </div>

      <div className={styles.messageContent}>{message}</div>

      {showActions && (
        <div className={styles.actionButtons}>
          <button
            onClick={() => {
              onAddToAIContext?.(messageId, message);
              setIsAIContext(styles.editButtonAfterClick);
            }}
            className={`${styles.actionButton} ${isAIContext}`}
            title="AI context"
          >
            🦾
          </button>
          <button
            onClick={handleDelete}
            className={`${styles.actionButton} ${styles.deleteButton}`}
            title="Delete message"
            onMouseEnter={() => {
              setShowActions(true);
              setDeleteTimeout(10000);
            }}
            onMouseLeave={() => {
              setTimeout(() => setShowActions(false), 500);
            }}
          >
            🗑️
          </button>
          {isOwnMessage ? <button
            onClick={() => {}}
            className={`${styles.actionButton} ${isAIContext}`}
            title="AI context"
          >
            {isRead ? "✅" : "⏳"}  
          </button> : null}
          
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
