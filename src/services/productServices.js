import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { agregarAlCarrito } from "./addCarServices";

const productsRef = collection(db, "Productos");

export const getProductos = async (BoxProducts) => {
  if (!BoxProducts) {
    console.error("El contenedor BoxProducts no existe en el DOM.");
    return;
  }

  try {
    const snapshot = await getDocs(productsRef);
    
    BoxProducts.innerHTML = "";

    if (snapshot.empty) {
      BoxProducts.innerHTML = "<p>No hay productos disponibles.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const ID = doc.id
      
      const card = document.createElement("article");
      card.classList.add("product-card");

      card.innerHTML = `
        <figure class="product-media">
          <img src="${data.image || 'placeholder.jpg'}" alt="${data.name}" loading="lazy" />
        </figure>
        <div class="product-content">
          <div class="product-header">
            <h2 class="product-title">${data.nombre || 'Sin nombre'}</h2>
          </div>
          <p class="product-description">${data.descripcion ?? ""}</p>
          <div class="product-footer">
            <span class="product-price">$${data.precio || '0.00'}</span>
            <button class="btn-add ${ID}">Añadir al carrito</button>
          </div>
        </div>
      `;
      BoxProducts.appendChild(card);

      const addCar = document.querySelector(`.${ID}`)

      const Producto = {
        "Nombre": `${data.nombre}`,
        "Imagen": `${data.image}`,
        "Cantidad": 1,
        "Precio": `${data.precio}`,
      }
      
      addCar.addEventListener("click", () => {
        agregarAlCarrito(Producto)
      })

    });
  } catch (error) {
    console.error("Error al cargar productos desde Firestore:", error);
  }
};