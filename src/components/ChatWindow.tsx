import {
	AttachFile,
	Close,
	InsertEmoticon,
	Mic,
	MoreVert,
	Search,
	Send,
} from "@material-ui/icons";
import EmojiPiker from "emoji-picker-react";
import firebase from "firebase";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../lib/firebase";
import MessageItem from "./MessageItem";
import "./styles/ChatWindow.css";

interface Props {
	user: any;
	activeChat: any;
}

const ChatWindow: React.FC<Props> = ({ user, activeChat }) => {
	const [emojiOpen, setEmojiOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [listening, setListening] = useState(false);
	const [messagesList, setMessagesList] = useState([]);
	const messagesBody: any = useRef(null);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		let unsubscribe: any = null;
		if (activeChat?.chatId) {
			unsubscribe = db
				.collection("chats")
				.doc(activeChat.chatId)
				.onSnapshot((doc) => {
					if (doc?.exists) {
						const data = doc.data();
						setMessagesList(data?.messages || []);
						setUsers(data?.users || []);
					}
				});
		}
		return () => unsubscribe?.();
	}, [activeChat]);

	useEffect(() => {
		if (messagesBody.current) {
			if (
				messagesBody.current.scrollHeight > messagesBody.current.offsetHeight
			) {
				messagesBody.current.scrollTop =
					messagesBody.current.scrollHeight - messagesBody.current.offsetHeight;
			}
		}
	}, [messagesList]);

	let recognition: any = null;
	let SpeechRecognition =
		// @ts-ignore
		window.SpeechRecognition || window.webkitSpeechRecognition;
	if (SpeechRecognition !== undefined) {
		recognition = new SpeechRecognition();
	}

	const handleMicClick = () => {
		if (recognition !== null) {
			recognition.onstart = () => {
				setListening(true);
			};
			recognition.onend = () => {
				setListening(false);
			};
			recognition.onresult = (e: any) => {
				setMessage(e.results[0][0].transcript);
			};

			recognition.start();
		}
	};

	const handleInputKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSendClick();
		}
	};

	const handleSendClick = async () => {
		const now = new Date();

		if (message !== "" && activeChat?.chatId && user?.id) {
			await db
				.collection("chats")
				.doc(activeChat.chatId)
				.update({
					messages: firebase.firestore.FieldValue.arrayUnion({
						type: "text",
						author: user.id,
						body: message,
						date: now,
					}),
				});

			for (let i in users) {
				const u = await db.collection("users").doc(users[i]).get();
				let uData = u.data();
				if (uData?.chats) {
					const chats = [...uData.chats];

					for (let e in chats) {
						if (chats?.[e]?.chatId === activeChat?.chatId) {
							chats[e].lastMessage = message;
							chats[e].lastMessageDate = now;
						}
					}

					await db.collection("users").doc(users[i]).update({
						chats,
					});
				}
			}

			setMessage("");
			setEmojiOpen(false);
		}
	};

	return (
		<div className="chat-window">
			<div className="chat-window__header">
				<div className="chat-window__header-info">
					<img
						src={activeChat.image}
						alt=""
						className="chat-window__header-avatar"
					/>
					<div className="chat-window__header-name">{activeChat.title}</div>
				</div>

				<div className="chat-window__header-buttons">
					<div className="chat-window__header-btn">
						<Search style={{ color: "#919191" }} />
					</div>

					<div className="chat-window__header-btn">
						<AttachFile style={{ color: "#919191" }} />
					</div>

					<div className="chat-window__header-btn">
						<MoreVert style={{ color: "#919191" }} />
					</div>
				</div>
			</div>
			<div ref={messagesBody} className="chat-window__body">
				{messagesList.map((item, key) => (
					<MessageItem key={key} item={item} user={user} />
				))}
			</div>
			<div
				className="chat-window__emoji-area"
				style={{
					height: emojiOpen ? "200px" : "0px",
				}}
			>
				<EmojiPiker
					disableSearchBar
					disableSkinTonePicker
					onEmojiClick={(e, emojiObj) =>
						setMessage((message) => message + emojiObj.emoji)
					}
				/>
			</div>
			<div className="chat-window__footer">
				<div className="chat-window__footer-pre">
					{emojiOpen ? (
						<div
							className="chat-window__header-btn"
							onClick={() => setEmojiOpen(false)}
						>
							<Close style={{ color: "#919191" }} />
						</div>
					) : (
						<div
							className="chat-window__header-btn"
							onClick={() => setEmojiOpen(true)}
						>
							<InsertEmoticon style={{ color: "#919191" }} />
						</div>
					)}
				</div>

				<div className="chat-window__footer-input-area">
					<input
						type="text"
						className="chat-window__footer-input"
						placeholder="Type your message"
						value={message}
						onChange={({ target }) => setMessage(target.value)}
						onKeyUp={handleInputKeyUp}
					/>
				</div>

				<div className="chat-window__footer-pos">
					{message === "" && (
						<div onClick={handleMicClick} className="chat-window__header-btn">
							<Mic style={{ color: listening ? "#126ECE" : "#919191" }} />
						</div>
					)}

					{message !== "" && (
						<div className="chat-window__header-btn" onClick={handleSendClick}>
							<Send style={{ color: "#919191" }} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatWindow;
