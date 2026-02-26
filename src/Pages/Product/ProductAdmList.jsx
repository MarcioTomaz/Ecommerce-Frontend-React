import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {Button, Container, Grid, Group, Pagination, Table, Image, Center} from "@mantine/core";
import axios from "axios";
import {API_URL} from "../../hooks/api.jsx";
import {ROUTES} from "../../routes/URLS.jsx";
import {useTranslation} from "react-i18next";

const ProductAdmList = () => {
    const {login, userToken} = useContext(AuthContext);
    const [productData, setProductData] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const {t, i18n} = useTranslation(['common', 'product']);

    const [productCategoryFilter, setProductCategoryFilter] = useState(null);

    const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");
    const buildImageUrl = (imagePath) => {
        if (!imagePath || typeof imagePath !== "string" || !imagePath.trim()) return null;
        return `${API_ORIGIN}/uploads/${imagePath.trim()}`;
    };

    useEffect(() => {
        fetchProducts(page, productCategoryFilter);
    }, [page, productCategoryFilter]);

    const fetchProducts = async (pageNumber, productCategoryFilter) => {
        try {
            const params = {
                page: pageNumber - 1,
                size: pageSize,
                ...(productCategoryFilter ? {productCategoryFilter} : {}),
            }

            const response = await axios.get(`${API_URL}${ROUTES.PRODUCT_LIST_STOCK}`, {params});

            const {content, totalPages} = response.data;
            setProductData(content);
            setTotalPages(totalPages);
        } catch (error) {
            console.log(error);
        }
    }

    const handleCategoryChange = (value) => {
        setProductCategoryFilter(value);
        setPage(1);
    }

    const clearFilter = () => {
        setProductCategoryFilter(null);
        setPage(1);
    }

    const navigateProduct = (id) => {
        navigate(ROUTES.ADM_EDIT_PRODUCT.replace(':productID', id));
    }

    const rows = productData.map((row) => {
        const thumbUrl = buildImageUrl(row.image_path);

        return (
            <Table.Tr key={row.id}>
                <Table.Td>{row.id}</Table.Td>

                <Table.Td>
                    {thumbUrl ? (
                        <Center>
                            <Image
                                src={thumbUrl}
                                alt={row.product_name}
                                w={48}
                                h={48}
                                fit="contain"
                                radius="sm"
                                bg="dark.6"
                            />
                        </Center>
                    ) : null}
                </Table.Td>

                <Table.Td>{row.product_name}</Table.Td>
                <Table.Td>{row.product_price}</Table.Td>
                <Table.Td>{row.stock}</Table.Td>
                <Table.Td>
                    <Button
                        variant="filled"
                        color="cyan"
                        radius="md"
                        onClick={() => navigateProduct(row.id)}
                    >
                        {t('common:edit')}
                    </Button>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <Container>
            <Button onClick={() => navigate(ROUTES.ADM_CREATE_PRODUCT)}>
                {t('product:createNewProduct')}
            </Button>

            <Table miw={700} verticalSpacing="sm">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>{t('common:id')}</Table.Th>
                        <Table.Th>Imagem</Table.Th>
                        <Table.Th>{t('common:name')}</Table.Th>
                        <Table.Th>{t('product:price')}</Table.Th>
                        <Table.Th>{t('product:stock')}</Table.Th>
                        <Table.Th>{t('common:actions')}</Table.Th>
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {rows}
                </Table.Tbody>
            </Table>

            <Pagination
                page={page}
                onChange={setPage}
                total={totalPages}
                position="center"
                mt="md"
            />

            <Button color="orange" onClick={() => navigate(ROUTES.ADM_PROFILE)}
                    type="button"
                    mt="md">{t('common:back')}</Button>
        </Container>
    )
}

export default ProductAdmList;