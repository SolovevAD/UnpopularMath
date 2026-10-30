/* ============================================================
   DB.JS — инициализация Firebase и экспорт функций
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, onSnapshot, collection, query, where, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFAZWzq2b62IMjJrkyGCvQ2N2z_rVTiy0",
  authDomain: "mir-chisel.firebaseapp.com",
  projectId: "mir-chisel",
  storageBucket: "mir-chisel.firebasestorage.app",
  messagingSenderId: "865215675669",
  appId: "1:865215675669:web:501ccf3274cb35f2da3d1c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Экспортируем в глобальную область (window), чтобы обычные скрипты (script.js, moderator.js) 
// могли получить к ним доступ без перевода всего проекта на ES-модули.
window.FB = {
    db, auth, provider,
    doc, getDoc, setDoc, updateDoc, increment, onSnapshot, collection, query, where, getDocs, deleteDoc,
    signInWithPopup, onAuthStateChanged, signOut
};

// Сигнализируем, что Firebase готов
window.dispatchEvent(new Event('firebase-ready'));
console.log('Firebase initialized successfully');
