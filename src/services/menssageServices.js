import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const messagesRef = collection(db, "mensajes");

export const sendMessage = async ({ name, email, message }) => {
  if (!name || !email || !message) {
    throw new Error("Campos incompletos");
  }

  return await addDoc(messagesRef, {
    name,
    email,
    message,
    createdAt: serverTimestamp()
  });
};