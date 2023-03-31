import axios from 'axios';

  const API = (baseURL) => axios.create({
      baseURL: baseURL,
      withCredentials: true,
      headers: {
        'App': 'Kowo',
      },
  });

export default API;