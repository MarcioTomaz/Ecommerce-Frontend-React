import {IconHeart} from '@tabler/icons-react';
import {Card, Image, Text, Group, Button, Container, Grid, Select, Pagination} from '@mantine/core';
import classes from './ProductListCSS.module.css';
import React, {useCallback, useContext, useEffect, useState} from "react";
import axios from "axios";
import {API_URL} from "../../hooks/api.jsx";
import {ROUTES} from "../../routes/URLS.jsx";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";
import {useTranslation} from "react-i18next";

const ProductList = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {login, userToken} = useContext(AuthContext);

    const { t, i18n } = useTranslation(['common', 'product']);

    const [productData, setProductData] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(3);
    const [totalPages, setTotalPages] = useState(1);

    //filters
    const [productCategoryFilter, setProductCategoryFilter] = useState(null);

    const navigate = useNavigate();

    const fetchProducts = async (pageNumber, productCategoryFilter) => {
        try {
            const params = {
                page: pageNumber -1,
                size: pageSize,
                ...(productCategoryFilter ? {productCategoryFilter} : {}),
            };

            const response = await axios.get(`${API_URL}${ROUTES.PRODUCT_LIST_STOCK}`,
                {params});

            const {content, totalPages } = response.data;
            setProductData(content);
            setTotalPages(totalPages);

        }catch (error){
            console.log(error);
        }
    }

    useEffect(() => {
        fetchProducts(page, productCategoryFilter);
    }, [page, productCategoryFilter]);

    const handleCategoryChange = (value) => {
        setProductCategoryFilter(value);
        setPage(1);
    }

    const clearFilter = () => {
        setProductCategoryFilter(null);
        setPage(1);
    }

    const navigateProduct = (id) => {
        navigate(ROUTES.PRODUCT_DETAILS.replace(':id', id));
    }

    return (
        <Container>
            <Group>
                <Select
                    label={t('product:filterByCategory')}
                    placeholder={t('product:selectCategory')}
                    data={[
                        {value: 'CATEGORY1', label: t('product:CATEGORY1')},
                        {value: 'CATEGORY2', label: t('product:CATEGORY2')},
                        {value: 'CATEGORY3', label: t('product:CATEGORY3')},
                    ]}
                    value={productCategoryFilter}
                    onChange={handleCategoryChange}
                    clearable
                >
                </Select>
                {productCategoryFilter &&(
                    <Button variant="outline" onClick={clearFilter}>
                        {t('common:clearFilter')}
                    </Button>
                )}
            </Group>
            <Grid gutter="md" justify="center">
                {productData.map((product, index) => {

                    const {id, product_name, productCategory, product_description, product_price, currency, stock} = product;

                    return (
                        <Grid.Col key={index} span={4} sm={6} md={4}>
                            <Card
                                withBorder
                                radius="md"
                                p="md"
                                className={classes.card}
                                style={{
                                    minWidth: 300,
                                    minHeight: 400,
                                    margin: '0 auto'
                                }}  // Define o tamanho mínimo para o card e adiciona margem automática
                            >
                                <Card.Section>
                                    {product.image_path ? (
                                        <Image
                                            src={`http://localhost:8080/uploads/${product.image_path}`}
                                            alt={product_name}
                                            h={180}
                                            fit="contain"
                                            bg="dark.6"
                                            styles={{
                                                root: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
                                                image: { width: '100%' }
                                            }}
                                        />
                                    ) : null}
                                </Card.Section>

                                <Card.Section>
                                    {id}
                                </Card.Section>

                                <Card.Section>
                                    {productCategory}
                                </Card.Section>

                                <Card.Section className={classes.section} mt="md">
                                    <Group position="apart">
                                        <Text fz="lg" fw={500}>
                                            {product_name}
                                        </Text>
                                    </Group>
                                    <Text fz="sm" mt="xs">
                                        {product_description}
                                    </Text>

                                    <Text fz="sm" mt="xs">
                                        {t('product:stock')}:
                                        {stock}
                                    </Text>
                                </Card.Section>

                                <Card.Section className={classes.section}>
                                    <Group gap={30}>
                                        <div>
                                            <Text fz="xl" fw={700} style={{lineHeight: 1}}>
                                                {currency.symbol} {product_price}
                                            </Text>
                                        </div>
                                        <Button onClick={() => navigateProduct(product.id)} radius="xl"
                                                style={{flex: 1}}>
                                            {t('common:details')}
                                        </Button>
                                    </Group>
                                </Card.Section>
                            </Card>
                        </Grid.Col>
                    );
                })}
            </Grid>
            <Pagination
                page={page}
                onChange={setPage}
                total={totalPages}
                position="center"
                mt="md"
            />
        </Container>
    );
}

export default ProductList;
