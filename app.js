/* FIREBASE  */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
	getAuth,
	sendEmailVerification,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
const firebaseConfig = {
	apiKey: "AIzaSyBqtW-Y__Jo7INCBc06DNsHPMLN1z07rpM",
	authDomain: "feelings-eb0c3.firebaseapp.com",
	projectId: "feelings-eb0c3",
	storageBucket: "feelings-eb0c3.appspot.com",
	messagingSenderId: "791006282814",
	appId: "1:791006282814:web:6753435b514bde2db23d6f",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
/* === UI === */

/* == UI - Elements == */

const viewLoggedOut = document.getElementById("logged-out-view");
const viewLoggedIn = document.getElementById("logged-in-view");

const signInWithGoogleButton = document.getElementById(
	"sign-in-with-google-btn"
);

// const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");

const signInButton = document.getElementById("sign-in-btn");
const createAccountButton = document.getElementById("create-account-btn");

const signOutButton = document.getElementById("sign-out-btn");
/* == UI - Event Listeners == */

signInWithGoogleButton.addEventListener("click", authSignInWithGoogle);

signInButton.addEventListener("click", authSignInWithEmail);
createAccountButton.addEventListener("click", authCreateAccountWithEmail);

signOutButton.addEventListener("click", authSignOut);
/* === Main Code === */

showLoggedOutView();

// SIGN IN WITH GOOGLE
function authSignInWithGoogle() {
	console.log("Sign in with Google");
}

// SIGN IN WITH EMAIL
function authSignInWithEmail() {
	const email = emailInput.value;
	const password = passwordInput.value;

	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			showLoggedInView();
		})
		.catch((error) => {
			console.error(error.message);
		});
}

// CREATE ACCOUNT WITH EMAIL
function authCreateAccountWithEmail() {
	const email = emailInput.value;
	const password = passwordInput.value;

	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			showLoggedInView();
		})
		.catch((error) => {
			console.error(error.message);
		});
}

// SIGN OUT
function authSignOut() {
	signOut(auth)
		.then(() => {
			showLoggedOutView();
		})
		.catch((error) => {
			console.error(error.message);
		});
}

function showLoggedOutView() {
	hideElement(viewLoggedIn);
	showElement(viewLoggedOut);
}

// RENDERS HOME PAGE
function showLoggedInView() {
	hideElement(viewLoggedOut);
	showElement(viewLoggedIn);
}

function showElement(element) {
	element.style.display = "flex";
}

function hideElement(element) {
	element.style.display = "none";
}

/**async function sendEmailVerification(user) {
	try {
		await sendEmailVerification(user);
		console.log("Email verification sent!");
	} catch (error) {
		console.error(error);
	}
}

async function authCreateAccountWithEmail() {
	const name = nameInput.value;
	const email = emailInput.value;
	const password = passwordInput.value;

	createUserWithEmailAndPassword(auth, name, email, password)
		.then(async (userCredential) => {
			await sendEmailVerification(auth.currentUser);

			showLoggedInView();
		})
		.catch((error) => {
			console.error(error.message);
		});
} */
