import axios, { AxiosResponse } from 'axios';

import { GAMEAPI_BASE_URL } from 'react-native-dotenv';

interface ApiHandler {
  get<T>(url: string): Promise<AxiosResponse<T>>;
}

const client = axios.create({
  baseURL: GAMEAPI_BASE_URL,
});

const rawg: ApiHandler = {
  get: async url => {
    return client.get(url);
  },
};

export default rawg;
