import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import { Container, Title, Text, Loader, Alert, Button, Grid, Card, Group, Divider } from '@mantine/core';
import { API_URL } from "../../hooks/api.jsx";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/URLS.jsx";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";
import {useTranslation} from "react-i18next";

const AdmProfile = () => {

    const { login, userToken } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t, i18n } = useTranslation(['common', 'admProfile', 'profile']);

    const navigate = useNavigate();

    useEffect(() => {

        axios.get(`${API_URL}/userPerson/readById`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        })
            .then(response => {

                // if(response.data)
                console.log(response.data);
                setUserData(response.data);
                setIsLoading(false);

            })
            .catch(error => {
                setError(error);
                setIsLoading(false);
            });
    }, [userToken]);

    const changePage = (page) => {
        navigate(page);
    }

    if (isLoading) return <Loader size="xl" style={{ display: 'block', margin: 'auto' }} />;

    if (error) return <Alert title="Erro" color="red" style={{ marginTop: 20 }}>Erro ao carregar os dados: {error.message}</Alert>;

    return (
        <Container size="md" style={{ marginTop: 40 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={2} align="center" style={{ marginBottom: 20 }}>{t('admProfile:admProfile')}</Title>
                <Divider my="sm" />
                <Grid gutter="md">
                    <Grid.Col span={6}><Text><strong>{t('common:name')}:</strong> {userData?.personDTO.firstName} {userData?.personDTO.lastName}</Text></Grid.Col>
                    <Grid.Col span={6}><Text><strong>{t('common:email')}:</strong> {userData?.email}</Text></Grid.Col>
                    <Grid.Col span={6}><Text><strong>{t('admProfile:role')}:</strong> {userData?.role}</Text></Grid.Col>
                </Grid>
                <Divider my="sm" />
                <Group position="center" mt="md">
                    <Button variant="filled" color="orange" radius="md" onClick={() => changePage(ROUTES.ADM_ORDER_LIST)}>{t('admProfile:ordersButton')}</Button>
                    <Button variant="filled" color="blue" radius="md" onClick={() => changePage(ROUTES.ADM_PRODUCT_LIST)}>{t('admProfile:productsButton')}</Button>
                    <Button variant="filled" color="cyan" radius="md" onClick={() => changePage(ROUTES.ADM_ORDER_LIST)}>{t('admProfile:statisticsButton')}</Button>

                </Group>
            </Card>
        </Container>
    );
};

export default AdmProfile;