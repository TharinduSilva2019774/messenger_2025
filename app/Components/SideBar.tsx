"use client";
import { auth, currentUser } from '@clerk/nextjs/server'
import styles from "./SideBar.module.css";
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

function SideBar() {

    const {user}= useUser();

    const { firstName, lastName, imageUrl } = user || {
        firstName: "",
        lastName: "",
        imageUrl: "",
      };
    console.log(user)
    return (
        <div className={styles.SideBarContainer}>
            <div className={styles.userProfile}>
                {user && <Image src={imageUrl} alt='profile' height="40" width="40"/>}
                <div>
                    <p>{firstName}</p>
                    <p>{lastName}</p>
                </div>
            </div>

            <h1 className={styles.h1}>SideBar</h1>
        </div>
    )
}

export default SideBar;