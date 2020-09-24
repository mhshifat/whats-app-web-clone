import { Chat, DonutLarge, MoreVert, Search } from "@material-ui/icons";
import firebase from "firebase";
import React, { useEffect, useState } from "react";
import "./App.css";
import ChatIntro from "./components/ChatIntro";
import ChatListItem from "./components/ChatListItem";
import ChatWindow from "./components/ChatWindow";
import Login from "./components/Login";
import NewChat from "./components/NewChat";
import { addUser, db, firebaseApp } from "./lib/firebase";

export interface IChat {
	chatId: number;
	title: string;
	image: string;
	lastMessage: string;
}

export interface IUser {
	id: string;
	avatar: string;
	name: string;
}

const App = () => {
	const [chatList, setChatList] = useState<IChat[]>([]);
	const [activeChat, setActiveChat] = useState<Partial<IChat>>({});
	const [user, setUser] = useState<IUser | null>(null);
	const [showNewChat, setShowNewChat] = useState(false);

	useEffect(() => {
		const unsubscribe = firebaseApp.auth().onAuthStateChanged((user) => {
			if (user) {
				setUser({
					id: user.uid,
					name: user.displayName || "",
					avatar: user.photoURL || "",
				});
			} else {
				setUser(null);
			}
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		let unsubscribe: any = null;

		if (user?.id) {
			unsubscribe = db
				.collection("users")
				.doc(user.id)
				.onSnapshot((doc) => {
					if (doc.exists) {
						const data = doc.data();
						if (data?.chats) {
							const chats = [...data.chats];

							chats.sort((a, b) => {
								if (a?.lastMessageDate === undefined) {
									return -1;
								}
								if (b?.lastMessageDate === undefined) {
									return -1;
								}
								if (a?.lastMessageDate?.seconds < b?.lastMessageDate?.seconds) {
									return 1;
								} else {
									return -1;
								}
							});

							setChatList(chats);
						}
					}
				});
		}

		return () => unsubscribe?.();
	}, [user]);

	const handleLoginData = async (u: firebase.User) => {
		const newUser = {
			id: u.uid,
			avatar: u.photoURL || "https://www.w3schools.com/howto/img_avatar2.png",
			name: u.displayName || "Test User",
		};
		await addUser(newUser);
		setUser(newUser);
	};

	if (user === null) {
		return <Login onReceive={handleLoginData} />;
	}
	return (
		<div className="app-window">
			<div className="sidebar">
				<NewChat
					show={showNewChat}
					setShowNewChat={setShowNewChat}
					user={user}
					chatList={chatList}
				/>
				<header>
					<img className="header--avatar" src={user.avatar} alt="avatar" />
					<div className="header--buttons">
						<div className="header--btn">
							<DonutLarge style={{ color: "#919191" }} />
						</div>

						<div className="header--btn" onClick={() => setShowNewChat(true)}>
							<Chat style={{ color: "#919191" }} />
						</div>

						<div className="header--btn">
							<MoreVert style={{ color: "#919191" }} />
						</div>
					</div>
				</header>

				<div className="search">
					<div className="search--input">
						<Search fontSize="small" style={{ color: "#919191" }} />
						<input type="search" placeholder="Search" />
					</div>
				</div>

				<div className="chat-list">
					{chatList.map((item, key) => (
						<ChatListItem
							key={key}
							active={item?.chatId === activeChat?.chatId}
							item={item}
							onClick={() => setActiveChat(chatList[key])}
						/>
					))}
				</div>
			</div>
			<div className="content-area">
				{activeChat?.chatId ? (
					<ChatWindow user={user} activeChat={activeChat} />
				) : (
					<ChatIntro />
				)}
			</div>
		</div>
	);
};

export default App;
