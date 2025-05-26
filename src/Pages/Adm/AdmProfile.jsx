import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import { Container, Title, Text, Loader, Alert, Button, Grid, Card, Group, Divider } from '@mantine/core';
import { API_URL } from "../../hooks/api.jsx";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/URLS.jsx";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";

const AdmProfile = () => {

    const { login, userToken } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
                <Title order={2} align="center" style={{ marginBottom: 20 }}>Perfil Administrador</Title>
                <Divider my="sm" />
                <Grid gutter="md">
                    <Grid.Col span={6}><Text><strong>Nome:</strong> {userData?.personDTO.firstName} {userData?.personDTO.lastName}</Text></Grid.Col>
                    <Grid.Col span={6}><Text><strong>Email:</strong> {userData?.email}</Text></Grid.Col>
                    <Grid.Col span={6}><Text><strong>Cargo:</strong> {userData?.role}</Text></Grid.Col>
                    {/*<Grid.Col span={6}><Text><strong>Data de Nascimento:</strong> {userData?.personDTO.birthDate}</Text></Grid.Col>*/}
                    {/*<Grid.Col span={6}><Text><strong>Sexo:</strong> {userData?.personDTO.gender}</Text></Grid.Col>*/}
                    {/*<Grid.Col span={12}><Text><strong>Telefone:</strong> {userData?.personDTO.phoneType}: {userData?.personDTO.phoneNumber}</Text></Grid.Col>*/}
                </Grid>
                <Divider my="sm" />
                <Group position="center" mt="md">
                    <Button variant="filled" color="cyan" radius="md" onClick={() => changePage(ROUTES.ADM_ORDER_LIST)}>Pedidos</Button>
                </Group>
            </Card>
        </Container>
    );
};

export default AdmProfile;