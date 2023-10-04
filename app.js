/* FIREBASE  */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
	updateProfile,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import {
	getFirestore,
	collection,
	addDoc,
	serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const firebaseConfig = {
	apiKey: "AIzaSyBqtW-Y__Jo7INCBc06DNsHPMLN1z07rpM",
	authDomain: "feelings-eb0c3.firebaseapp.com",
	projectId: "feelings-eb0c3",
	storageBucket: "feelings-eb0c3.appspot.com",
	messagingSenderId: "791006282814",
	appId: "1:791006282814:web:6753435b514bde2db23d6f",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

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

const userProfilePicture = document.getElementById("user-profile-picture");

const userGreeting = document.getElementById("user-greeting");

const displayNameInput = document.getElementById("display-name-input");
const photoURLInput = document.getElementById("photo-url-input");
// const photoFileInput = document.getElementById("profile-pic-file");
// const updateProfileButton = document.getElementById("update-profile-btn");

const moodIcons = document.getElementsByClassName("mood-icon-btn");

const textarea = document.getElementById("post-input");
const postButton = document.getElementById("post-btn");

// EVENT LISTENERS
signInWithGoogleButton.addEventListener("click", authSignInWithGoogle);

signInButton.addEventListener("click", authSignInWithEmail);
createAccountButton.addEventListener("click", authCreateAccountWithEmail);

signOutButton.addEventListener("click", authSignOut);

// iterate through elements, running selected mood for each
for (let moodIcon of moodIcons) {
	moodIcon.addEventListener("click", selectMood);
}

postButton.addEventListener("click", postButtonClicked);

// updateProfileButton.addEventListener("click", authUpdateProfile);

let moodState = 0;

// CHECKS IF USER IS LOGGED IN OR LOGGED OUT
onAuthStateChanged(auth, (user) => {
	if (user) {
		showLoggedInView();
		showProfilePic(userProfilePicture, user);
		showUserGreeting(userGreeting, user);
	} else {
		showLoggedOutView();
	}
});

// SIGN IN WITH GOOGLE
function authSignInWithGoogle() {
	signInWithPopup(auth, provider)
		.then((result) => {
			console.log("Successfully sign in with Google");
		})
		.catch((error) => {
			console.error(error.message);
		});
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

// ALLOW USERS TO CHANGE DEFAULT SETTINGS (DISPLAY NAME & PIC)
function authUpdateProfile() {
	const newDisplayName = displayNameInput.value;
	const newPhotoURL = photoURLInput.value;
	// const newPhotoFile = photoFileInput.value;

	updateProfile(auth.currentUser, {
		displayName: newDisplayName,
		photoURL: newPhotoURL,
	})
		.then(() => {
			console.log("profile updated woot woot");
		})
		.catch((error) => {
			console.error(error.message);
		});
}

// ADDS USER POST TO DATABASE
async function addPostToDB(postBody, user) {
	try {
		const docRef = await addDoc(collection(db, "posts"), {
			body: postBody, // adds post to collection
			uid: user.uid, // grabs specific user uid
			createdAt: serverTimestamp(),
			mood: moodState,
		});
		console.log("Document written with ID: ", docRef.id);
	} catch (error) {
		console.error(error.message);
	}
}

function postButtonClicked() {
	const postBody = textarea.value;
	const user = auth.currentUser;

	if (postBody && moodState) {
		addPostToDB(postBody, user);
		clearInputField(textarea);
		resetAllMoods(moodIcons);
	}
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

// SHOWS USER PIC
function showProfilePic(imgElement, user) {
	const photoURL = user.photoURL;
	if (photoURL) {
		imgElement.src = photoURL;
	} else {
		imgElement.src = "assets/defaultProfilePic.jpeg";
	}
}

// GREETS USER
function showUserGreeting(element, user) {
	const displayName = user.displayName;

	if (displayName) {
		const userFirstName = displayName.split(" ")[0]; // takes first name
		element.textContent = `Hey ${userFirstName}, how are you?`;
	} else {
		element.textContent = "Hey friend, how are you?";
	}
}

// MOOD SELECTION
function selectMood(event) {
	const selectedMoodEmojiID = event.currentTarget.id;

	moodChangeAfterSelection(selectedMoodEmojiID, moodIcons);
	const chosenMood = returnMoodValue(selectedMoodEmojiID);

	moodState = chosenMood;
}

function moodChangeAfterSelection(selectedMoodEmojiID, allMoods) {
	for (let moodIcon of moodIcons) {
		if (selectedMoodEmojiID === moodIcon.id) {
			moodIcon.classList.remove("unselected-icon");
			moodIcon.classList.add("selected-icon");
		} else {
			moodIcon.classList.remove("selected-icon");
			moodIcon.classList.add("unselected-icon");
		}
	}
}

function resetAllMoods(allMoods) {
	for (let moodIcon of allMoods) {
		moodIcon.classList.remove("selected-icon");
		moodIcon.classList.add("unselected-icon");
	}

	moodState = 0;
}

function returnMoodValue(elementID) {
	return Number(elementID.slice(5));
}
