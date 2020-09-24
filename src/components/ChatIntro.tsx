import React from "react";
import "./styles/ChatIntro.css";

const ChatIntro = () => {
	return (
		<div className="chat-intro">
			<img
				src="https://web.whatsapp.com/img/intro-connection-light_c98cc75f2aa905314d74375a975d2cf2.jpg"
				alt="stay connected"
			/>
			<h1>Keep your phone connected.</h1>
			<h2>
				WhatsApp connects to your phone to sync messages. To reduce data usage,
				connect your phone to Wi-Fi.
			</h2>
		</div>
	);
};

export default ChatIntro;
