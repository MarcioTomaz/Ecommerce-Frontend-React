import {ActionIcon, Button, Container, Group, Table, Text, useMantineTheme} from "@mantine/core";
import React, {useContext, useEffect, useState} from "react";
import {IconMinus, IconPlus} from '@tabler/icons-react';
import axios from "axios";
import {API_URL} from "../../hooks/api.jsx";
import {ROUTES} from "../../routes/URLS.jsx";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";

const CartDetails = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const {login, userToken} = useContext(AuthContext);
    const theme = useMantineTheme();

    useEffect(() => {

        let cartItems = localStorage.getItem("cartItem");
        let parsedCartItems = cartItems ? JSON.parse(cartItems) : {};

        console.log("parsedCartItems: " + JSON.stringify(parsedCartItems));

        let transformedItems = Object.values(parsedCartItems).map(item => ({
            product: {
                id: item.product.id,
                name: item.product.name,
                price: item.product.price
            },
            quantity: item.quantity
        }));

        console.log("Itens transformados:", transformedItems);
        setCartItems(transformedItems);
    }, []);

    const removeItem = (id) => {
        setCartItems(prevItems => {
            const updatedCart = prevItems ? prevItems.filter(item => item.product.id !== id) : [];

            localStorage.setItem("cartItem", JSON.stringify(updatedCart));
            return updatedCart;
        })
    };

    const updateQuantity = (id, amount) => {
        setCartItems(prevItems => {
            const updatedCart = prevItems.map(item =>
                item.product.id === id ? {...item, quantity: Math.max(1, item.quantity + amount)} : item
            );

            // Atualiza o localStorage
            localStorage.setItem("cartItem", JSON.stringify(updatedCart));

            return updatedCart;
        });
    };

    const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const startOrder = async () => {

        let transformedItems = Object.values(cartItems).map(item => ({
            items: [
                {
                    product: {
                        id: item.product.id
                    },
                    quantity: item.quantity
                }
            ]
        }));

        let finalOrderItems = {
            items: transformedItems.flatMap(item => item.items)
        };

        console.log("ITEMS DO CARRINHO: " + JSON.stringify(finalOrderItems));

        try {
            await axios.post(`${API_URL}/cart/create`, finalOrderItems,
                {headers: {'Authorization': `Bearer ${userToken}`}});

            navigate(ROUTES.CHECKOUT)

        } catch (e) {
            console.log("Erro carrinho:" + e)
        }

    };


    return (
        <Container style={{border: '1px solid #ddd', padding: '20px', borderRadius: '8px'}}>
            <Text size="xl" weight={700} mb={20} align="center">Carrinho de Compras</Text>
            <Table striped highlightOnHover>
                <thead>
                <tr>
                    <th>Produto</th>
                    <th>Preço</th>
                    <th>Quantidade</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {cartItems.length === 0 ? (
                    <tr>
                        <td colSpan="4" style={{textAlign: 'center'}}>Seu carrinho está vazio</td>
                    </tr>
                ) : (
                    cartItems.map(item => (
                        <tr key={crypto.randomUUID()}>
                            <td>{item.product.name}</td>
                            <td>R$ {item.product.price}</td>
                            <td>
                                <ActionIcon onClick={() => updateQuantity(item.product.id, -1)}><IconMinus
                                    size={16}/></ActionIcon>
                                {item.quantity}
                                <ActionIcon onClick={() => updateQuantity(item.product.id, 1)}><IconPlus
                                    size={16}/></ActionIcon>
                            </td>
                            <td>
                                <Button color="red" onClick={() => removeItem(item.product.id)}>Remover</Button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </Table>
            <Group position="apart" mt={30}>
                <Text size="lg" weight={700}>Total: R$ {total.toFixed(2)}</Text>
                <Button color="green" onClick={() => startOrder()}>Finalizar Compra</Button>
            </Group>

            <Button
                style={{background: theme.colors.yellow[9]}}
                onClick={() => navigate(ROUTES.PRODUCT_LIST)}
                type="button"
                mt="md">Voltar
            </Button>
        </Container>
    );
};

export default CartDetails;
