import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  // headers: { // This was the problematic line
  //   'Content-Type': 'application/json',
  // },
}); 