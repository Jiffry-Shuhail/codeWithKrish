import React from "react";
import { Dropdown } from 'semantic-ui-react';
import { fetchOptions } from '../services/customer-service'

function FindCustomer({customer, setCustomer, customerId, setCustomerId }) {

    function change(e, { name, value }){
        setCustomerId(value);
    }

    async function fetch(e, { searchQuery }) {
        if (searchQuery) {
            try {
                const response = await fetchOptions(searchQuery);
                if (response.data) {
                    const fetchedOptions = response.data.map((item) => ({
                        key: item.id,
                        text: item.name,
                        value: item.id,
                        content: (
                            <span>
                                <strong>{item.name}</strong> <br />
                                <small>{item.email}</small> <br />
                                <small style={{ color: "gray" }}>{item.address}</small>
                            </span>
                        )
                    }));
                    setCustomer(fetchedOptions);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    };

    return (
        <Dropdown
            placeholder='Select Customer'
            fluid
            search
            selection
            clearable
            value={customerId}
            options={customer}
            onChange={change}
            onSearchChange={fetch}
        />
    );
}

export default FindCustomer;