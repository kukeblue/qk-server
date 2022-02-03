import axios, {Axios} from "axios";
axios.defaults.timeout = 30000;

export const hamibotAxios: Axios = axios.create({
    timeout: 1000,
    baseURL: 'https://api.hamibot.com',
    headers: {
        'Authorization': 'token hmp_8b7c7fb82179037d926b21357b01e334755c1cca9bf787ec7392ec715efb231e',
    }
});

export default {
    hamibotAxios
}
