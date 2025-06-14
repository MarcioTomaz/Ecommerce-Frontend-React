import {useContext, useEffect, useState} from "react";
import {Select, Checkbox, Card, Button, Grid, Text, Group, Container, Divider} from "@mantine/core";
import axios from "axios";
import {API_URL} from "../../hooks/api.jsx";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const Checkout = () => {
    const [shippingAddress, setShippingAddress] = useState(null);
    const [billingAddress, setBillingAddress] = useState(null);
    const [sameBilling, setSameBilling] = useState(false);
    const [addressList, setAddressList] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation(['common', 'address', 'product', 'order']);

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
                        <Text weight={500}>{t('address:shippingAddress')}</Text>
                        <Select
                            data={addressList.map((a) => ({
                                value: String(a.id),
                                label: `${a.street}, ${a.number}, ${a.city}`
                            }))}
                            value={shippingAddress}
                            onChange={setShippingAddress}
                            placeholder={t('address:selectAddress')}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Text weight={500}>{t('address:billingAddress')}</Text>
                        <Checkbox
                            label={t('address:useSameShippingAddress')}
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
                                placeholder={t('address:selectAddress')}
                            />
                        )}
                    </Grid.Col>
                </Grid>
                <Text mt="lg" weight={500} align="center">{t('order:orderItems')}</Text>
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
                    {t('order:proceedToPayment')}
                </Button>
            </Card>
        </Container>
    );
};

export default Checkout;
