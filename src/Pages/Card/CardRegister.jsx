import React, {useContext} from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Container, Grid, Paper, Select, TextInput, Title, useMantineTheme } from "@mantine/core";
import { DatePicker } from '@mantine/dates';
import { useForm } from "@mantine/form";
import axios from 'axios';
import { ROUTES } from "../../routes/URLS.jsx";
import { API_URL } from "../../hooks/api.jsx";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";

const CardRegister = () => {

    const { login, userToken } = useContext(AuthContext);

    const navigate = useNavigate();
    const theme = useMantineTheme();

    const form = useForm({
        initialValues: {
            number: '',
            holder: '',
            expirationDate: null,  // Inicializado como null para o DatePicker
            security: '',
            holderCpf: '',
            preferencial: false,
            flag: 'VISA',
            alias: ''
        },
        validate: {
            number: (value) => (value.trim() ? null : 'Número do cartão não pode ser nulo'),
            holder: (value) => (value.trim() ? null : 'Titular do cartão não pode ser nulo'),
            expirationDate: (value) => (value ? null : 'Data de validade não pode ser nula'),
            security: (value) => (value.trim() ? null : 'Código de segurança não pode ser nulo'),
            holderCpf: (value) => (value.trim() ? null : 'CPF do titular não pode ser nulo'),
            flag: (value) => (value.trim() ? null : 'Bandeira do cartão não pode ser nula'),
        }
    });

    const handleSubmit = async (values) => {

        if (userToken) {
            try {
                const formattedValues = {
                    ...values,
                    expirationDate: values.expirationDate ? `${values.expirationDate.toISOString().split('T')[0]}T00:00:00` : null,
                };

                await axios.post(`${API_URL}/card/create`, formattedValues,
                    {headers: {'Authorization': `Bearer ${userToken}`}}, );
                navigate(ROUTES.CARD_LIST);
            } catch (error) {
                console.error('Erro ao cadastrar o cartão!', error);
            }
        } else {
            console.error('Usuário não encontrado!');
        }
    }

    const getTranslation = (key) => {
        const translations = {
            EN: {
                visa: 'Visa',
                mastercard: 'MasterCard',
            },
            PT: {
                visa: 'VISA',
                mastercard: 'MasterCard',
            },
        };
        const currentLanguage = 'PT'; // Definir como variável global ao refatorar o front

        return translations[currentLanguage][key];
    };

    const flagOptions = [
        { value: 'VISA', label: getTranslation('visa') },
        { value: 'MASTERCARD', label: getTranslation('mastercard') }
    ];

    return (
        <Container>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Title order={2} align="center" mb="lg">
                    Cadastrar Cartão
                </Title>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Grid>
                        <Grid.Col span={6}>
                            <TextInput
                                withAsterisk
                                label="Número do Cartão"
                                placeholder="1234 5678 9012 3456"
                                {...form.getInputProps('number')}
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <TextInput
                                withAsterisk
                                label="Titular"
                                placeholder="Nome do titular"
                                {...form.getInputProps('holder')}
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <DatePicker
                                label="Data de Validade"
                                placeholder="Escolha a data"
                                {...form.getInputProps('expirationDate')}
                                mb="md"
                                locale="pt-BR"
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <TextInput
                                withAsterisk
                                label="Código de Segurança"
                                placeholder="123"
                                {...form.getInputProps('security')}
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <TextInput
                                withAsterisk
                                label="CPF do Titular"
                                placeholder="123.456.789-00"
                                {...form.getInputProps('holderCpf')}
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <Select
                                label="Bandeira"
                                {...form.getInputProps('flag')}
                                data={flagOptions}
                            />
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <TextInput
                                label="Apelido"
                                placeholder="Meu Cartão"
                                {...form.getInputProps('alias')}
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <Button type="submit" mt="md">Salvar</Button>
                            <Button
                                style={{ background: theme.colors.yellow[9] }}
                                onClick={() => navigate(ROUTES.CARD_LIST)}
                                type="button"
                                mt="md"
                                ml="md"
                            >
                                Voltar
                            </Button>
                        </Grid.Col>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default CardRegister;
