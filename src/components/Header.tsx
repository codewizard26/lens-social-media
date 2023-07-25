import React from "react";
import styles from "../styles/Header.module.css";
import Link from "next/link";
import SignInButton from "./SignInButton";

export default function Header() {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.left}>
        <Link href={"/"}>
          <img src="/logo.png" alt="logo" className={styles.logo}></img>
        </Link>
        <Link href={"/create"} className={styles.createLink}>
            Create
        </Link>
      </div>

      <div className={styles.right}>
        <SignInButton />
      </div>
    </div>
  );
}
