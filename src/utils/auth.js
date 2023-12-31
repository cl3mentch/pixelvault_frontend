import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
import { writable } from 'svelte/store';

export const isLoggedInStore = writable(false);

const emptyAuth = {
	token: '',
	userId: ''
};

export function logOut() {
	isLoggedInStore.set(false);
	localStorage.setItem('auth', JSON.stringify(emptyAuth));
}

export function getUserId() {
	const auth = localStorage.getItem('auth');
	if (auth) {
		const data = JSON.parse(auth);
		const id = JSON.stringify(data.id);
		return id;
	}
	return null;
}

export function getUserName() {
	const auth = localStorage.getItem('auth');
	if (auth) {
		const parsedAuth = JSON.parse(auth);
		const username = parsedAuth['userName'];
		const capLetter = username.charAt(0).toUpperCase() + username.slice(1);
		return capLetter;
	}
	return null;
}

export function getTokenFromLocalStorage() {
	const auth = localStorage.getItem('auth');
	if (auth) {
		return JSON.parse(auth)['token'];
	}
	return null;
}

export async function isLoggedIn() {
	if (!getTokenFromLocalStorage()) {
		return false;
	}
	isLoggedInStore.set(true);
}

export async function authenticateUser(email, password) {
	const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/auth', {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email,
			password
		})
	});

	const res = await resp.json();

	if (resp.status == 200) {
		localStorage.setItem(
			'auth',
			JSON.stringify({
				token: res.accessToken,
				id: res.userId,
				userName: res.userName
			})
		);
		isLoggedInStore.set(true);

		return {
			success: true,
			res: res
		};
	}

	return {
		success: false,
		res: res
	};
}
