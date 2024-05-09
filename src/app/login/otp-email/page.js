"use client";

import styles from "./page.module.css"
import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function MagicLink() {
  const [failedLoggedIn, setFailedLoggedIn] = useState(false);
  const [beforeSendingOTP, setBeforeSendingOTP] = useState(false);
  const [afterSendingOTP, setAfterSendingOTP] = useState(false);
  const [email, setEmail] = useState(null);
  const router = useRouter();

  const emailRef = useRef(null);
  const codeRef = useRef(null);

  const sendOTP = async(event) => {
    event.preventDefault();
    const email = event.target[0].value;

    const body = {
        email: email,
        method: "OTP"
    };   
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    };

    fetch("/api/login", requestOptions)
      .then(async (res) => {
        setBeforeSendingOTP(false);
        setAfterSendingOTP(true);
        setEmail(email);
      });
  }

  const verifyOTP = (event) => {
    event.preventDefault();
    const enteredCode = event.target[0].value;

    const body = {
        method: "OTP",
        enteredCode: enteredCode
    };   
    console.log(body);
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    };

    fetch("/api/login", requestOptions)
      .then(async (res) => {
        const response = await res.json();
        if (!res.ok) setFailedLoggedIn(true);
        else setFailedLoggedIn(() => {
            window.localStorage.setItem("guestbook-jwt", response);
            router.replace("/home");
            return false;
        });
      })
  };

  useEffect(() => {
    if (window.localStorage.getItem("guestbook-jwt"))
      router.replace("/home");
    setBeforeSendingOTP(true);
  }, []);

  return (
    <main className={styles.main}>
      {beforeSendingOTP &&
        <div className={styles["input-block"]}>
          Tired of typing and remembering passwords? We'll send you a one-time password 
          to your registered email address to use instead.
          <form className={styles["input-section"]} onSubmit={sendOTP}>
            Provide your email address:
            <input type="email" ref={emailRef} placeholder='Email address' required/>
            <input type="submit" value="Send OTP!" className={styles["input-block-submit"]} />
          </form>
        </div>
      }
      {afterSendingOTP &&
        <div className={styles["input-block"]}>
          We've sent a code to {email} if it is registered to your account.
          Enter the code you received here:
          <form className={styles["input-section"]} onSubmit={verifyOTP}>
            <input type="text" ref={codeRef} placeholder="Code" required/>
            <input type="submit" value="Verify!" className={styles["input-block-submit"]} />
          </form>
          {failedLoggedIn &&
                <div><font color="red">Invalid OTP.</font></div>
          }

          <span><font color="orange">
            If you did not receive a code, check your blocked messages folder if you have one. Otherwise, it indicates the email address
            you provided is not registered to an account or a email address that does not exist.
          </font></span>
        </div>
      }
      <div>
      </div>
    </main>
  )
}