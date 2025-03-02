import axios from 'axios';
const baseUrl = "http://localhost:3002/customers";

export const fetchOptions = async (query) => await axios.get(`${baseUrl}/${query}/filter`);

export const findById = async (id) => await axios.get(`${baseUrl}/${id}`);

export const create = async (customer) => await axios.post(`${baseUrl}`, customer);

export const findAll = async () => await axios.get(`${baseUrl}`);