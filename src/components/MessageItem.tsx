import React, { useEffect, useState } from "react";
import "./styles/MessageItem.css";

interface Props {
	item: any;
	user: any;
}

const MessageItem: React.FC<Props> = ({ item, user }) => {
	const [time, setTime] = useState("");

	useEffect(() => {
		if (item.date > 0) {
			const d = new Date(item.date.seconds * 1000);
			let h = d.getHours();
			let m = d.getMinutes();
			h = h < 10 ? 0 + h : h;
			m = m < 10 ? 0 + m : m;
			setTime(`${h}:${m}`);
		}
	}, [item]);

	return (
		<div
			className="message-line"
			style={{
				justifyContent: user.id === item.authorId ? "flex-end" : "flex-start",
			}}
		>
			<div
				className="message__item"
				style={{
					backgroundColor: user.id === item.authorId ? "#DCF8C6" : "#fff",
				}}
			>
				<div className="message-text">{item.body}</div>
				<div className="message-date">{time}</div>
			</div>
		</div>
	);
};

export default MessageItem;
