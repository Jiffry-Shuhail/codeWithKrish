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

import { create, findAll } from '../services/customer-service';

function CustomerManagement() {

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [address, setAddress] = React.useState('');

    // For Error Message's
    const [isVisible, setIsVisible] = React.useState(false);
    const [error, setError] = React.useState({});

    const [customers, setCustomers] = React.useState([]);

    useEffect(() => {
        fetchAllCustomer();

    }, []);

    const createCustomer = async () => {
        if (name) {
            if (email) {
                try {
                    const response = await create({
                        name, email, address
                    });
                    if (response.data) {
                        fetchAllCustomer();
                        validation('green', "Success!", 'Customer created Successfully');
                        setName('');
                        setEmail('');
                        setAddress('');
                    } else {
                        validation('orange', "Server Side Error", 'Opps! Opps!');
                    }
                } catch (error) {
                    validation('orange', "Server Side Error", error.message);
                }

            } else {
                validation('yellow', "Empty Value", "Please Enter the Email");
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

    const fetchAllCustomer = async () => {
        try {
            const response = await findAll();
            if (response.data) {
                setCustomers(response.data);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
            <Container style={{ paddingTop: "20px" }}>
                <Card fluid color='teal'>
                    <CardContent header='Customer Creation' />
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
                                    id='Email'
                                    control={Input}
                                    label='Email'
                                    value={email}
                                    placeholder='Email'
                                    required={true}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <FormField
                                    id='Address'
                                    control={Input}
                                    label='Address'
                                    value={address}
                                    placeholder='Address'
                                    onChange={(e) => setAddress(e.target.value)}
                                    action={<>
                                        <Button onClick={createCustomer} content='Create Cutomer' icon='user' labelPosition='left' primary />
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
                    <CardContent header='Customer List' />
                    <CardContent>
                        <Table sortable celled fixed>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell> Name</TableHeaderCell>
                                    <TableHeaderCell>Email</TableHeaderCell>
                                    <TableHeaderCell>Address</TableHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    customers && customers.map(({ name, email, address }) =>
                                        <TableRow>
                                            <TableCell>{name}</TableCell>
                                            <TableCell>{email}</TableCell>
                                            <TableCell>{address}</TableCell>
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

export default CustomerManagement;