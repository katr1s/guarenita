import { db, auth } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";

export const agregarAlCarrito = async (producto) => {
  const user = auth.currentUser;
  if (!user) {
    window.location.href = "/Account/Login";

    return
  }

  const userCarRef = doc(db, "CartUsers", user.uid);

  try {
    const docSnap = await getDoc(userCarRef);

    if (!docSnap.exists()) {
      // Verifica si no existe y lo crea agregando el producto
      await setDoc(userCarRef, {
        userId: user.uid,
        items: [producto],
        updatedAt: serverTimestamp()
      });
    } else {
      // Si ya existe, agregamos el producto al array 'items'
      await updateDoc(userCarRef, {
        items: arrayUnion(producto), 
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error("Error al gestionar el carrito:", error);
  }
};