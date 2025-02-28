import React, { useEffect } from "react";
import { createOrder, getAllOrders } from "../services/order-service";

export default function OrderManagement() {

    const [customerId, setCustomerId] = React.useState("");
    const [productId, setProductId] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [quantity, setQuantity] = React.useState("");
    const [orders, setOrders] = React.useState([]);

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Order Submitted');
            const order = {
                customerId,
                items: [
                    {
                        productId,
                        price,
                        quantity
                    }
                ]
            };

            const response = await createOrder(order);
            console.log(response);
            console.log(customerId, productId, price, quantity);
        } catch (error) {
            alert(error.message);
        }
    }

    useEffect(() => {
        fetchOrders();

    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getAllOrders();
            console.log(response.data);
            setOrders(response.data);
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <>
            <p>Create Order</p>
            <form onSubmit={handleOrderSubmit}>
                <label htmlFor='customerId'>Customer Id</label>
                <input type="text" id="customerId" value={customerId} onChange={(e) => setCustomerId(e.target.value)} name="customerId" required />
                <br />
                <label htmlFor='productId'>Product Id</label>
                <input type="text" id="productId" name="productId" value={productId} onChange={(e) => setProductId(e.target.value)} required />
                <br />
                <label htmlFor='price'>Price</label>
                <input type="text" id="price" name="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <br />
                <label htmlFor='quantity'>Quantity</label>
                <input type="text" id="quantity" name="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                <br />
                <input type="submit" value="Create" />
            </form>

            <div>
                <table>
                    <thead>
                        <tr>
                            <th>DI</th>
                            <th>Customer ID</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders && orders.map(({id, customerId, createdAt, status})=>{
                               return <tr>
                                    <td>{id}</td>
                                    <td>{customerId}</td>
                                    <td>{createdAt.split('T')[0]}</td>
                                    <td>{status}</td>
                                    <td><input type="button" value="Edit"/></td>
                                    <td><input type="button" value="View Items"/></td>
                                    
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    );

}
