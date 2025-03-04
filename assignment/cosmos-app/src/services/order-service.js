import axios from 'axios';
const baseUrl = "http://localhost:3000/orders";

export const createOrder = async (order) => await axios.post(baseUrl, order);

export const getAllOrders = async () => await axios.get(baseUrl);

export const updateOrderStatus = async (id, status) => await axios.patch(`${baseUrl}/${id}/status`, {status});

export const cancelOrder = async (id) => await axios.patch(`${baseUrl}/${id}/cancel`, {status:'CANCELLED'});
