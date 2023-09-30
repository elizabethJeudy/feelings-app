/* FIREBASE  */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
	getAuth,
	sendEmailVerification,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
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

// ELEMENTS
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

// EVENT LISTENERS
signInWithGoogleButton.addEventListener("click", authSignInWithGoogle);

signInButton.addEventListener("click", authSignInWithEmail);
createAccountButton.addEventListener("click", authCreateAccountWithEmail);

signOutButton.addEventListener("click", authSignOut);

// CHECKS IF USER IS LOGGED IN OR LOGGED OUT
onAuthStateChanged(auth, (user) => {
	if (user) {
		showLoggedInView();
	} else {
		showLoggedOutView();
	}
});

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
			clearAuthFields();
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
			clearAuthFields();
		})
		.catch((error) => {
			console.error(error.message);
		});
}

// SIGN OUT
function authSignOut() {
	signOut(auth)
		.then(() => {})
		.catch((error) => {
			console.error(error.message);
		});
}

function showLoggedOutView() {
	hideView(viewLoggedIn);
	showView(viewLoggedOut);
}

// RENDERS HOME PAGE
function showLoggedInView() {
	hideView(viewLoggedOut);
	showView(viewLoggedIn);
}

function showView(view) {
	view.style.display = "flex";
}

function hideView(view) {
	view.style.display = "none";
}

// CLEARS INPUT/AUTH FIELDS

function clearInputField(field) {
	field.value = "";
}

function clearAuthFields() {
	clearInputField(emailInput);
	clearInputField(passwordInput);
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
