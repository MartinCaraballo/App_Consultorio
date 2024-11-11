import axios from "axios";

const AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: `http://${process.env.NEXT_PUBLIC_API_URL}`,
});

export default AxiosInstance;
