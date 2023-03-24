import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
export default function Chat({socket, username, room}){

    const [currentMessage, setCurrentMessage] = useState(''); // Store the Current Message
    const [conversation, setConversation] = useState([]); // Store Conversation
    const [inromm, setInRoom] = useState(0);

    // Send Message Function
    const SendMessage = async () =>{
        if(currentMessage !== ""){
            const MessageData = {
                message : currentMessage,
                author : username,
                room : room,
                date : new Date(Date.now()).getHours() + ":" + String(new Date(Date.now()).getMinutes()).padStart(2, "0") 
            };

            await socket.emit('send_message', MessageData);
            setConversation((list) => [...list, MessageData]);
            setCurrentMessage('');
        }
    }


    
    useEffect(() => {
        // Listen Recieve message
        socket.on('recieve_message', (data) => {
            setConversation((list) => [...list, data]);
            console.log('User send a New Message')
        })

    }, [socket])

    // In Room and disconnected
    useEffect(() => {

        // List Number User In my Room
        socket.on('user_inroom', (data) => {
            console.log('One User Join the Room !')
            setInRoom(data.users.length);
        })

        // Check if disconnected from my room
        socket.on('user_disconnected', (data) => {
            console.log('One User disconnected')
            if(data.d_room === room){
                // setInRoom((prev) => prev - 1);
                setInRoom(data.d_array.length);
            }
        })

    }, [socket])



    return(
        <div className="ChatRoom">
            <div className="ChatHeader">
                <p>Live Chat in <b>#{room}</b>. User connected :  <b>{inromm}</b></p>
            </div>
            <div className="ChatBody">
                <ScrollToBottom className="ChatContainer">
                {
                    conversation.map((data, index) => {

                        
                        const Hide = (conversation[index-1]?.author === data.author) ? "hide" : "show";

                        return (
                            <div key={data.message+data.date+index} className="ChatMessage" id={data.author === username ? "you" : "other"}>
                                <span className={`DateChat`}><em>{data.author} at {data.date}</em></span>
                                <div className="ChatUser">
                                    <section className="MessageContent">
                                        {data.message}
                                    </section>  
                                    
                                    {/* <img className={`usericon ${Hide}`} src="anonymous-user.png"></img>     */}
                                    <div className={`usericon ${Hide}`}>{data.author[0]}</div>  
                                </div>                                                       
                            </div>
                        )
                    })
                }
                </ScrollToBottom>
            </div>
            <div className="ChatFooter">
                <input type="text" placeholder="Your message..." value={currentMessage} onChange={(e) =>{setCurrentMessage(e.target.value)}}></input>
                <button onClick={SendMessage}>^</button>
            </div>
        </div>
    )
}