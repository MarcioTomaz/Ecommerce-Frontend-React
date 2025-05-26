import React from 'react';
import classes from './address.module.css';
import {useNavigate} from "react-router-dom";
import {Button, Container, Grid, Group, Paper, Select, TextInput, Title, useMantineTheme} from "@mantine/core";
import {addressMutate} from "../../hooks/address/addressMutate.jsx";
import {useForm} from "@mantine/form";
import {ROUTES} from "../../routes/URLS.jsx";

const AddressRegister = () => {

    const navigate = useNavigate();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            street: '',
            residencyType: 'CASA',
            observation: '',
            number: '',
            district: '',
            zipCode: '',
            logradouro: '',
            city: '',
            country: '',
            state: '',
            addressType: 'ENTREGA'
        },
        validate: {
            street: (value) => (value.trim() ? null : 'Rua não pode ser nula'),
            residencyType: (value) => (value.trim() ? null : 'Tipo de Residência não pode ser nulo'),
            number: (value) => (value.trim() ? null : 'Número não pode ser nulo'),
            district: (value) => (value.trim() ? null : 'Bairro não pode ser nulo'),
            zipCode: (value) => (value.trim() ? null : 'CEP não pode ser nulo'),
            logradouro: (value) => (value.trim() ? null : 'Logradouro não pode ser nulo'),
            city: (value) => (value.trim() ? null : 'Cidade não pode ser nula'),
            country: (value) => (value.trim() ? null : 'País não pode ser nulo'),
            state: (value) => (value.trim() ? null : 'Estado não pode ser nulo'),
            addressType: (value) => (value.trim() ? null : 'Tipo de Endereço não pode ser nulo')
        }
    });

    const {mutate} = addressMutate();
    const theme = useMantineTheme();

    const handleSubmit = (values) => {
        mutate(values);
        navigate(ROUTES.ADDRESS_LIST);
    }

    const getTranslation = (key) => {
        const translations = {
            EN: {
                delivery: 'Delivery',
                billing: 'Billing',
                house: 'House',
                apartment: 'Apartment',
            },
            PT: {
                delivery: 'Entrega',
                billing: 'Cobrança',
                house: 'Casa',
                apartment: 'Apartamento',
            },
        };
        const currentLanguage = 'PT'; // Definir como variável global ao refatorar o front

        return translations[currentLanguage][key];
    };

    const residencyTypeOptions = [
        {value: 'CASA', label: getTranslation('house')},
        {value: 'APARTAMENTO', label: getTranslation('apartment')}
    ];

    const addressTypeOptions = [
        {value: 'ENTREGA', label: getTranslation('delivery')},
        {value: 'COBRANCA', label: getTranslation('billing')}
    ];

    return (
        <Container>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Title order={2} align="center" mb="lg">
                    Register
                </Title>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Grid>
                        <Grid.Col span={4}>
                            <TextInput
                                withAsterisk
                                label="Street"
                                placeholder="street..."
                                {...form.getInputProps('street')}
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={4}>
                            <Select
                                label="Tipo de Residência"
                                {...form.getInputProps('residencyType')}
                                data={residencyTypeOptions}
                            />
                        </Grid.Col>

                        <Grid.Col span={4}>

                            <TextInput
                                withAsterisk
                                label="number"
                                placeholder="number..."
                                {...form.getInputProps('number')}
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={4}>

                            <TextInput
                                withAsterisk
                                label="district"
                                placeholder="district..."
                                {...form.getInputProps('district')}
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={4}>
                            <TextInput
                                withAsterisk
                                label="zipCode"
                                placeholder="zipCode..."
                                {...form.getInputProps('zipCode')}
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={4}>
                            <TextInput
                                withAsterisk
                                label="logradouro"
                                placeholder="logradouro..."
                                {...form.getInputProps('logradouro')}
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={4}>
                            <TextInput
                                withAsterisk
                                label="city"
                                placeholder="city..."
                                {...form.getInputProps('city')}
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={4}>
                            <TextInput
                                withAsterisk
                                label="country"
                                placeholder="country..."
                                {...form.getInputProps('country')}
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={4}>
                            <TextInput
                                withAsterisk
                                label="state"
                                placeholder="state..."
                                {...form.getInputProps('state')}
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid.Col span={4}>
                            <Select
                                label="Tipo de Endereço"
                                {...form.getInputProps('addressType')}
                                data={addressTypeOptions}
                            />
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <TextInput
                                withAsterisk
                                label="observation"
                                placeholder="observation..."
                                {...form.getInputProps('observation')}
                                mb="md"
                            />
                        </Grid.Col>

                        <Grid>
                            <Grid.Col span={6}>
                                <Button type="submit" mt="md">Salvar</Button>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Button
                                    style={{background: theme.colors.yellow[9]}}
                                    onClick={() => navigate(ROUTES.ADDRESS_LIST)}
                                    type="button"
                                    mt="md"
                                >
                                    Voltar
                                </Button>
                            </Grid.Col>
                        </Grid>
                    </Grid>
                </form>
            </Paper>


        </Container>
    )

}

export default AddressRegister;