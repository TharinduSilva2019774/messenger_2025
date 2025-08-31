"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import ChatMessage, { SampleMessage, sampleMessages } from '../Components/ChatMessage';
import { getAllMessages, postMessage } from '../lib/api';
import { toUiMessage, setCurrentClarkId } from '../lib/mapper';
import { useUser } from '@clerk/nextjs';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function page() {
  const [messages, setMessages] = useState<SampleMessage[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState('');
  const {user}= useUser();
  const [client, setClient] = useState<Client | null>(null);


  const sendMessage = (message:String,userId:String) => {
    if (client) {
      client.publish({
        destination: "/app/chat.send",
        body: JSON.stringify({ clarkId: userId, message: message }),
      });
    }
  };

  useEffect(() => {
    // keep mapper aware of the current user id to identify own messages
    setCurrentClarkId(user?.id ?? null);
  }, [user?.id]);

  useEffect(() => {
    // Establish a connection to the Spring Boot WebSocket endpoint using SockJS
  // Use environment variable for WebSocket server address
  const wsServer = process.env.NEXT_PUBLIC_WS_SERVER || "http://localhost:8080/ws";
  const sock = new SockJS(wsServer);
    // Create a STOMP client for messaging over the WebSocket
    const stompClient = new Client({
      webSocketFactory: () => sock, // Use SockJS for WebSocket fallback support
      reconnectDelay: 5000, // Try to reconnect every 5 seconds if disconnected
      onConnect: () => {
        // Callback when STOMP connection is established
        console.log("Connected to STOMP");

        // Subscribe to the '/topic/messages' channel to receive broadcasted messages
        stompClient.subscribe("/topic/messages", (msg) => {
          // Parse the incoming message body from JSON
          const body = JSON.parse(msg.body);
          // Example: log the received message payload
          console.log(body)
          // Map the received message responses to UI message format
          const mapped = (body.messageResponses.map(toUiMessage));
          // Update the local state with the new messages
          setMessages(mapped)
        });
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

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
   
    if (user && newMessage.trim()) {
      const newMsg: SampleMessage = {
        id: `msg_${Date.now()}`,
        message: newMessage.trim(),
        sender: 'You',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwnMessage: true
      };
      // postMessage(newMessage.trim(),user.id);
      sendMessage(newMessage.trim(),user.id)
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    }
  };

  const getAllUIMessages = async () => {
    if(user){
      const apiMessages = await getAllMessages(user.id);
      console.log(apiMessages)
      const mapped = (apiMessages.messageResponses.map(toUiMessage));
      setMessages(mapped)
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
