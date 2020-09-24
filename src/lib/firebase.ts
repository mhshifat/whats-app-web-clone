import firebase from "firebase/app";
import "firebase/firebase-auth";
import "firebase/firebase-firestore";
import { IUser } from "../App";

const config = {
	apiKey: "AIzaSyDh2G4-IBnF5KtQeOqwHfFR4WQeTFf15Xo",
	authDomain: "whats-app-web-clone-80010.firebaseapp.com",
	databaseURL: "https://whats-app-web-clone-80010.firebaseio.com",
	projectId: "whats-app-web-clone-80010",
	storageBucket: "whats-app-web-clone-80010.appspot.com",
	messagingSenderId: "888225800984",
	appId: "1:888225800984:web:6381560d78fe838881b46d",
};

export const firebaseApp = firebase.initializeApp(config);
export const db = firebaseApp.firestore();
export const fbPopup = async () => {
	const provider = new firebase.auth.GoogleAuthProvider();
	const result = firebaseApp.auth().signInWithPopup(provider);
	return result;
};
export const currentUser = () => {
	let currentUser = null;
	firebase.auth().onAuthStateChanged((authUser) => {
		currentUser = authUser;
	});
	return currentUser;
};
export const addUser = async (u: IUser) => {
	await db.collection("users").doc(u.id).set(
		{
			name: u.name,
			avatar: u.avatar,
		},
		{ merge: true }
	);
};
export const getContactList = async (userId: IUser["id"]) => {
	const list: IUser[] = [];
	const results = await db.collection("users").get();
	results.forEach((result) => {
		const data = result.data();
		if (String(result.id) !== String(userId)) {
			list.push({
				id: result.id,
				name: data.name,
				avatar: data.avatar,
			});
		}
	});
	return list;
};
export const addNewChat = async (user: IUser, user2: IUser) => {
	const newChat = await db.collection("chats").add({
		messages: [],
		users: [user.id, user2.id],
	});

	db.collection("users")
		.doc(user.id)
		.update({
			chats: firebase.firestore.FieldValue.arrayUnion({
				chatId: newChat.id,
				title: user2.name,
				image: user2.avatar,
				with: user2.id,
			}),
		});

	db.collection("users")
		.doc(user2.id)
		.update({
			chats: firebase.firestore.FieldValue.arrayUnion({
				chatId: newChat.id,
				title: user.name,
				image: user.avatar,
				with: user.id,
			}),
		});
};
