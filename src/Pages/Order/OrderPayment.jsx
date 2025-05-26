import {useCallback, useContext, useEffect, useState} from "react";
import {
    Card,
    Container,
    Grid,
    Text,
    Select,
    Checkbox,
    Group,
    Button,
    Image,
    Radio,
    TextInput,
    NumberInput
} from "@mantine/core";
import {useNavigate, useParams} from "react-router-dom";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";
import axios from "axios";
import {API_URL} from "../../hooks/api.jsx";

const PaymentStep = () => {
    const [paymentMethod, setPaymentMethod] = useState("single");
    const [selectedMethods, setSelectedMethods] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [cards, setCards] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [cardValuePayment, setCardValuePayment] = useState(false);
    const [paymentCardAmountMulti, setPaymentCardAmountMulti] = useState(0);

    const [paymentPix, setPaymentPix] = useState(10);
    const [paymentCard, setPaymentCard] = useState(10);
    const navigate = useNavigate();

    const {id} = useParams();
    const {login, userToken} = useContext(AuthContext);

    const handleMethodChange = (value) => {
        if (paymentMethod === "single") {
            setSelectedMethods(value.length > 0 ? [value[value.length - 1]] : []);
        } else {

            setSelectedMethods(value);
        }
    };

    const fetchData = useCallback(async () => {
        if (!id || !userToken) return;

        try {
            const headers = {authorization: `Bearer ${userToken}`};

            const [orderRes, cardRes] = await Promise.all([
                axios.get(`${API_URL}/order/details/summary/${id}`, {headers}),
                axios.get(`${API_URL}/card/read/card`, {headers})
            ]);

            setTotalOrders(orderRes.data.cart);
            setCards(cardRes.data);

            console.log("Cards:", cardRes.data);
        } catch (error) {
            console.log(error);
        }
    }, [id, userToken]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const cardNumber = (number) => {
        const lastNumbers = number.slice(-4);
        const masked = "*".repeat(number.length - 4) + lastNumbers;
        return masked;
    };


    const cardPayment = (id) => {
        console.log("no metodo: ", id);

        setSelectedCard(String(id));
        setCardValuePayment(true);
    }

    const handlePixChange = (valuePix) => {
        const maxPixAvailable = totalOrders - valuePix;
        setPaymentPix(valuePix);
        setPaymentCard(Math.max(10, maxPixAvailable));
    }

    const handleCardChange = (valueCard) => {
        const maxCardAvailable = totalOrders - valueCard;
        setPaymentCard(valueCard);
        setPaymentPix(Math.max(10, maxCardAvailable));
    };

    const handlePayment = () => {

        if (paymentPix < 10) {
            alert("Erro! o valor mínimo precisa ser 10!");
            return;
        }

        if (paymentCard < 10) {
            alert("Erro! o valor mínimo precisa ser 10!");
            return;
        }

        if (paymentMethod === "multiple" && paymentCard + paymentPix < totalOrders) {

            alert("Erro! o valor total dos meio de pagamento precisa ser: " + totalOrders)
            return;
        }

        console.log(paymentMethod)
        console.log(selectedMethods)

        if (paymentMethod === "single" && selectedMethods.includes("credit_card")) {
            const orderPaymentObject = {
                id: id, //orderId
                paymentMethods: [
                    {
                        type: "CREDIT_CARD",
                        amountPaid: totalOrders,
                        transactionId: "CC912345_SINGLE",
                        installments: 1,
                        id: selectedCard
                    }
                ]
            }

            handleSubmitPayment(orderPaymentObject);
        }

        if (paymentMethod === "single" && selectedMethods.includes("pix")) {
            const orderPaymentObject = {
                id: id, //orderId
                paymentMethods: [
                    {
                        type: "PIX",
                        amountPaid: totalOrders,
                        pixKey: "abc123xyz",
                        transactionId: "PX123456_SINGLE",
                    }
                ]
            }

            handleSubmitPayment(orderPaymentObject);
        }

        if (paymentMethod === "multiple") {
            const orderPaymentObject = {
                id: id, //orderId
                paymentMethods: [
                    {
                        type: "CREDIT_CARD",
                        amountPaid: paymentCard,
                        transactionId: "CC987654_MULTIPLE",
                        installments: 1,
                        id: selectedCard
                    },
                    {
                        type: "PIX",
                        amountPaid: paymentPix,
                        pixKey: "abc123xyz",
                        transactionId: "PX123456",
                    }
                ]
            };


            console.log("OBJT PAGAMENTO: ", orderPaymentObject);
            handleSubmitPayment(orderPaymentObject)
        }

    }

    const handleSubmitPayment = (orderPaymentObject) => {
        try {
            axios.post(`${API_URL}/order/${id}/payment`, orderPaymentObject,
                {headers: {authorization: `Bearer ${userToken}`}})
                .then(res => {
                        console.log("Pagamento realizado")
                        navigate(`/order/details/${id}`);
                    }
                )
                .catch(err => console.log(err));

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Container size="md" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Card shadow="sm" padding="lg" style={{width: "100%", maxWidth: 600}}>
                <Grid>
                    <Grid.Col span={12}>
                        <Text size="xl" weight={700} align="center">Pagamento</Text>
                    </Grid.Col>

                    <Grid.Col span={12}>
                        <Card withBorder padding="md">
                            <Text weight={500}>Resumo do Pedido</Text>
                            <Text size="sm">Total a pagar: R$ {totalOrders}</Text>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={12}>
                        <Select
                            label="Escolha o tipo de pagamento"
                            value={paymentMethod}
                            onChange={(value) => {
                                setPaymentMethod(value);
                                setCardValuePayment(false);
                                setSelectedCard(null);
                                setSelectedMethods([]);
                            }}
                            data={[
                                {value: "single", label: "Pagamento único"},
                                {value: "multiple", label: "Mais de um método"},
                            ]}
                        />
                    </Grid.Col>

                    <Grid.Col span={12}>
                        <Checkbox.Group
                            label="Selecione os métodos de pagamento"
                            value={selectedMethods}
                            onChange={handleMethodChange}
                        >
                            <Group mt="xs">
                                <Checkbox
                                    value="credit_card"
                                    label="Cartão de Crédito"
                                    disabled={paymentMethod === "single" && selectedMethods.length > 0 && selectedMethods[0] !== "credit_card"}
                                />
                                <Checkbox
                                    value="pix"
                                    label="PIX"
                                    disabled={paymentMethod === "single" && selectedMethods.length > 0 && selectedMethods[0] !== "pix"}
                                />
                            </Group>
                        </Checkbox.Group>
                    </Grid.Col>

                    {selectedMethods.includes("pix") && (
                        <Grid.Col span={12}>
                            <Card withBorder padding="md">
                                <Text weight={500}>Pagamento via PIX</Text>
                                <Image
                                    src="https://media.istockphoto.com/id/1095468748/pt/vetorial/qr-code-abstract-vector-modern-bar-code-sample-for-smartphone-scanning-isolated-on-white.jpg?s=612x612&w=0&k=20&c=Sr77lnSxfnkUBiPUpk44mHmCdGueNSG0vrvCGcRCol8="
                                    alt="QR Code PIX"
                                    style={{width: '100px', height: '100px'}}
                                    mx="auto"
                                    mt={10}
                                />
                                {paymentMethod === "multiple" &&
                                    <NumberInput
                                        id="valuePix"
                                        allowDecimal={true}
                                        padding="md"
                                        size="md"
                                        radius="xs"
                                        placeholder="Total a pagar"
                                        onChange={handlePixChange}
                                        value={paymentPix}
                                        min={10}
                                        max={totalOrders - paymentCard}
                                    />}

                            </Card>
                        </Grid.Col>
                    )}

                    {selectedMethods.includes("credit_card") && (
                        <Grid.Col span={12}>
                            <Card withBorder padding="md">
                                <Text weight={500}>Pagamento via Cartão de Crédito</Text>
                                <Radio.Group
                                    value={selectedCard}
                                    onChange={(value) => {
                                        cardPayment(value);
                                        // console.log("Selected Card:", value); // Verifique o valor
                                    }}
                                    label="Selecione um cartão"
                                >
                                    <Group mt="xs">
                                        {cards.map((card) => (
                                            <Radio
                                                key={card.id}
                                                value={String(card.id)}  // Convertendo para string
                                                label={`${card.flag} - ${card.holder} - ${cardNumber(card.number)}`}
                                            />
                                        ))}
                                    </Group>
                                </Radio.Group>
                            </Card>
                        </Grid.Col>
                    )}

                    {cardValuePayment && paymentMethod === "single" && (
                        <Grid.Col span={12}>
                            <Card withBorder padding="md">
                                <Text weight={500}>Total a pagar</Text>
                                <Text size="sm">R$ {totalOrders}</Text>
                            </Card>
                        </Grid.Col>
                    )}

                    {cardValuePayment && paymentMethod === "multiple" && (
                        <Grid.Col span={12}>
                            <Card withBorder padding="md">
                                <Text weight={500}>Total a pagar</Text>
                                <NumberInput
                                    id="valueCard"
                                    value={paymentCard}
                                    onChange={handleCardChange}
                                    min={10}
                                    max={totalOrders - paymentPix}
                                />
                            </Card>
                        </Grid.Col>
                    )}

                    <Grid.Col span={12}>
                        <Button
                            onClick={() => {
                                handlePayment()
                            }}
                            fullWidth>Confirmar Pagamento</Button>
                    </Grid.Col>
                </Grid>
            </Card>
        </Container>
    );
};

export default PaymentStep;