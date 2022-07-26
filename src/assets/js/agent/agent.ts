import axios, { AxiosResponse } from 'axios';

const domain = location.origin;

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: Record<string, unknown> | URLSearchParams) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: Record<string, unknown>) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

// add api calls under here, if its a completely new api endpoint, make a new object and place them within it

export const Agent = {
    // Add Objects to make http calls
};