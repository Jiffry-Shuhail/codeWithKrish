import React from "react";
import { FormField, Select } from 'semantic-ui-react';
import { fetchOptions } from '../services/inventory-service';

function FindProduct({ products, setProducts, setPrice, productId, setProductId }) {


    function change(e, { name, value }) {
        if (value) {
            setProductId(value);
            setPrice(products.find(item => item.id === value).price);
        } else {
            setProductId('');
            setPrice('');
        }

    }

    async function fetch(e, { searchQuery }) {
        if (searchQuery) {
            try {
                const response = await fetchOptions(searchQuery);
                if (response.data) {
                    const fetchedOptions = response.data.map((item) => ({
                        price: item.price,
                        id: item.id,
                        key: item.id,
                        text: item.name,
                        value: item.id,
                        content: (
                            <span>
                                <strong>{item.name}</strong> <br />
                                <small style={{ color: "gray" }}>Available Quantity : {item.quantity} | </small>
                                <small style={{ color: "gray" }}>Price : {item.price} </small>
                            </span>
                        )
                    }));
                    setProducts(fetchedOptions);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    };




    return (<FormField
        control={Select}
        options={products}
        label={{ children: 'Product', htmlFor: 'product' }}
        placeholder='Product'
        search
        clearable
        value={productId}
        onSearchChange={fetch}
        onChange={change}
        searchInput={{ id: 'product' }}
    />);
}

export default FindProduct;