import {
    Card,
    Text,
    Grid,
    Title,
    Divider,
    Group,
    Badge,
    Button,
    Collapse,
    Container,
    useMantineTheme,
    Modal,
    TextInput
} from '@mantine/core';
import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";
import {API_URL} from "../../hooks/api.jsx";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {ROUTES} from "../../routes/URLS.jsx";
import {useDisclosure} from "@mantine/hooks";
import {useTranslation} from "react-i18next";

const OrderDetails = () => {
    const [itemsOpen, setItemsOpen] = useState(false);
    const {login, userToken, userRole} = useContext(AuthContext);
    const { t, i18n } = useTranslation(['common', 'registerPage','order', 'product']);

    // Handlers para as modais de aceite e recusa
    const [openedAccept, acceptHandlers] = useDisclosure(false);
    const [openedReject, rejectHandlers] = useDisclosure(false);

    // Estado para exibir o campo do motivo da recusa e armazenar o motivo digitado
    const [isRejectedReasonVisible, setIsRejectedReasonVisible] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    const [orderDetails, setOrderDetails] = useState(null);
    const {id} = useParams();
    const navigate = useNavigate();
    const theme = useMantineTheme();

    useEffect(() => {
        fetchOrderDetails();
    }, [id, userToken, userRole]);

    const fetchOrderDetails = async () => {

        try {
            console.log("UserRole: ", userRole);

         const response = await axios.get(`${API_URL}/order/details/${id}`, {
                headers: {'Authorization': `Bearer ${userToken}`}});

            setOrderDetails(response.data);
            console.log(response.data);
        }catch(error) {
            console.log(error);
        }

    }

    const handleOrderAcceptance = () => {

        try {

            const payload = {
                orderId: id,
                isAccept: true,
                reason: null
            }

            axios.post(`${API_URL}/adm/order/accept`, payload,
                {headers: {'Authorization': `Bearer ${userToken}`}})
                .then(res => {
                    navigate(ROUTES.ADM_ORDER_LIST);

                }).catch(err => {
                console.log(err);
            })
        } catch (err) {
            console.log(err);
        } finally {
            acceptHandlers.close();
        }

    };

    const handleRejectClick = () => {
        // Exibe o campo para escrever o motivo da recusa
        setIsRejectedReasonVisible(true);
    };

    const handleSubmitRejection = () => {

        console.log("Motivo da recusa:", rejectionReason);
        setIsRejectedReasonVisible(false);

        try {
            const payload = {
                orderId: id,
                isAccept: false,
                reason: rejectionReason
            }

            axios.post(`${API_URL}/adm/order/accept`, payload,
                {headers: {'Authorization': `Bearer ${userToken}`}})
                .then(res => {
                    navigate(ROUTES.ADM_ORDER_LIST);
                }).catch(err => {
                console.log(err);
            })

        } catch (error) {
            console.log(error);
        } finally {
            rejectHandlers.close();
        }

    };

    return (
        <Container size="md" style={{marginTop: 40}}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={2}>{t('order:orderDetails')}</Title>
                <Divider my="sm"/>

                {/* Informações do Cliente */}
                <Title order={4}>{t('common:client')}</Title>
                <Text>
                    {orderDetails?.person.firstName} {orderDetails?.person.lastName} ({orderDetails?.person.gender})
                </Text>
                <Text>{t('registerPage:birthDate')}: {orderDetails?.person.birthDate}</Text>
                <Text>{t('registerPage:phoneNumber')}: {orderDetails?.person.phoneNumber} ({orderDetails?.person.phoneType})</Text>

                <Divider my="sm"/>

                {/* Endereço de Cobrança */}
                <Title order={4}>{t('order:billingAddress')}</Title>
                <Text>
                    {orderDetails?.billingAddress.street}, {orderDetails?.billingAddress.number} - {orderDetails?.billingAddress.district}
                </Text>
                <Text>
                    {orderDetails?.billingAddress.city} - {orderDetails?.billingAddress.state}, {orderDetails?.billingAddress.zipCode}
                </Text>
                <Text>{t('order:country')}: {orderDetails?.billingAddress.country}</Text>

                <Divider my="sm"/>

                {/* Endereço de Entrega */}
                <Title order={4}>{t('order:shippingAddress')}</Title>
                <Text>
                    {orderDetails?.shippingAddress.street}, {orderDetails?.shippingAddress.number} - {orderDetails?.shippingAddress.district}
                </Text>
                <Text>
                    {orderDetails?.shippingAddress.city} - {orderDetails?.shippingAddress.state}, {orderDetails?.shippingAddress.zipCode}
                </Text>
                <Text>{t('order:country')}: {orderDetails?.shippingAddress.country}</Text>

                <Divider my="sm"/>

                {/* Itens do Pedido */}
                <Title order={4}>{t('order:orderItems')}</Title>
                <Button onClick={() => setItemsOpen((prev) => !prev)}>
                    {itemsOpen ? t('order:hideItems') : t('order:showItems')}
                </Button>
                <Collapse in={itemsOpen}>
                    {orderDetails?.orderItemsDTO.map((item, index) => (
                        <Card key={index} shadow="xs" padding="sm" mt="sm">
                            <Text>{t('common:name')}: {item.product.product_name}</Text>
                            <Text>{t('product:description')}: {item.product.product_description}</Text>
                            <Text>{t('product:Category')}: {item.product.productCategory}</Text>
                            <Text>{t('product:Price')}: R$ {item.product.product_price.toFixed(2)}</Text>
                            <Text>{t('product:Quantity')}: {item.quantity}</Text>
                        </Card>
                    ))}
                </Collapse>

                <Divider my="sm"/>

                {/* Pagamento */}
                <Title order={4}>{t('order:payment')}</Title>
                {orderDetails?.status === 'WAITING_FOR_PAYMENT'
                    ? <Button onClick={() => navigate(`/order/${id}/payment`)} type="button">
                        {t('order:proceedPayment')}
                    </Button>
                    : ''
                }
                <Text>{t('order:total')}: R$ {orderDetails?.cart.toFixed(2)}</Text>
                <Group>
                    <Text>{t('order:method')}:  {t(`order:${orderDetails?.paymentMethods[0]?.type}`) }</Text>
                    <Badge color={orderDetails?.status === 'PAID' ? 'green' : 'red'}>
                        {t(`order:${orderDetails?.status}`) }
                    </Badge>
                </Group>
                <Divider my="sm"/>
                { (orderDetails?.status === 'CANCELED' || orderDetails?.status === 'EXPIRED') && (
                    <Group>
                        <Divider my="sm"/>

                        <Grid>
                            <Grid.Col span={12}>
                                <Title order={3} style={{color: theme.colors.red[5]}}
                                >{t('order:orderCancelSeeReason')}</Title>
                            </Grid.Col>
                            <Grid.Col span={12}>
                                {orderDetails.comments.map((c, index)=> <Text key={index}>{c.comment}</Text>)}
                            </Grid.Col>
                        </Grid>

                    </Group>
                )}


                <Divider my="sm"/>

                {userRole === 'admin' && (
                    <Grid>
                        {/* Modal de Aceitação */}
                        <Modal
                            opened={openedAccept}
                            onClose={acceptHandlers.close}
                            title="Analisando Pedido"
                        >
                            {t('order:acceptOrderQuestion')}
                            <Group mt="md" spacing="md">
                                <Button
                                    variant="filled"
                                    style={{background: theme.colors.green[5]}}
                                    onClick={handleOrderAcceptance}
                                >
                                    {t('common:accept')}
                                </Button>
                                <Button
                                    variant="filled"
                                    style={{background: theme.colors.gray[5]}}
                                    onClick={acceptHandlers.close}
                                >
                                    {t('common:cancel')}

                                </Button>
                            </Group>
                        </Modal>

                        {/* Modal de Recusa */}
                        <Modal
                            opened={openedReject}
                            onClose={() => {
                                setIsRejectedReasonVisible(false);
                                rejectHandlers.close();
                            }}
                            title={t('order:analyzingOrder')}
                        >
                            {!isRejectedReasonVisible ? (
                                <>
                                    {t('order:rejectOrderQuestion')}
                                    <Group mt="md" spacing="md">
                                        <Button
                                            variant="filled"
                                            style={{background: theme.colors.red[5]}}
                                            onClick={handleRejectClick}
                                        >
                                            {t('order:enterReason')}
                                        </Button>
                                        <Button
                                            variant="filled"
                                            style={{background: theme.colors.gray[5]}}
                                            onClick={rejectHandlers.close}
                                        >
                                            {t('common:cancel')}
                                        </Button>
                                    </Group>
                                </>
                            ) : (
                                <>
                                    <Text>{t('order:reportRejectReason')}:</Text>
                                    <TextInput
                                        placeholder={t('order:rejectReason')}
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                    />
                                    <Group mt="md" spacing="md">
                                        <Button
                                            variant="filled"
                                            style={{background: theme.colors.red[5]}}
                                            onClick={handleSubmitRejection}
                                        >
                                            {t('common:send')}
                                        </Button>
                                        <Button
                                            variant="filled"
                                            style={{background: theme.colors.gray[5]}}
                                            onClick={() => {
                                                setIsRejectedReasonVisible(false);
                                                rejectHandlers.close();
                                                setRejectionReason("");
                                            }}
                                        >
                                            {t('common:cancel')}
                                        </Button>
                                    </Group>
                                </>
                            )}
                        </Modal>

                        {/* Botões de Ação */}
                        {orderDetails?.status === 'PAID' && (
                            <Grid.Col span={12}>
                                <Title order={4}>{t('order:acceptAndShipOrderQuestion')}</Title>
                                <Grid mt="md">
                                    <Grid.Col span={6}>
                                        <Button
                                            variant="filled"
                                            fullWidth
                                            style={{background: theme.colors.green[5]}}
                                            onClick={acceptHandlers.open}
                                        >
                                            {t('order:acceptOrder')}
                                        </Button>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Button
                                            variant="filled"
                                            fullWidth
                                            style={{background: theme.colors.red[5]}}
                                            onClick={rejectHandlers.open}
                                        >
                                            {t('order:rejectOrder')}
                                        </Button>
                                    </Grid.Col>
                                </Grid>
                            </Grid.Col>
                        )}

                    </Grid>
                )}
            </Card>
            <Button
                style={{background: theme.colors.yellow[9]}}
                onClick={() => navigate(-1)}
                type="button"
                mt="md"
            >
                {t('common:back')}
            </Button>
        </Container>
    );
};

export default OrderDetails;