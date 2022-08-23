import axios from 'axios';

export default (email: string) => axios.post('/api/validateEmail', {
  email,
})
  .then((res) => {
    if (res.data.success) {
      return Promise.resolve(true);
    }

    return Promise.reject(new Error(res.data.error));
  })
  .catch(({ message }) => Promise.reject(message));
