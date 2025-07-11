import axios, {AxiosError} from "axios";

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: `http://${process.env.NEXT_PUBLIC_API_URL}`,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 403) {
            // Redirect to /login if the status code is 403
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
