"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import ChatMessage, { SampleMessage, sampleMessages } from '../Components/ChatMessage';
import { getAllMessages } from '../lib/api';
import { toUiMessage } from '../lib/mapper';
import { useUser } from '@clerk/nextjs';

export default function page() {
  const [messages, setMessages] = useState<SampleMessage[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState('');
  const {user}= useUser();

  const handleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const handleEdit = (messageId: string, newMessageText: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, message: newMessageText }
          : msg
      )
    );
  };


  const handleSendMessage = async () => {
   
    if (newMessage.trim()) {
      const newMsg: SampleMessage = {
        id: `msg_${Date.now()}`,
        message: newMessage.trim(),
        sender: 'You',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwnMessage: true
      };
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    }
  };

  


  const getAllUIMessages = async () => {
    if(user){
      const apiMessages = await getAllMessages(user.id);
      console.log(apiMessages)
      const test = (apiMessages.messageResponses.map(toUiMessage));
      setMessages(test)
    }
  }

  useEffect(() => {
    getAllUIMessages()
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.chatContainer}>
        <div className={styles.messagesList}>
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              messageId={msg.id}
              message={msg.message}
              sender={msg.sender}
              timestamp={msg.timestamp}
              isOwnMessage={msg.isOwnMessage}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>

      <div className={styles.inputContainer}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a new message..."
          className={styles.messageInput}
          rows={3}
        />
        <button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className={styles.sendButton}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}
