import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const getProductosCarrito = async (BoxProducts, userId) => {
  if (!BoxProducts) {
    console.error("El contenedor BoxProducts no existe en el DOM.");
    return;
  }

  if (!userId) {
    BoxProducts.innerHTML =
      "<p class='text-gray-400 text-center'>No se detectó un ID de usuario válido.</p>";
    return;
  }

  try {
    const cartDocRef = doc(db, "CartUsers", userId);
    const cartSnapshot = await getDoc(cartDocRef);

    BoxProducts.innerHTML = "";

    if (!cartSnapshot.exists()) {
      BoxProducts.innerHTML =
        "<p class='text-gray-400 text-center py-12'>Tu carrito está vacío.</p>";
      return;
    }

    const cartData = cartSnapshot.data();
    const items = cartData.items;

    if (!items || Object.keys(items).length === 0) {
      BoxProducts.innerHTML =
        "<p class='text-gray-400 text-center py-12'>No tienes productos en el carrito.</p>";
      return;
    }

    Object.keys(items).forEach((idProducto, indice) => {
      const data = items[idProducto];
      const dataId = indice;
      console.log(dataId);
      var totalProducto = Number(data.Precio) * data.Cantidad;
      let Cantidad = data.Cantidad;

      const card = document.createElement("article");
      card.classList.add("product-card");

      card.innerHTML = `
        <figure class="product-media">
          <img src="${data.Imagen || "placeholder.jpg"}" alt="${data.Nombre}" loading="lazy" />
        </figure>
        <div class="product-content">
          <div class="product-header">
            <h2 class="product-title">${data.Nombre || "Sin nombre"}</h2>
          </div>
          
          <div class="product-footer">
            <input type="number" name="" id="${indice}" value="${data.Cantidad}">
            <span class="product-price${indice}">$${totalProducto.toLocaleString("es-CO")}</span>
          </div>
        </div>
      `;

      BoxProducts.appendChild(card);

      const inputCantidad = document.getElementById(`${indice}`);
      const infPrecioProducto = document.querySelector(`.product-price${indice}`)

      inputCantidad.addEventListener("change", (e) => {
        const nuevaCantidad = Number(e.target.value);


        if(nuevaCantidad > 999){
            e.target.value = 999;
          actualizarCantidadCarrito(userId, indice, 999);
          infPrecioProducto.innerHTML="";
          totalProducto = Number(data.Precio) * e.target.value;
          infPrecioProducto.innerHTML= `$${totalProducto.toLocaleString("es-CO")}`
        }
        else if (nuevaCantidad > 0) {
          actualizarCantidadCarrito(userId, indice, nuevaCantidad);
          infPrecioProducto.innerHTML="";
          totalProducto = Number(data.Precio) * nuevaCantidad;
          infPrecioProducto.innerHTML= `$${totalProducto.toLocaleString("es-CO")}`
        }
        else {
          e.target.value = 1;
          actualizarCantidadCarrito(userId, indice, 1);
          infPrecioProducto.innerHTML="";
          totalProducto = Number(data.Precio) * e.target.value;
          infPrecioProducto.innerHTML= `$${totalProducto.toLocaleString("es-CO")}`
        }
      });
    });
  } catch (error) {
    console.error("Error exacto en Firestore:", error);
    BoxProducts.innerHTML =
      "<p class='text-red-500 text-center py-12'>Error al cargar el carrito.</p>";
  }
};


export const actualizarCantidadCarrito = async (
  userId,
  idProducto,
  nuevaCantidad,
) => {
  try {
    const cartDocRef = doc(db, "CartUsers", userId);

    const cartSnapshot = await getDoc(cartDocRef);
    if (!cartSnapshot.exists()) return;

    const cartData = cartSnapshot.data();
    const items = cartData.items || {};

    if (items[idProducto]) {
      items[idProducto].Cantidad = Number(nuevaCantidad);

      await updateDoc(cartDocRef, {
        items: items,
      });

    }
  } catch (error) {
    console.error("Error al actualizar la cantidad en Firestore:", error);
  }
};
