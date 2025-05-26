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

const OrderDetails = () => {
    const [itemsOpen, setItemsOpen] = useState(false);
    const {login, userToken, userRole} = useContext(AuthContext);

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
        console.log("UserRole: ", userRole);

        axios.get(`${API_URL}/order/details/${id}`, {
            headers: {'Authorization': `Bearer ${userToken}`}
        }).then(res => {
            setOrderDetails(res.data);
            console.log(res.data);
        });
    }, [id, userToken, userRole]);

    const handleOrderAcceptance = () => {

        // alert("Pedido aceito");

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
                <Title order={2}>Detalhes do Pedido</Title>
                <Divider my="sm"/>

                {/* Informações do Cliente */}
                <Title order={4}>Cliente</Title>
                <Text>
                    {orderDetails?.person.firstName} {orderDetails?.person.lastName} ({orderDetails?.person.gender})
                </Text>
                <Text>Data de Nascimento: {orderDetails?.person.birthDate}</Text>
                <Text>Telefone: {orderDetails?.person.phoneNumber} ({orderDetails?.person.phoneType})</Text>

                <Divider my="sm"/>

                {/* Endereço de Cobrança */}
                <Title order={4}>Endereço de Cobrança</Title>
                <Text>
                    {orderDetails?.billingAddress.street}, {orderDetails?.billingAddress.number} - {orderDetails?.billingAddress.district}
                </Text>
                <Text>
                    {orderDetails?.billingAddress.city} - {orderDetails?.billingAddress.state}, {orderDetails?.billingAddress.zipCode}
                </Text>
                <Text>País: {orderDetails?.billingAddress.country}</Text>

                <Divider my="sm"/>

                {/* Endereço de Entrega */}
                <Title order={4}>Endereço de Entrega</Title>
                <Text>
                    {orderDetails?.shippingAddress.street}, {orderDetails?.shippingAddress.number} - {orderDetails?.shippingAddress.district}
                </Text>
                <Text>
                    {orderDetails?.shippingAddress.city} - {orderDetails?.shippingAddress.state}, {orderDetails?.shippingAddress.zipCode}
                </Text>
                <Text>País: {orderDetails?.shippingAddress.country}</Text>

                <Divider my="sm"/>

                {/* Itens do Pedido */}
                <Title order={4}>Itens do Pedido</Title>
                <Button onClick={() => setItemsOpen((prev) => !prev)}>
                    {itemsOpen ? 'Ocultar Itens' : 'Mostrar Itens'}
                </Button>
                <Collapse in={itemsOpen}>
                    {orderDetails?.orderItemsDTO.map((item, index) => (
                        <Card key={index} shadow="xs" padding="sm" mt="sm">
                            <Text>Produto: {item.product.product_name}</Text>
                            <Text>Descrição: {item.product.product_description}</Text>
                            <Text>Categoria: {item.product.productCategory}</Text>
                            <Text>Preço: R$ {item.product.product_price.toFixed(2)}</Text>
                            <Text>Quantidade: {item.quantity}</Text>
                        </Card>
                    ))}
                </Collapse>

                <Divider my="sm"/>

                {/* Pagamento */}
                <Title order={4}>Pagamento</Title>
                {orderDetails?.status === 'WAITING_FOR_PAYMENT'
                    ? <Button onClick={() => navigate(`/order/${id}/payment`)} type="button">
                        Ir para pagamento
                    </Button>
                    : ''
                }
                <Text>Total: R$ {orderDetails?.cart.toFixed(2)}</Text>
                <Group>
                    <Text>Método: {orderDetails?.paymentMethods[0]?.type}</Text>
                    <Badge color={orderDetails?.status === 'PAID' ? 'green' : 'red'}>
                        {orderDetails?.status}
                    </Badge>
                </Group>
                <Divider my="sm"/>
                {orderDetails?.status === 'CANCELED' && (
                    <Group>
                        <Divider my="sm"/>

                        <Grid>
                            <Grid.Col span={12}>
                                <Title order={3} style={{color: theme.colors.red[5]}}
                                >Pedido cancelado veja o motivo abaixo!</Title>
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
                            Deseja aceitar o pedido e enviá-lo para entrega?
                            <Group mt="md" spacing="md">
                                <Button
                                    variant="filled"
                                    style={{background: theme.colors.green[5]}}
                                    onClick={handleOrderAcceptance}
                                >
                                    Aceitar
                                </Button>
                                <Button
                                    variant="filled"
                                    style={{background: theme.colors.gray[5]}}
                                    onClick={acceptHandlers.close}
                                >
                                    Cancelar
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
                            title="Analisando Pedido"
                        >
                            {!isRejectedReasonVisible ? (
                                <>
                                    Deseja recusar o pedido?
                                    <Group mt="md" spacing="md">
                                        <Button
                                            variant="filled"
                                            style={{background: theme.colors.red[5]}}
                                            onClick={handleRejectClick}
                                        >
                                            Adicionar Motivo
                                        </Button>
                                        <Button
                                            variant="filled"
                                            style={{background: theme.colors.gray[5]}}
                                            onClick={rejectHandlers.close}
                                        >
                                            Cancelar
                                        </Button>
                                    </Group>
                                </>
                            ) : (
                                <>
                                    <Text>Informe o motivo da recusa:</Text>
                                    <TextInput
                                        placeholder="Motivo da recusa"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                    />
                                    <Group mt="md" spacing="md">
                                        <Button
                                            variant="filled"
                                            style={{background: theme.colors.red[5]}}
                                            onClick={handleSubmitRejection}
                                        >
                                            Enviar
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
                                            Cancelar
                                        </Button>
                                    </Group>
                                </>
                            )}
                        </Modal>

                        {/* Botões de Ação */}
                        {orderDetails?.status === 'PAID' && (
                            <Grid.Col span={12}>
                                <Title order={4}>Aceitar pedido e enviar?</Title>
                                <Grid mt="md">
                                    <Grid.Col span={6}>
                                        <Button
                                            variant="filled"
                                            fullWidth
                                            style={{background: theme.colors.green[5]}}
                                            onClick={acceptHandlers.open}
                                        >
                                            Aceitar Pedido
                                        </Button>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Button
                                            variant="filled"
                                            fullWidth
                                            style={{background: theme.colors.red[5]}}
                                            onClick={rejectHandlers.open}
                                        >
                                            Recusar Pedido
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
                Voltar
            </Button>
        </Container>
    );
};

export default OrderDetails;