import { ArrowBack } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { IUser } from "../App";
import { addNewChat, getContactList } from "../lib/firebase";
import "./styles/NewChat.css";

interface Props {
	show: boolean;
	setShowNewChat: (value: boolean) => void;
	user: IUser | null;
	chatList: any[];
}

const NewChat: React.FC<Props> = ({ show, setShowNewChat, user, chatList }) => {
	const [list, setList] = useState<IUser[]>([]);

	useEffect(() => {
		if (user !== null) {
			getContactList(user.id).then((list) => {
				setList(list);
			});
		}
	}, [user]);

	const newChat = async (user2: IUser) => {
		if (user !== null) {
			await addNewChat(user, user2);
		}
		setShowNewChat(false);
	};

	return (
		<div className="new-chat" style={{ left: show ? 0 : -415 }}>
			<div className="new-chat__head">
				<div
					className="new-chat__back-btn"
					onClick={() => setShowNewChat(false)}
				>
					<ArrowBack style={{ color: "#fff" }} />
				</div>
				<div className="new-chat__head-title">New Chat</div>
			</div>
			<div className="new-chat__list">
				{list.map((item, key) => (
					<div
						onClick={() => newChat(item)}
						className="new-chat__item"
						key={key}
					>
						<img
							src={item.avatar}
							alt={item.name}
							className="new-chat__item-avatar"
						/>
						<div className="new-chat__item-name">{item.name}</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default NewChat;
