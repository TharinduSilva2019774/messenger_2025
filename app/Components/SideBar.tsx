"use client";
import { auth, currentUser } from "@clerk/nextjs/server";
import styles from "./SideBar.module.css";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  const pathname = usePathname();
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

      {chats.map((chat) => (
        <div className={styles.chatList} key={chat.id}>
          <div
            className={
              pathname == "/directChat"
                ? styles.chatButtonActive
                : styles.chatButton
            }
          >
            <Link href="/directChat">
              <p>{chat.name}</p>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SideBar;
