import React, { useState } from "react";
import "./App.css";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyBuGjLEI9K-lo72oWROZO-M_qLuPf7ujCk",
  authDomain: "react-fire-chat-app-8d83d.firebaseapp.com",
  projectId: "react-fire-chat-app-8d83d",
  storageBucket: "react-fire-chat-app-8d83d.appspot.com",
  messagingSenderId: "612433193057",
  appId: "1:612433193057:web:d2b0679fb49c2791e32220",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <SignOut />
      </header>
      <section>{user ? <Chatroom /> : <SignIn />}</section>
    </div>
  );
}

export default App;

function SignIn() {
  const signInGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return (
    <div>
      <button className="sign-in" onClick={signInGoogle}>
        Giris Yap
      </button>
    </div>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Çıkış Yap
      </button>
    )
  );
}

function Chatroom() {
  const messageRef = firestore.collection("mesajlar");
  const query = messageRef.orderBy("olusturulmaSaati").limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messageRef.add({
      text: formValue,
      olusturulmaSaati: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      fotoURL: photoURL,
    });

    setFormValue('');
  };
  return (
    <>
      <div>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </div>
      <form onSubmit={sendMessage}>
          <input value={formValue} onChange={(e)=>setFormValue(e.target.value)}/>
          <button type="submit" disabled={!formValue}>Gönder</button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, fotoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img src={fotoURL} alt={uid} />
      <p>{text}</p>
    </div>
  );
}
