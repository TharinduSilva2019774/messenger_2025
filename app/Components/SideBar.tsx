"use client";
import { auth, currentUser } from '@clerk/nextjs/server'
import styles from "./SideBar.module.css";
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function SideBar() {

    const {user}= useUser();

    const { firstName, lastName, imageUrl } = user || {
        firstName: "",
        lastName: "",
        imageUrl: "",
      };

    const pathname = usePathname();
    return (
        <div className={styles.SideBarContainer}>
            <div className={styles.userProfile}>
                <div className={styles.imageOverLay}>
                    {user && <Image src={imageUrl} alt='profile' height="40" width="100" className={styles.userImage}/>}
                </div>
                <div className={styles.userName}>
                    <p >{firstName}</p>
                    <p>{lastName}</p>
                </div>
            </div>
            <div className={styles.chatList}>
                <div className={pathname == "/directChat"? styles.chatButtonActive : styles.chatButton}>
                    <Link href="/directChat" >
                        <p>Hasal Chat</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SideBar;