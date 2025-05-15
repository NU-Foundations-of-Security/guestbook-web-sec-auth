"use client";

import styles from './page.module.css'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect} from 'react'
import { AiOutlineHome } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation'

export default function Filter() {
    const searchParams = useSearchParams()
    const [messages, setMessages] = useState([]);
    const router = useRouter();

    // Extract search term; default is empty string
    const nameToFind = searchParams.get("name") ?? "";

    const filterMessages = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': window.localStorage.getItem("guestbook-jwt") 
            }
        };
        const matchingMessages = await fetch(`/api/filter_messages?name=${nameToFind}`, requestOptions)
            .then((res) => {
                if (!res.ok) logOut();
                else setMessages(matchingMessages);
            });
    };

    // This hook executes on page rendered. When the page loads,
    // the tasks matching the searched term need to be identified
    useEffect(() => {
        if (!window.localStorage.getItem("guestbook-jwt"))
            router.replace("/login");
        else
            filterMessages();
    }, []);

    const redirectToHome = async (event) => {
        event.preventDefault();
        router.push(`/home`);
    }

    const logOut = () => {
        window.localStorage.removeItem("guestbook-jwt");
        router.replace("/login");
    }

    return (
        <main>
            <div className={styles["search-header-item"]}><button onClick={logOut}><FiLogOut size={25}/></button></div>
            
            <div className={styles["search-header"]}>
                <div className={styles["search-header-item"]}><button onClick={redirectToHome}><AiOutlineHome size={25}/></button></div>
                <div className={styles["search-header-item"]}>Here are all the messages posted by "<span dangerouslySetInnerHTML={{__html: nameToFind}}></span>"</div>
            </div>
            
            <br></br>
            
            {<ul className={styles["messages"]}>
                {messages?.map(( message ) => {
                    return <li className={styles["li"]} key="msg">
                        <table><tbody>
                            <tr>
                                <td>Message: <span dangerouslySetInnerHTML={{__html: message}}></span></td>
                            </tr>
                        </tbody></table>
                    </li>
                })}
            </ul>}
        </main>
    )
}