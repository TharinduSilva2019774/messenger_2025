"use client";
import { useEffect, useState, useRef, Suspense, use } from "react";

import styles from "./page.module.css";
import ChatMessage, { MessageModel } from "../../Components/ChatMessage";
import { getAllMessages, postMessage } from "../../lib/api";
import { toUiMessage, setCurrentClarkId } from "../../lib/mapper";
import { useUser } from "@clerk/nextjs";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { emojis } from "@/app/lib/emoji";
import { useAuth } from "@clerk/nextjs";
type Props = { params: Promise<{ chatId: string }> };

function DirectChatPage({ params }: Props) {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useUser();
  const [client, setClient] = useState<Client | null>(null);
  const { chatId } = use(params);
  const [prevScrollHight, setPrevScrollHight] = useState(0);
  const [showEmoji, setShowEmoji] = useState(false);
  const [buttonEmoji, setButtonEmoji] = useState("😅");
  const { getToken } = useAuth();
  const sendMessage = (message: String, userId: String, chatId: String) => {
    if (client) {
      client.publish({
        destination: "/app/chat.send",
        body: JSON.stringify({
          clarkId: userId,
          message: message,
          chatId: chatId,
        }),
      });
    }
  };
  const playSound = () => {
    const audio = new Audio("Oii.mp3");
    audio.play().catch(() => {
      console.warn("User interaction required before playing sound");
    });
  };
  useEffect(() => {
    // keep mapper aware of the current user id to identify own messages
    setCurrentClarkId(user?.id ?? null);
  }, [user?.id]);

  useEffect(() => {
    // Establish a connection to the Spring Boot WebSocket endpoint using SockJS
    // Use environment variable for WebSocket server address
    const token = getToken();
    const wsServer =
      process.env.NEXT_PUBLIC_WS_SERVER || "http://localhost:8080/ws";
    const sock = new SockJS(wsServer);
    // Create a STOMP client for messaging over the WebSocket
    const stompClient = new Client({
      webSocketFactory: () => sock, // Use SockJS for WebSocket fallback support
      reconnectDelay: 5000, // Try to reconnect every 5 seconds if disconnected
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        // Callback when STOMP connection is established
        console.log("Connected to STOMP");

        // Subscribe to the '/topic/messages' channel to receive broadcasted messages
        stompClient.subscribe("/topic/messages", (msg) => {
          // Parse the incoming message body from JSON
          const body = JSON.parse(msg.body);
          // Example: log the received message payload
          console.log(body);
          // Map the received message responses to UI message format
          const mapped = body.messageResponses.map(toUiMessage);
          const last = mapped.at(-1); // or use mapped[mapped.length-1]
          if (last.isOwnMessage === false) {
            playSound();
          }
          // Update the local state with the new messages
          setMessages(mapped);
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
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const handleEdit = (messageId: string, newMessageText: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, message: newMessageText } : msg
      )
    );
  };

  const handleSendMessage = async () => {
    if (user && newMessage.trim()) {
      const newMsg: MessageModel = {
        id: `msg_${Date.now()}`,
        message: newMessage.trim(),
        sender: "You",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwnMessage: true,
      };
      // postMessage(newMessage.trim(),user.id);
      sendMessage(newMessage.trim(), user.id, chatId ?? "");
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
    }
  };

  const getAllUIMessages = async () => {
    if (user) {
      const apiMessages = await getAllMessages(user.id, chatId ?? "");
      console.log(apiMessages);
      const mapped = apiMessages.messageResponses.map(toUiMessage);
      setMessages(mapped);
    }
  };

  useEffect(() => {
    console.log("Fetching messages for chatId:", chatId);
    if (user?.id) {
      getAllUIMessages();
    }
  }, [chatId, user?.id]);

  useEffect(() => {
    console.log("Fetching messages for chatId:", chatId);
  }, []);
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (!emojis.length) return;

    let i = 0; // start at current index (0 = first emoji)
    const id = setInterval(() => {
      i = (i + 1) % emojis.length;
      setButtonEmoji(emojis[i]);
    }, 1000);

    return () => clearInterval(id);
  }, []);
  // Ref for the messages list container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // Reset input height on new message
    setInputHeight(40);
  }, [messages]);

  // Ref for the textarea input
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Function to adjust the height of the textarea based on content
  const setInputHeight = (height?: Number) => {
    const el = textareaRef.current;
    if (!el) return;
    console.log(el);
    // If height is provided, set it directly
    if (height) {
      el.style.height = `${height}px`;
    }
    // Otherwise, auto-adjust based on scroll height
    else if (el.scrollHeight != prevScrollHight && el.scrollHeight > 30) {
      setPrevScrollHight(el.scrollHeight);
      el.style.height = `${prevScrollHight}px`;
    }
  };

  // Adjust input height when message is changing
  useEffect(() => {
    setInputHeight();
  }, [newMessage]);

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
          {/* Dummy div for auto-scroll */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className={styles.inputContainer}>
        <div>
          <span
            className={styles.emoji_button}
            onClick={() => {
              setShowEmoji(!showEmoji);
              setInputHeight();
            }}
          >
            {buttonEmoji}
          </span>
        </div>

        <textarea
          ref={textareaRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a new message..."
          className={styles.messageInput}
        />
      </div>
      <div
        className={`${styles.emojiContainer} ${
          showEmoji ? styles.emojiContainerOpen : ""
        }`}
      >
        <div className={styles.emoji_list}>
          {emojis.map((emoji, index) => (
            <span
              key={index}
              className={styles.emoji_item}
              onClick={() => {
                setNewMessage((prev) => prev + emoji);
                setInputHeight();
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>

      <div className="emojiBox"></div>
    </div>
  );
}

export default function Page(props: Props) {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <DirectChatPage {...props} />
    </Suspense>
  );
}
