import axios, { AxiosResponse } from 'axios';

interface ApiHandler {
  get<T>(url: string): Promise<AxiosResponse<T>>;
}

const client = axios.create({
  baseURL: 'https://api.rawg.io/api/',
});

const rawg: ApiHandler = {
  get: async url => {
    return client.get(url);
  },
};

export default rawg;
