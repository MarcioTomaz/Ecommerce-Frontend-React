import {Container, Grid, Paper, Title, Text, Textarea, Button, NumberInput, useMantineTheme} from "@mantine/core";
import React, {useContext, useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../hooks/api.jsx";
import { ROUTES } from "../../routes/URLS.jsx";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";

const ProductDetail = () => {

    const { login, userToken } = useContext(AuthContext);

    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const theme = useMantineTheme();


    useEffect(() => {
        axios
            .get(`${API_URL}${ROUTES.PRODUCT_READ_ID}/${id}`)
            .then((response) => {
                setProductData(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                setError(error);
                setIsLoading(false);
            });
    }, [id]);

    const addToCart = (idItem, quantityItem, productName, productPrice) => {
        const cartStorage = localStorage.getItem("cartItem");
        let cartData = cartStorage ? JSON.parse(cartStorage) : [];

        const existingItemCart = cartData.findIndex(item => item.product.id === idItem);

        if(existingItemCart !== -1) {
            cartData[existingItemCart].quantity += quantityItem;
        }else{
            cartData.push({
                product: { id: idItem, name: productName, price: productPrice  },
                quantity: quantityItem
            });
        }
        // Salva no localStorage
        localStorage.setItem("cartItem", JSON.stringify(cartData));

        console.log("Carrinho atualizado:", cartData);

        navigate("/cart");
    };

    return (
        <Container size="lg">
            <Paper padding="md">
                <Grid>
                    <Grid.Col span={12}>
                        <Title order={2}>{productData?.product_name}</Title>
                        <Text>Detalhes do Produto</Text>
                    </Grid.Col>

                    <Grid.Col
                        span={6}
                        style={{
                            border: "2px solid blue",
                            borderRadius: "8px",
                            padding: "20px",
                            height: "100%",
                        }}
                    >
                        Imagem do produto
                    </Grid.Col>

                    <Grid.Col
                        span={6}
                        style={{
                            border: "2px solid red",
                            borderRadius: "8px",
                            padding: "20px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            height: "100%",
                        }}
                    >
                        <Text>Informações</Text>
                        <Text>Id Produto: {productData?.id}</Text>
                        <Text>Nome: {productData?.product_name}</Text>
                        <Text>
                            Preço: {productData?.currency?.symbol} {productData?.product_price}
                        </Text>
                        <Text>Estoque: {productData?.stock}</Text>
                        <Text>Categoria: {productData?.productCategory}</Text>
                        <Textarea value={productData?.product_description} readOnly />
                        <NumberInput
                            label="Quantidade"
                            min={1}
                            max={productData?.stock || 1}
                            value={quantity}
                            onChange={setQuantity}
                        />
                        <Button
                            onClick={() => addToCart(productData?.id, quantity,
                                productData?.product_name,
                                productData?.product_price,)}
                            variant="filled"
                            color="yellow"
                            size="lg"
                            radius="lg"
                        >
                            Comprar
                        </Button>
                    </Grid.Col>
                </Grid>
                <Button style={{background: theme.colors.yellow[9]}} onClick={() => navigate('/profile')} type="button"
                        mt="md">Voltar</Button>
            </Paper>
        </Container>
    );
};

export default ProductDetail;
