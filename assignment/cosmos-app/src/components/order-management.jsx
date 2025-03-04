import React, { useEffect } from "react";
import { createOrder, getAllOrders, updateOrderStatus, cancelOrder } from "../services/order-service";
import { findById } from "../services/customer-service";
import { findByIdProduct } from "../services/inventory-service";
import {
    Container, CardContent, Card, Form, FormField, Divider, FormGroup,
    Input, TableRow,
    TableHeaderCell,
    TableHeader,
    TableCell,
    TableBody,
    Table, Button, Icon, TableFooter, GridColumn, Grid, ButtonContent, ButtonGroup, Message
} from 'semantic-ui-react';
import FindCustomer from './customer-search-dropdown';
import FindProduct from './product-search-dropdown';

function OrderManagement() {

    // User State changes for Customer List Down
    const [customer, setCustomer] = React.useState([]);
    const [customerId, setCustomerId] = React.useState("");

    // User State changes for Product List Down
    const [products, setProducts] = React.useState([]);
    const [productId, setProductId] = React.useState("");

    // User State changes for Product Items List
    const [itemList, setItemList] = React.useState([]);

    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedOrderItems, setSelectedOrderItems] = React.useState([]);

    // For Error Message's
    const [isVisible, setIsVisible] = React.useState(false);
    const [error, setError] = React.useState({});

    const [price, setPrice] = React.useState("");
    const [quantity, setQuantity] = React.useState("");
    const [orders, setOrders] = React.useState([]);

    const validation = (color, title, message) => {
        setError({
            color,
            title,
            message
        });

        setIsVisible(true);
        return false;
    }

    const handleOrderSubmit = async (e) => {
        if (customerId) {
            if (itemList && itemList.length > 0) {
                try {
                    const order = {
                        customerId,
                        items: itemList.map(({ name, price, id, ...rest }) => ({
                            ...rest,
                            productId: id,
                            price: parseInt(price, 10),
                        }))
                    };

                    const response = await createOrder(order);
                    if (response.data) {
                        setProductId('');
                        setPrice('');
                        setQuantity('');
                        setItemList('');
                        fetchOrders();
                        validation('green', "Success!", 'Order created Successfully');
                    } else {
                        validation('orange', "Server Side Error", 'Opps! Opps!');
                    }
                } catch (error) {
                    validation('orange', "Server Side Error", error.message);
                }
            } else {
                validation('yellow', "Empty Value", "Please Add The Items");
            }
        } else {
            validation('yellow', "Empty Value", "Please Select the Customer");
        }

    }

    useEffect(() => {
        fetchOrders();

    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getAllOrders();
            if (response.data) {
                const updatedOrders = await Promise.all(
                    response.data.map(async (order) => {
                        const customerResponse = await findById(order.customerId);
                        if (customerResponse.data) {
                            return {
                                ...order,
                                name: customerResponse.data.name,
                            };
                        }
                        return order;
                    })
                );

                setOrders(updatedOrders);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    const addItemRecord = () => {
        if (productId) {
            if (quantity) {
                const items = itemList.find(item => item.id === productId);
                if (items && items.id) {
                    items.quantity += parseInt(quantity);
                } else {
                    const product = products.find(item => item.id === productId);
                    setItemList([...itemList, {
                        id: productId,
                        name: product.text,
                        price: product.price,
                        quantity: parseInt(quantity)
                    }]);
                }

                setProductId('');
                setPrice('');
                setQuantity('');
            } else {
                validation('yellow', "Empty Value", "Please enter Quantity");
            }
        } else {
            validation('yellow', "Empty Value", 'Please select Customer');
        }
    }

    function remove(id) {
        setItemList(itemList.filter((item) => item.id !== id));
    }

    async function getOrderItems(id) {
        const filterData = orders.find(o => o.id === id).items;
        const updatedOrders = await Promise.all(
            filterData.map(async (item) => {
                const productResponse = await findByIdProduct(item.productId);
                if (productResponse.data) {
                    return {
                        ...item,
                        name: productResponse.data.name,
                    };
                }
                return item;
            })
        );
        setSelectedOrderItems(updatedOrders);
        setIsOpen(true);
    }

    const updateOrder = async (id, status) => {
        try {
            const response = await updateOrderStatus(id, status);
            if (response.data) {
                fetchOrders();
                validation('green', "Success!", 'Order status updated Successfully');
            } else {
                validation('orange', "Server Side Error", 'Opps! Opps!');
            }
        } catch (error) {
            validation('orange', "Server Side Error", error.message);
        }
    }

    const cancelOrders = async (id) => {
        try {
            const response = await cancelOrder(id);
            if (response.data) {
                fetchOrders();
                validation('green', "Success!", 'Order is cancel Successfully');
            } else {
                validation('orange', "Server Side Error", 'Opps! Opps!');
            }
        } catch (error) {
            validation('orange', "Server Side Error", error.message);
        }
    }

    const handleStatusUpdate = (order) => {
        return order.status === 'PENDING'
            ? 'CONFIRMED'
            : order.status === 'CONFIRMED'
                ? 'SHIPPED'
                : 'DELIVERED';
    }

    return (
        <>
            <Container style={{ paddingTop: "20px" }}>
                <Card fluid color='teal'>
                    <CardContent header='Order Creation' />
                    <CardContent>
                        <Form>
                            <FormField>
                                <label>Customer</label>
                                <FindCustomer customer={customer} setCustomer={setCustomer} customerId={customerId} setCustomerId={setCustomerId} />
                            </FormField>
                        </Form>

                        <Divider horizontal>
                            <h4>Order Items</h4>
                        </Divider>

                        <Form>
                            <FormGroup widths='equal'>

                                <FindProduct products={products} setProducts={setProducts} setPrice={setPrice} setProductId={setProductId} />

                                <FormField
                                    id='Price'
                                    control={Input}
                                    label='Price'
                                    value={price}
                                    placeholder='Price'
                                    readOnly
                                />

                                <FormField
                                    type="number"
                                    id='Quantity'
                                    control={Input}
                                    label='Quantity'
                                    placeholder='Quantity'
                                    required={true}
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    action={<>
                                        <Button color='twitter' onClick={addItemRecord}>Add</Button>
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

                        <Table sortable celled fixed>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell>
                                        Product Name
                                    </TableHeaderCell>
                                    <TableHeaderCell>
                                        Price
                                    </TableHeaderCell>
                                    <TableHeaderCell>
                                        Quantity
                                    </TableHeaderCell>
                                    <TableHeaderCell>Action</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    itemList && itemList.map((item, index) =>
                                        <TableRow key={index}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.price}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>
                                                <Button icon onClick={() => remove(item.id)} color='google plus'>
                                                    <Icon name='trash' />
                                                </Button></TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                            {itemList.length > 0 && <>
                                <TableFooter fullWidth>
                                    <TableRow>
                                        <TableHeaderCell colSpan='4'>
                                            <Button
                                                floated='right'
                                                icon
                                                labelPosition='left'
                                                primary
                                                size='small'
                                                onClick={handleOrderSubmit}
                                            >
                                                <Icon name='first order' /> Create Order
                                            </Button>
                                        </TableHeaderCell>
                                    </TableRow>
                                </TableFooter>
                            </>}
                        </Table>
                    </CardContent>

                </Card>

                <Card fluid color='teal'>
                    <CardContent header='Order List' />
                    <CardContent>
                        <Grid columns={!isOpen ? 1 : 2} relaxed='very' stackable>
                            <GridColumn header='Order List'>
                                <Table className="ui celled table" selectable>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHeaderCell>ID</TableHeaderCell>
                                            <TableHeaderCell>Customer</TableHeaderCell>
                                            <TableHeaderCell>Date</TableHeaderCell>
                                            <TableHeaderCell>Status</TableHeaderCell>
                                            <TableHeaderCell>Action</TableHeaderCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            orders && orders.map(order =>
                                                <TableRow>
                                                    <TableCell>{order.id}</TableCell>
                                                    <TableCell>{order.name}</TableCell>
                                                    <TableCell>{order.createdAt.split('T')[0]}</TableCell>
                                                    <TableCell className={order.status === 'PENDING' ? 'warning' : order.status === 'CONFIRMED' ? 'positive' : 'negative'}>{order.status}</TableCell>
                                                    <TableCell style={{ padding: 0 }}>
                                                        <ButtonGroup>
                                                            <Button animated='vertical' color='teal'
                                                                onClick={() => getOrderItems(order.id)}>
                                                                <ButtonContent hidden>View</ButtonContent>
                                                                <ButtonContent visible>
                                                                    <Icon name='eye' />
                                                                </ButtonContent>
                                                            </Button>
                                                            {
                                                                (order.status !== 'CANCELLED' && order.status !== 'DELIVERED') &&
                                                                <>
                                                                    <Button animated='vertical' color='blue'
                                                                        onClick={() => updateOrder(order.id, handleStatusUpdate(order))}>
                                                                        <ButtonContent hidden>
                                                                            <small>
                                                                                {handleStatusUpdate(order)}
                                                                            </small>
                                                                        </ButtonContent>
                                                                        <ButtonContent visible>
                                                                            <Icon name='arrow right' />
                                                                        </ButtonContent>
                                                                    </Button>

                                                                    <Button animated='vertical' color='red' onClick={()=>cancelOrders(order.id)}>
                                                                        <ButtonContent hidden>Cancel</ButtonContent>
                                                                        <ButtonContent visible>
                                                                            <Icon name='cancel' />
                                                                        </ButtonContent>
                                                                    </Button>
                                                                </>
                                                            }

                                                        </ButtonGroup>
                                                    </TableCell>
                                                </TableRow>)
                                        }
                                    </TableBody>
                                </Table >
                            </GridColumn>

                            {
                                isOpen && <>
                                    <GridColumn verticalAlign='middle'>
                                        <Table className="ui celled table" selectable>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHeaderCell>Name</TableHeaderCell>
                                                    <TableHeaderCell>Price</TableHeaderCell>
                                                    <TableHeaderCell>Quantity</TableHeaderCell>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {selectedOrderItems &&
                                                    selectedOrderItems.map(item =>
                                                        <TableRow>
                                                            <TableCell>{item.name}</TableCell>
                                                            <TableCell>{item.price}</TableCell>
                                                            <TableCell>{item.quantity}</TableCell>
                                                        </TableRow>)
                                                }
                                            </TableBody>

                                            <TableFooter fullWidth>
                                                <TableRow>
                                                    <TableHeaderCell colSpan='3'>
                                                        <Button
                                                            floated='right'
                                                            icon
                                                            labelPosition='left'
                                                            red
                                                            size='small'
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            <Icon name='cancel' /> cancel
                                                        </Button>
                                                    </TableHeaderCell>
                                                </TableRow>
                                            </TableFooter>
                                        </Table>
                                    </GridColumn>
                                </>
                            }

                        </Grid>
                        {
                            isOpen && <Divider vertical><Icon name="angle double right" /></Divider>
                        }

                    </CardContent>
                </Card>
            </Container>
        </>
    );

}


export default OrderManagement;
