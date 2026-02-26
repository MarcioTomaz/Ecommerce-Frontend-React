import React, {useContext, useEffect, useState} from "react";
import {Container, Grid, Paper, Title, TextInput, NumberInput, Select, Button, Group, Image, FileInput} from "@mantine/core";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "@mantine/form";
import {useTranslation} from "react-i18next";
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

    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");
    const buildImageUrl = (imagePath) => {
        if (!imagePath || typeof imagePath !== 'string' || !imagePath.trim()) return null;
        return `${API_ORIGIN}/uploads/${imagePath.trim()}`;
    };

    useEffect(() => {
        if (!imageFile) {
            setImagePreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(imageFile);
        setImagePreviewUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [imageFile]);

    const form = useForm({
        initialValues: {
            id: '',
            image_path: '',
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
                image_path: data.image_path,
                product_name: data.product_name,
                product_description: data.product_description,
                product_price: data.product_price,
                productCategory: data.productCategory,
                stock: data.stock,
                currencyId: data.currency.id,
            });

            setImageFile(null); // garante que ao carregar produto, mostra a imagem salva (não a prévia)
        } catch (error) {
            console.log(error);
        }
    };

    const uploadNewImageIfNeeded = async (productId) => {
        if (!imageFile) return null;

        const fd = new FormData();
        fd.append("file", imageFile);

        const res = await axios.post(
            `${API_URL}/product/${productId}/image`,
            fd,
            {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return res.data?.image_path ?? res.data ?? null;
    };

    const handleSubmit = async (values) => {
        try {
            const newImagePath = await uploadNewImageIfNeeded(values.id);

            const payload = {
                ...values,
                image_path: newImagePath ?? values.image_path,
            };

            await axios.put(`${API_URL}/product/update`, payload,
                {headers: {'Authorization': `Bearer ${userToken}`}});

            navigate(ROUTES.ADM_PRODUCT_LIST);
        } catch (error) {
            console.log(error);
        }
    };

    const currentImageSrc = imagePreviewUrl ?? buildImageUrl(form.values.image_path);

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

                            {currentImageSrc ? (
                                <Image
                                    src={currentImageSrc}
                                    alt={form.values.product_name}
                                    h={180}
                                    mb="md"
                                    fit="contain"
                                    bg="dark.6"
                                />
                            ) : null}

                            <FileInput
                                label="Nova imagem (opcional)"
                                placeholder="Selecione um arquivo"
                                accept="image/*"
                                value={imageFile}
                                onChange={setImageFile}
                                mb="md"
                                clearable
                            />

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

                            <NumberInput
                                withAsterisk
                                label={t('product:stock')}
                                min={0}
                                {...form.getInputProps('stock')}
                                mb="md"
                            />

                            <Group position="center" mt="md">
                                <Button fullWidth size="md" type="submit">
                                    {t('common:submit')}
                                </Button>
                            </Group>
                        </form>

                        <Button color="orange" onClick={() => navigate(ROUTES.ADM_PRODUCT_LIST)}
                                type="button"
                                mt="md">{t('common:back')}</Button>
                    </Paper>

                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default ProductCreate;