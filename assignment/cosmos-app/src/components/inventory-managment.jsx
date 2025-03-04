import React, { useEffect } from "react";
import {
    Container, CardContent, Card, Form, FormField, FormGroup,
    Input, TableRow,
    TableHeaderCell,
    TableHeader,
    TableCell,
    TableBody,
    Table, Button, Message
} from 'semantic-ui-react';

import { create, findAll } from '../services/inventory-service';

function ProductManagement() {

    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [quantity, setQuantity] = React.useState('');

    // For Error Message's
    const [isVisible, setIsVisible] = React.useState(false);
    const [error, setError] = React.useState({});

    const [products, setProducts] = React.useState([]);

    useEffect(() => {
        fetchAllProduct();

    }, []);

    const createProduct = async () => {
        if (name) {
            if (price) {
                if (!isNaN(price)) {
                    if (quantity) {
                        if (!isNaN(price) && Number.isInteger(parseInt(price))) {
                            try {
                                const response = await create({
                                    name, price, quantity
                                });
                                if (response.data) {
                                    fetchAllProduct();
                                    validation('green', "Success!", 'Product created Successfully');
                                    setName('');
                                    setPrice('');
                                    setQuantity('');
                                } else {
                                    validation('orange', "Server Side Error", 'Opps! Opps!');
                                }
                            } catch (error) {
                                validation('orange', "Server Side Error", error.message);
                            }
                        } else {
                            validation('yellow', "Invalid Value", "Please Enter the valid Quantity");
                        }
                    } else {
                        validation('yellow', "Empty Value", "Please Enter the Quantity");
                    }
                } else {
                    validation('yellow', "Invalid Value", "Please Enter the valid Price");
                }
            } else {
                validation('yellow', "Empty Value", "Please Enter the Price");
            }
        } else {
            validation('yellow', "Empty Value", "Please Enter the Customer Name");
        }
    }

    const validation = (color, title, message) => {
        setError({
            color,
            title,
            message
        });

        setIsVisible(true);
        return false;
    }

    const fetchAllProduct = async () => {
        try {
            const response = await findAll();
            if (response.data) {
                setProducts(response.data);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
            <Container style={{ paddingTop: "20px" }}>
                <Card fluid color='teal'>
                    <CardContent header='Product Creation' />
                    <CardContent>
                        <Form>
                            <FormGroup widths='equal'>
                                <FormField
                                    id='Name'
                                    control={Input}
                                    label='Name'
                                    value={name}
                                    placeholder='Name'
                                    required={true}
                                    onChange={(e) => setName(e.target.value)}
                                />

                                <FormField
                                    id='Price'
                                    type='number'
                                    control={Input}
                                    label='Price'
                                    value={price}
                                    placeholder='Price'
                                    required={true}
                                    onChange={(e) => setPrice(e.target.value)}
                                />

                                <FormField
                                    id='Quanity'
                                    type="number"
                                    control={Input}
                                    label='Quanity'
                                    value={quantity}
                                    placeholder='Quanity'
                                    required={true}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    action={<>
                                        <Button onClick={createProduct} content='Create Product' icon='product hunt' labelPosition='left' primary />
                                    </>}
                                />
                            </FormGroup>
                        </Form>
                        {
                            isVisible && <Message
                                color={error.color}
                                onDismiss={() => setIsVisible(false)}
                                header={error.title}
                                content={error.message}
                            />
                        }

                    </CardContent>
                </Card>

                <Card fluid color='teal'>
                    <CardContent header='Product List' />
                    <CardContent>
                        <Table sortable celled fixed>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell> Name</TableHeaderCell>
                                    <TableHeaderCell>Price</TableHeaderCell>
                                    <TableHeaderCell>Quantity</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    products && products.map(({ name, price, quantity }) =>
                                        <TableRow>
                                            <TableCell>{name}</TableCell>
                                            <TableCell>{price}</TableCell>
                                            <TableCell>{quantity}</TableCell>
                                        </TableRow>)
                                }
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Container>
        </>
    )
}

export default ProductManagement;