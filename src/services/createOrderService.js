import { collection, addDoc, getDoc, serverTimestamp, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export const crearPedido = async (userId, formData) => {
  try {
    // 1. Obtener los productos actuales del carrito del usuario
    const cartDocRef = doc(db, "CartUsers", userId);
    const cartSnapshot = await getDoc(cartDocRef);

    if (!cartSnapshot.exists()) {
      console.error("No se encontró el carrito del usuario.");
      return { success: false, message: "El carrito está vacío." };
    }

    const cartData = cartSnapshot.data();
    const items = cartData.items || {};

    if (Object.keys(items).length === 0) {
      return { success: false, message: "No hay productos en el carrito para ordenar." };
    }

    // 2. Crear la estructura del pedido combinando envío y productos
    const nuevoPedido = {
      userId: userId,
      envio: formData, // Objeto con dirección, municipio, ciudad, tipo, etc.
      items: items,
      estado: "Pendiente de validación", // Estado inicial para el equipo
      fechaCreacion: serverTimestamp()
    };

    // 3. Guardar el documento en la colección 'Orders'
    const docRef = await addDoc(collection(db, "Orders"), nuevoPedido);
    console.log("Pedido creado con ID:", docRef.id);

    // Opcional: Aquí podrías limpiar el carrito del usuario llamando a eliminar o vaciar el nodo

    return { success: true, orderId: docRef.id };
  } catch (error) {
    console.error("Error al crear el pedido en Firestore:", error);
    return { success: false, error };
  }
};


export const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, "CartUsers", id));
    console.log("Producto eliminado");
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
  }
};