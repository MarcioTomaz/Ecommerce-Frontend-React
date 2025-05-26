import {useContext, useEffect, useState} from "react";
import {Select, Checkbox, Card, Button, Grid, Text, Group, Container, Divider} from "@mantine/core";
import axios from "axios";
import {API_URL} from "../../hooks/api.jsx";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../routes/URLS.jsx";

const mockAddresses = [
    {id: "1", label: "Rua A, 123 - Cidade X"},
    {id: "2", label: "Avenida B, 456 - Cidade Y"},
];

const mockCartItems = [
    {id: "101", name: "Produto 1", quantity: 2, price: 50.0},
    {id: "102", name: "Produto 2", quantity: 1, price: 30.0},
];

const Checkout = () => {
    const [shippingAddress, setShippingAddress] = useState(null);
    const [billingAddress, setBillingAddress] = useState(null);
    const [sameBilling, setSameBilling] = useState(false);
    const [addressList, setAddressList] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    const {login, userToken} = useContext(AuthContext);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const responseAddresses = await axios.get(`${API_URL}/address/read/addresses`, {
                    headers: {'Authorization': `Bearer ${userToken}`}
                });
                console.log("ADDRESSS: ", responseAddresses.data)

                const cartItems = await axios.get(`${API_URL}/cart/checkoutItems`,
                    {headers: {'Authorization': `Bearer ${userToken}`}});

                setAddressList(responseAddresses.data);
                setCartItems(cartItems.data);
            } catch (error) {
                console.error("Erro ao buscar endereços:", error);
                setAddressList([]); // Garante que não seja undefined
            }
        };

        fetchAddresses();
    }, [userToken]);

    const stepPaymentOrder = () => {
        let addressObject = {
            billingAddress: billingAddress,
            shippingAddress: sameBilling ? billingAddress : shippingAddress
        };

        console.log("Address Object: ", addressObject);
        try {
            axios.post(`${API_URL}/order/create`,
                addressObject,
                {headers: {'Authorization': `Bearer ${userToken}`}})
                .then(r => {

                    console.log("Order created: ", r.data);
                    localStorage.setItem("cartItem", []);

                    navigate(`/order/${r.data.id}/payment`);
                });

        } catch (e) {
            console.log("Erro order step 1 : " + e)
        }
    }

    return (
        <Container size="md" style={{display: "flex", justifyContent: "center", alignItems: "center",}}>
            <Card shadow="sm" padding="lg" style={{width: "100%", maxWidth: 600}}>
                <Grid gutter="md">
                    <Grid.Col span={12}>
                        <Text weight={500}>Endereço de Entrega</Text>
                        <Select
                            data={addressList.map((a) => ({
                                value: String(a.id),
                                label: `${a.street}, ${a.number}, ${a.city}`
                            }))}
                            value={shippingAddress}
                            onChange={setShippingAddress}
                            placeholder="Selecione o endereço"
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Text weight={500}>Endereço de Cobrança</Text>
                        <Checkbox
                            label="Usar o mesmo endereço de entrega"
                            checked={sameBilling}
                            onChange={(event) => {
                                setSameBilling(event.currentTarget.checked);
                                if (event.currentTarget.checked) {
                                    setBillingAddress(shippingAddress);
                                }
                            }}
                        />
                        {!sameBilling && (
                            <Select
                                data={addressList.map((a) => ({
                                    value: String(a.id),
                                    label: `${a.street}, ${a.number}, ${a.city}`
                                }))}
                                value={billingAddress}
                                onChange={setBillingAddress}
                                placeholder="Selecione o endereço"
                            />
                        )}
                    </Grid.Col>
                </Grid>
                <Text mt="lg" weight={500} align="center">Itens do Pedido</Text>
                <Divider my="md"/>

                {cartItems.map((item) => (
                    <Group key={Math.random()} position="apart">
                        <Text>{item.product_name} x{item.quantity}</Text>
                        <Text>R$ {item.product_price.toFixed(2) * item.quantity}</Text>
                    </Group>
                ))}
                <Button mt="lg" fullWidth
                        onClick={() => {
                            stepPaymentOrder()
                        }}
                >
                    Prosseguir para o Pagamento
                </Button>
            </Card>
        </Container>
    );
};

export default Checkout;
