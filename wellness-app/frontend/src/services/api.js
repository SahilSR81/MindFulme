import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://your-backend-url.com/api';

async function fetchWithAuth(url, options = {}) {
  const token = await AsyncStorage.getItem('userToken');
  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export async function login(username, password) {
  const response = await fetch(`${API_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  return data.access_token;
}

export async function signUp(userData) {
  const response = await fetch(`${API_URL}/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Sign up failed');
  }

  return response.json();
}

export async function recordMood(score) {
  const response = await fetchWithAuth('/moods/', {
    method: 'POST',
    body: JSON.stringify({ score }),
  });

  if (!response.ok) {
    throw new Error('Failed to record mood');
  }

  return response.json();
}

export async function getContent(contentType) {
  const response = await fetchWithAuth(`/content/${contentType}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${contentType}`);
  }

  return response.json();
}

export async function predictMood(data) {
  const response = await fetchWithAuth('/moods/predict', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to predict mood');
  }

  return response.json();
}