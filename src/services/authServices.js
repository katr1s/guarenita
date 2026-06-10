import { auth, googleProvider, githubProvider, appleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";


export const authService = {
  // Iniciar sesión con Google
  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Aquí tienes el usuario logueado: result.user
      return result.user;
    } catch (error) {
      console.error("Error en login con Google:", error.message);
      throw error;
    }
  },

  // Iniciar sesión con GitHub
  loginWithGithub: async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      return result.user;
    } catch (error) {
      console.error("Error en login con GitHub:", error.message);
      throw error;
    }
  },

  // Iniciar sesión con Apple
  loginWithApple: async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      return result.user;
    } catch (error) {
      console.error("Error en login con Apple:", error.message);
      throw error;
    }
  }
};