/* FIREBASE  */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
	updateProfile,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

import {
	getFirestore,
	collection,
	addDoc,
	serverTimestamp,
	getDocs,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

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

/* ELEMENTS */
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

// const displayNameInput = document.getElementById("display-name-input");
// const photoURLInput = document.getElementById("photo-url-input");
// const photoFileInput = document.getElementById("profile-pic-file");
// const updateProfileButton = document.getElementById("update-profile-btn");

const moodIcons = document.getElementsByClassName("mood-icon-btn");

const textarea = document.getElementById("post-input");
const postButton = document.getElementById("post-btn");

const fetchPosts = document.getElementById("fetch-posts-btn");
const posts = document.getElementById("posts");

/* EVENT LISTENERS */
signInWithGoogleButton.addEventListener("click", authSignInWithGoogle);

signInButton.addEventListener("click", authSignInWithEmail);
createAccountButton.addEventListener("click", authCreateAccountWithEmail);

signOutButton.addEventListener("click", authSignOut);

// iterate through elements, running selected mood for each
for (let moodIcon of moodIcons) {
	moodIcon.addEventListener("click", selectMood);
}

postButton.addEventListener("click", postButtonClicked);
fetchPosts.addEventListener("click", fetchAndRenderPosts);
// updateProfileButton.addEventListener("click", authUpdateProfile);

let moodState = 0;

//  checks if user is logged in/logged out
onAuthStateChanged(auth, (user) => {
	if (user) {
		postButton.removeAttribute("disabled");
		showLoggedInView();
		showProfilePic(userProfilePicture, user);
		showUserGreeting(userGreeting, user);
		console.log("user is authenticated:", user);
	} else {
		postButton.setAttribute("disabled", true);
		showLoggedOutView();
		console.log("user is not authenticated");
	}
});

/* FIREBASE, AUTHENTICATION FUNCTIONS */

// sign in with google
function authSignInWithGoogle() {
	signInWithPopup(auth, provider)
		.then((result) => {
			console.log("Successfully signed in with Google");
		})
		.catch((error) => {
			console.error(error.message);
		});
}
// sign in with email
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

// create account with email
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

// sign out
function authSignOut() {
	signOut(auth)
		.then(() => {})
		.catch((error) => {
			console.error(error.message);
		});
}

/*
//  allows user to change default settings (display name/pic)
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
*/

/* FIREBASE, CLOUD FIRESTORE FUNCTIONS */

// adds user post to database
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

// fetches post from database and renders under post
async function fetchAndRenderPosts() {
	const querySnapshot = await getDocs(collection(db, "posts"));

	clearAll(posts);

	querySnapshot.forEach((doc) => {
		renderPost(posts, doc.data());
	});
}

/* UI FUNCTIONS */

// renders post
function renderPost(posts, postData) {
	posts.innerHTML += `
	
						<div class="post">
							<div class="header">
								<h3>${displayDate(postData.createdAt)}</h3>
								<img src="assets/${postData.mood}.png" alt="selected emoji" />
							</div>
							<p>${replaceNewLines(postData.body)}</p>
						</div>
					
	`;
}

// replaces new line with br tag
function replaceNewLines(inputString) {
	return inputString.replace(/\n/g, "<br>");
}

function postButtonClicked() {
	const postBody = textarea.value;
	const user = auth.currentUser;
	console.log("post body:", postBody);
	if (postBody && moodState) {
		addPostToDB(postBody, user);
		clearInputField(textarea);
		resetAllMoods(moodIcons);
	} else {
		console.error(
			"Either user is not authenticated, or postBody/moodState is missing"
		);
	}
}

function clearAll(element) {
	element.innerHTML = "";
}

function showLoggedOutView() {
	hideView(viewLoggedIn);
	showView(viewLoggedOut);
}

// renders home page
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

// clears input/auth fields
function clearInputField(field) {
	field.value = "";
}

function clearAuthFields() {
	clearInputField(emailInput);
	clearInputField(passwordInput);
}

// displays user pic
function showProfilePic(imgElement, user) {
	const photoURL = user.photoURL;
	if (photoURL) {
		imgElement.src = photoURL;
	} else {
		imgElement.src = "assets/defaultProfilePic.jpeg";
	}
}

// greets user
function showUserGreeting(element, user) {
	const displayName = user.displayName;

	if (displayName) {
		const userFirstName = displayName.split(" ")[0]; // takes first name
		element.textContent = `Hey ${userFirstName}, how are you?`;
	} else {
		element.textContent = "Hey friend, how are you?";
	}
}

// fetches date
function displayDate(firebaseDate) {
	const date = firebaseDate.toDate();
	const day = date.getDate();
	const year = date.getFullYear();
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sept",
		"Oct",
		"Nov",
		"Dec",
	];
	const month = months[date.getMonth()];

	let hours = date.getHours();
	let minutes = date.getMinutes();
	hours = hours < 10 ? "0" + hours : hours;
	minutes = minutes < 10 ? "0" + minutes : minutes;

	return `${day} ${month}, ${year} - ${hours}:${minutes} `;
}

/* MOOD FUNCTIONS */

// mood selection
function selectMood(event) {
	const selectedMoodEmojiID = event.currentTarget.id;
	console.log("Selected mood id:", selectedMoodEmojiID);
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
	return Number(elementID.slice(6));
}
