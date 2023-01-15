import axios from 'axios'

const request = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
});

export const loadUser = () => request.get('/phonebooks')

export const addUser = (name, phone) => request.post('/phonebooks', { name, phone })

export const updateUser = (id, name, phone) => request.put(`/phonebooks/${id}`, { name, phone })

export const removeUser = (id) => request.delete(`/phonebooks/${id}`)