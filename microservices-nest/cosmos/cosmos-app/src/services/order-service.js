import axios from 'axios';
const baseUrl = "http://localhost:3000/orders";

export const createOrder = async (order) => await axios.post(baseUrl, order);

export const getAllOrders = async () => await axios.get(baseUrl);