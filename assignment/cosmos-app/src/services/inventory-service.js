import axios from 'axios';
const baseUrl = "http://localhost:3001/products";

export const fetchOptions = async (query) => await axios.get(`${baseUrl}/${query}/filter`);
export const findByIdProduct = async (id) => await axios.get(`${baseUrl}/${id}`);
export const findAll = async () => await axios.get(`${baseUrl}`);
export const create = async (product) => await axios.post(`${baseUrl}`,product);