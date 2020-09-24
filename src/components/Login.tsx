import React from "react";
import { fbPopup } from "../lib/firebase";
import "./styles/Login.css";

interface Props {
	onReceive: (value: firebase.User) => void;
}

const Login: React.FC<Props> = ({ onReceive }) => {
	const handleFacebookLogin = async () => {
		const result = await fbPopup();
		if (result && result.user) {
			onReceive(result.user);
		} else {
			alert("Error!");
		}
	};

	return (
		<div className="login">
			<button onClick={handleFacebookLogin}>Login with Google</button>
		</div>
	);
};

export default Login;
