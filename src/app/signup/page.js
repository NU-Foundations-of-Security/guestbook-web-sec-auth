//Next JS/React version of the guestbook

"use client";

import styles from './page.module.css'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const [failedCreationMessage, setFailedMessage] = useState(null);
  const router = useRouter();

  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const clearRefs = () => {
    emailRef.current.value = "";
    usernameRef.current.value = "";
    passwordRef.current.value = "";
  }

  const createAccount = async(event) => {
    event.preventDefault();

    const email = event.target[0].value;
    const username = event.target[1].value;
    const password = event.target[2].value;

    const body = {
        email: email,
        username: username,
        password: password
    };   
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    fetch("/api/create_account", requestOptions)
      .then(async (res) => {
        const response = await res.json();
        if (!res.ok) setFailedMessage(response);
        else {
          setFailedMessage(() => {
            clearRefs();
            router.replace("/login");
            return null;
          });
        }
      });
  }

  useEffect(() => {
    if (window.localStorage.getItem("guestbook-jwt"))
        router.replace("/home");
  })

  return (
    <main className={styles.main}>
      <div>
        <form>
          Already have an account?
          <button type="submit" formAction="/login">Login</button>
        </form>
      </div>
      <div className={styles["input-block"]}>
        <form className={styles["input-section"]} onSubmit={createAccount}>
            <table>
                <tbody>
                    <tr>
                        <td>Enter your email address: </td>
                        <td><input type="text" ref={emailRef} placeholder='Email address' required/></td>
                    </tr>
                    <tr>
                        <td>Create a username: </td>
                        <td><input type="text" ref={usernameRef} placeholder='Username' required/></td>
                    </tr>
                    <tr>
                        <td>Create a password according to the requirements (8 characters or more, at least 1 uppercase letter, lower case letter, digit, and special character ($@%#*!?)): </td>
                        <td>          <input type="password" ref={passwordRef} placeholder='Password' required/></td>
                    </tr>
                    {failedCreationMessage &&
                        <tr>
                            <div><font color="red">{failedCreationMessage}</font></div>
                        </tr>
                    }
                    <tr>
                        <td>
                        <input type="submit" value="Create user" className={styles["input-block-submit"]} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
      </div>
    </main>
  )
}