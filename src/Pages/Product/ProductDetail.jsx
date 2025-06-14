import {Container, Grid, Paper, Title, Text, Textarea, Button, NumberInput, useMantineTheme} from "@mantine/core";
import React, {useContext, useEffect, useState, startTransition} from "react"; // <--- Importe startTransition
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../hooks/api.jsx";
import { ROUTES } from "../../routes/URLS.jsx";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";
import {useTranslation} from "react-i18next";

const ProductDetail = () => {

    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const theme = useMantineTheme();
    const { t, i18n } = useTranslation(['common', 'product']);

    useEffect(() => {
        fetchProductDetails();
    },[])

    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}${ROUTES.PRODUCT_READ_ID}/${id}`);
            setProductData(response.data);
            setIsLoading(false);


        }catch (error) {
            setError(error);
        }
    }


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

        startTransition(() => {
            navigate(ROUTES.CART_DETAILS);
        });
    };

    const handleGoBackToList = () => {

        startTransition(() => {
            navigate(ROUTES.PRODUCT_LIST);
        });
    };

    return (
        <Container size="lg">
            <Paper padding="md">
                <Grid>
                    <Grid.Col span={12}>
                        <Title order={2}>{productData?.product_name}</Title>
                        <Text>{t('product:productDetails')}</Text>
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
                        <Text>{t('common:infos')}</Text>
                        <Text>{t('product:productId')}: {productData?.id}</Text>
                        <Text>{t('common:name')}: {productData?.product_name}</Text>
                        <Text>
                            {t('product:Price')}: {productData?.currency?.symbol} {productData?.product_price}
                        </Text>
                        <Text>{t('product:stock')}: {productData?.stock}</Text>
                        <Text>{t('product:Category')}: {t(`product:${productData?.productCategory}`)}</Text>
                        <Textarea value={productData?.product_description} readOnly />
                        <NumberInput
                            label={t('product:Quantity')}
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
                            disabled = {productData?.stock === 0}
                        >
                            {productData?.stock !== 0 ?  t('product:purchase') : t('product:outOfStock')}
                        </Button>

                    </Grid.Col>
                </Grid>
                <Button style={{background: theme.colors.yellow[9]}} onClick={handleGoBackToList} type="button"
                        mt="md">{t('common:back')}</Button>
            </Paper>
        </Container>
    );
};

export default ProductDetail;