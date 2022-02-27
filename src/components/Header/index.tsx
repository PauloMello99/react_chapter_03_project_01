import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import LogoImg from "../../../public/images/logo.svg";
import ActiveLink from "../ActiveLink";

import SignInButton from "../SignInButton";

import styles from "./styles.module.scss";

function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src={LogoImg} alt="ig.news" />
        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}

export default Header;
