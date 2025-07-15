import React, {useContext, useEffect, useState} from "react";
import {Container, Grid, Paper, Title, TextInput, NumberInput, Select, Button, Group} from "@mantine/core";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "@mantine/form";
import {useTranslation} from "react-i18next";
import {DateInput} from "@mantine/dates";
import {ROUTES} from "../../routes/URLS.jsx";
import axios from "axios";
import {API_URL} from "../../hooks/api.jsx";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";

const ProductCreate = () => {
    const navigate = useNavigate();
    const {t, i18n} = useTranslation(['common', 'product']);
    const {login, userToken} = useContext(AuthContext);
    const {productID} = useParams();
    const [productDetails, setProductDetails] = useState(null);

    const form = useForm({
        initialValues: {
            id: '',
            product_name: '',
            product_description: '',
            product_price: 0,
            productCategory: '',
            stock: 0,
            currencyId: 1,
        },
        validate: {
            product_name: (value) => value.length > 1 ? null : 'Invalid name',
            product_price: (value) => value > 0 ? null : 'Invalid price',
            productCategory: (value) => value ? null : 'Invalid category',
            stock: (value) => value >= 0 ? null : 'Invalid stock',
        }
    });


    useEffect(() => {
        if (productID) {
            getProductDetails();
        }
    }, [productID]);

    const getProductDetails = async () => {
        try {
            const response = await axios(`${API_URL}/product/read/${productID}`);
            const data = response.data;

            setProductDetails(data);
            form.setValues({
                id: data.id,
                product_name: data.product_name,
                product_description: data.product_description,
                product_price: data.product_price,
                productCategory: data.productCategory,
                stock: data.stock,
                currencyId: data.currency.id,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = (values) => {
        editProduct(values)
        // navigate(ROUTES.PRODUCT_LIST);  // Ajuste a rota de destino conforme seu projeto
    };

    const editProduct = async (values) => {

        try {
            const response = await axios.put(`${API_URL}/product/update/${productID}`, values,
                {headers: {'Authorization': `Bearer ${userToken}`}});

            navigate(ROUTES.ADM_PRODUCT_LIST);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container size="lg">
            <Grid justify="center">
                <Grid.Col span={12}>
                    <Paper
                        withBorder
                        shadow="md"
                        p={30}
                        mt={30}
                        radius="md"
                        style={{maxWidth: '600px', margin: 'auto'}}
                    >
                        <Title order={2} align="center" mb="lg">
                            {t('product:productManagement')}
                        </Title>

                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <TextInput
                                withAsterisk
                                label={t('product:name')}
                                {...form.getInputProps('product_name')}
                                mb="md"
                            />

                            <TextInput
                                label={t('product:description')}
                                {...form.getInputProps('product_description')}
                                mb="md"
                            />

                            <NumberInput
                                withAsterisk
                                label={t('product:price')}
                                precision={2}
                                min={0}
                                {...form.getInputProps('product_price')}
                                mb="md"
                            />

                            <Select
                                withAsterisk
                                label={t('product:category')}
                                data={[
                                    {value: 'CATEGORY1', label: t('product:CATEGORY1')},
                                    {value: 'CATEGORY2', label: t('product:CATEGORY2')},
                                    {value: 'CATEGORY3', label: t('product:CATEGORY3')},
                                ]}
                                {...form.getInputProps('productCategory')}
                                mb="md"
                            />

                            {/*<NumberInput*/}
                            {/*    withAsterisk*/}
                            {/*    label={t('product:stock')}*/}
                            {/*    min={0}*/}
                            {/*    {...form.getInputProps('stock')}*/}
                            {/*    mb="md"*/}
                            {/*/>*/}

                            <Group position="center" mt="md">
                                <Button fullWidth size="md" type="submit">
                                    {t('common:submit')}
                                </Button>
                            </Group>
                        </form>
                        <Button color="orange" onClick={() => navigate(ROUTES.ADM_PROFILE)}
                                type="button"
                                mt="md">{t('common:back')}</Button>
                    </Paper>

                </Grid.Col>
            </Grid>


        </Container>
    );
};

export default ProductCreate;
