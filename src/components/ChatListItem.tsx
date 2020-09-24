import React, { HTMLAttributes, useEffect, useState } from "react";
import "./styles/ChatListItem.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
	active?: boolean;
	item: any;
}

const ChatListItem: React.FC<Props> = ({ active, item, ...restProps }) => {
	const [time, setTime] = useState("");

	useEffect(() => {
		if (item.lastMessageDate > 0) {
			const d = new Date(item.lastMessageDate.seconds * 1000);
			let h = d.getHours();
			let m = d.getMinutes();
			h = h < 10 ? 0 + h : h;
			m = m < 10 ? 0 + m : m;
			setTime(`${h}:${m}`);
		}
	}, [item]);

	return (
		<div className={`chat-list__item ${active ? "active" : ""}`} {...restProps}>
			<img
				className="chat-list__item-avatar"
				src={item.image}
				alt="user avatar"
			/>
			<div className="chat-list__item-lines">
				<div className="chat-list__item-line">
					<div className="chat-list__item-name">{item.title}</div>
					<div className="chat-list__item-date">{time}</div>
				</div>

				<div className="chat-list__item-line">
					<div className="chat-list__item-last-msg">
						<p>{item.lastMessage}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatListItem;
