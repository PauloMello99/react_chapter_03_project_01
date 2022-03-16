import { signIn, signOut, useSession } from "next-auth/react";

import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";

import styles from "./styles.module.scss";

function SignInButton() {
  const { status, data } = useSession();

  const handleSignInWithGithub = () => signIn("github");

  const handleSignOut = () => signOut();

  return status === "authenticated" ? (
    <button
      type="button"
      className={styles.signInButton}
      onClick={handleSignOut}
    >
      <FaGithub color="#04d361" />
      {data?.user?.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}
      onClick={handleSignInWithGithub}
    >
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  );
}

export default SignInButton;
