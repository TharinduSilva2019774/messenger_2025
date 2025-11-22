"use client";
import styles from "./SideBar.module.css";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllChats } from "../lib/api";
import { ChatDto } from "../lib/mapper";

function SideBar() {
  const { user } = useUser();

  const [chats, setChats] = useState<ChatDto[]>([]);

  if (user) {
    console.log(user);
  }

  const { firstName, lastName, imageUrl } = user || {
    firstName: "",
    lastName: "",
    imageUrl: "",
  };

  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        const chatList = await getAllChats(user.id);
        setChats(chatList.getChatDtoList);
        console.log(chatList.getChatDtoList);
      }
    };
    fetchChats();
  }, [user]);

  const searchParams = useSearchParams();
  const selectedChatId = searchParams?.get("id");
  return (
    <div className={styles.SideBarContainer}>
      <div className={styles.userProfile}>
        <div className={styles.imageOverLay}>
          {user && (
            <Image
              src={imageUrl}
              alt="profile"
              height="40"
              width="100"
              className={styles.userImage}
            />
          )}
        </div>
        <div className={styles.userName}>
          <p>{firstName}</p>
          <p>{lastName}</p>
        </div>
      </div>
      <div className={styles.chatList}>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={
              // compare the id query param to the chat id to determine active state
              String(selectedChatId) === String(chat.id)
                ? styles.chatButtonActive
                : styles.chatButton
            }
          >
            <Link href={`/directChat/${chat.id}`} className={styles.chatLink}>
              <div className={styles.chatInfo}>
                <p className={styles.chatName}>{chat.name}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideBar;
