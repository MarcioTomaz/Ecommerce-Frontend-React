import React, { useContext, useEffect, useState } from "react";
import {Select, Checkbox, Card, Button, Grid, Text, Group, Container, Divider, Alert,} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import axios from "axios";
import { API_URL } from "../../hooks/api.jsx";
import { AuthContext } from "../../GlobalConfig/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../routes/URLS.jsx";

const Checkout = () => {
    const [shippingAddress, setShippingAddress] = useState(null);
    const [billingAddress, setBillingAddress] = useState(null);
    const [sameBilling, setSameBilling] = useState(false);
    const [addressList, setAddressList] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const { t, i18n } = useTranslation(["common", "address", "product", "order"]);

    const { login, userToken } = useContext(AuthContext);

    const icon = <IconInfoCircle />;

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const responseAddresses = await axios.get(`${API_URL}/address/read/addresses`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                });

                const cartItemsResponse = await axios.get(`${API_URL}/cart/checkoutItems`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                });

                setAddressList(responseAddresses.data);
                setCartItems(cartItemsResponse.data);

                console.log("ADDRESS LIST: ", responseAddresses.data);

            } catch (error) {
                console.error("Erro ao buscar endereços:", error);
                setAddressList([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddresses();
    }, []);

    const stepPaymentOrder = () => {
        const addressObject = {
            billingAddress: billingAddress,
            shippingAddress: sameBilling ? billingAddress : shippingAddress,
        };

        console.log("Address Object: ", addressObject);
        try {
            axios
                .post(`${API_URL}/order/create`, addressObject, {
                    headers: { Authorization: `Bearer ${userToken}` },
                })
                .then((r) => {
                    console.log("Order created: ", r.data);
                    localStorage.setItem("cartItem", []);
                    navigate(`/order/${r.data.id}/payment`);
                });
        } catch (e) {
            console.log("Erro order step 1 : " + e);
        }
    };

    if (isLoading) {
        return (
            <Container size="md" style={{ textAlign: "center", marginTop: 50 }}>
                <Text>Carregando dados...</Text>
            </Container>
        );
    }

    return (
        <Container size="md" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Card shadow="sm" padding="lg" style={{ width: "100%", maxWidth: 600 }}>
                <Grid gutter="md">
                    <Grid.Col span={12}>
                        <Text weight={100}>{t("address:shippingAddress")}</Text>

                        {addressList.length < 1 && (
                            <>
                                <Alert variant="outline" color="red" radius="md" title={t("common:alert")} icon={icon}>
                                    {t("address:addressEmpty")}
                                </Alert>

                                <Button variant="filled" color="red" onClick={() => navigate(ROUTES.ADDRESS_REGISTER)}>
                                    {t("address:registerNewAddress")}
                                </Button>
                            </>
                        )}

                        {addressList.length > 0 && (
                            <Select
                                data={addressList.map((a) => ({
                                    value: String(a.id),
                                    label: `${a.street}, ${a.number}, ${a.city}`,
                                }))}
                                value={shippingAddress}
                                onChange={setShippingAddress}
                                placeholder={t("address:selectAddress")}
                            />
                        )}
                    </Grid.Col>

                    <Grid.Col span={12}>
                        <Text weight={500}>{t("address:billingAddress")}</Text>

                        {addressList.length < 1 && (
                            <Alert variant="outline" color="red" radius="md" title={t("common:alert")} icon={icon}>
                                {t("address:addressEmpty")}
                            </Alert>
                        )}

                        {addressList.length > 0 && (
                            <>
                                <Checkbox
                                    label={t("address:useSameShippingAddress")}
                                    checked={sameBilling}
                                    onChange={(event) => {
                                        setSameBilling(event.currentTarget.checked);
                                        if (event.currentTarget.checked) {
                                            setBillingAddress(shippingAddress);
                                        }
                                    }}
                                    mb="sm"
                                />

                                <Select
                                    data={addressList.map((a) => ({
                                        value: String(a.id),
                                        label: `${a.street}, ${a.number}, ${a.city}`,
                                    }))}
                                    value={billingAddress}
                                    onChange={setBillingAddress}
                                    placeholder={t("address:selectAddress")}
                                />
                            </>
                        )}
                    </Grid.Col>
                </Grid>

                <Text mt="lg" weight={500} align="center">
                    {t("order:orderItems")}
                </Text>
                <Divider my="md" />

                {cartItems.map((item, index) => (
                    <Group key={`${item.id}-${index}`} position="apart">
                        <Text>
                            {item.product_name} x{item.quantity}
                        </Text>
                        <Text>R$ {(item.product_price * item.quantity).toFixed(2)}</Text>
                    </Group>
                ))}

                <Button
                    mt="lg"
                    fullWidth
                    onClick={stepPaymentOrder}
                    disabled={addressList.length < 1}
                >
                    {t("order:proceedToPayment")}
                </Button>
            </Card>
        </Container>
    );
};

export default Checkout;
