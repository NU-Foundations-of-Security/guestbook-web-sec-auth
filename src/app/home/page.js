//Next JS/React version of the guestbook

"use client";

import styles from './page.module.css'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FiLogOut } from 'react-icons/fi';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const router = useRouter();

  const nameRef = useRef(null);
  const messageRef = useRef(null);
  const filterRef = useRef(null);
  const addressRef = useRef(null);

  const getMessages = async () => {
    const requestOptions = {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': window.localStorage.getItem("guestbook-jwt") 
      }
    };

    const messagesFromApi = await fetch("/api/get_all_messages", requestOptions)
      .then((res) => {
        if (!res.ok) logOut();
        else return res.json();
      });

    setMessages(messagesFromApi);
  }

  const postMessage = async(event) => {
    event.preventDefault();
    const queryParams = `name=${event.target[0].value}&message=${event.target[2].value}&display=${event.target[3].checked ^ 0}&address=${event.target[1].value}`;
    
    const requestOptions = {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': window.localStorage.getItem("guestbook-jwt") 
      }
    };

    fetch(`/api/create_message?${queryParams}`, requestOptions)
      .then((res) => res.json())
      .then(() => {
        getMessages();
        clearRefs();
      })
  }

  const redirectToFilter = async (event) => {
    event.preventDefault();
    const name = event.target[0].value;
    router.push(`/filter?name=${name}`);
  }

  const clearRefs = () => {
    nameRef.current.value = "";
    messageRef.current.value = "";
    filterRef.current.value = "";
    addressRef.current.value = "";
  }

  const logOut = () => {
    window.localStorage.removeItem("guestbook-jwt");
    router.replace("/login");
  }

  useEffect(() => {
    if (!window.localStorage.getItem("guestbook-jwt"))
      router.replace("/login");
    else 
      getMessages();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles["search-header-item"]}><button onClick={logOut}><FiLogOut size={25}/></button></div>

      <div className={styles["input-block"]}>
        <form className={styles["input-section"]} onSubmit={redirectToFilter}>
          <input type="text" ref={filterRef} placeholder='Enter the name of a person whose messages you want to see...' />
          <input type="submit" value="Filter" className={styles["input-block-submit"]} />
        </form>
      </div>
      <div>
        <form onSubmit={postMessage}>
          <table>
            <tbody>
              <tr>
                <td width="4cm">Your name:</td>
                <td><input type="text" id="name" ref={nameRef} placeholder="Your  name..." /></td>
              </tr>
              <tr>
                <td width="4cm">Your address:</td>
                <td><input type="text" id="address" ref={addressRef} placeholder="Your  address..." /></td>
              </tr>
              <tr>
              <td width="4cm">Your message:</td>
                <td><textarea id="message" rows="5" cols="60" ref={messageRef} placeholder="Your message..." /></td>
              </tr>
              <tr>
                <td width="4cm">Show?</td>
                <td><input type="checkbox" id="display" name="display"/></td>
              </tr>
              <tr>
                <td></td>
                <td><input type="submit" value="Post" /></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>

      <div>
        <span>Here are messages guests have left so far</span>

        <ul className={styles["messages"]}>
          {console.log(messages)}
          {messages?.map(({ name, address, message}) => {
            return <li className={styles["li"]} key="msg">
              <table><tbody>
                <tr>
                  <td>From: {name}</td>
                </tr>
                <tr>
                  <td>Address: {address}</td>
                </tr>
                <tr>
                  <td>Message: {message}</td>
                </tr>  
              </tbody></table>
            </li>
          })}
        </ul>
      </div>
    </main>
  )
}