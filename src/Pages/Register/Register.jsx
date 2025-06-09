import React from "react";
import { Button, Group, TextInput, Paper, Container, Title, Grid } from "@mantine/core";
import { IMaskInput } from 'react-imask';
import { useClientMutate } from "../../hooks/client/useClientMutate.jsx";
import { DateInput } from "@mantine/dates";
import { useNavigate } from 'react-router-dom';
import { useForm } from "@mantine/form";
import { ROUTES } from "../../routes/URLS.jsx";
import {useTranslation} from "react-i18next";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation(['common', 'registerPage']);

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: '',
            password: '',
            userType: 'CLIENTE',
            personDTO: {
                firstName: '',
                lastName: '',
                birthDate: null,
                phoneNumber: null,
                phoneType: 'FIXO',
                gender: 'MASCULINO'
            },
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (value.length > 3 ? null : 'Invalid password'),
            personDTO: {
                firstName: (value) =>
                    value.length < 2 ? 'First name must have at least 2 letters' : null,
                lastName: (value) => (value.length > 1 ? null : 'Invalid lastName'),
                birthDate: (value) => (value != null ? null : 'Invalid birthDate'),
                phoneType: value => (value != null ? null : 'Invalid phone type'),
                phoneNumber: value => (value != null ? null : 'Invalid phone number'),
                gender: (value) => (value != null ? null : 'Invalid gender'),
            }
        }
    });

    const { mutate } = useClientMutate();

    const handleSubmit = (values) => {
        mutate(values);
        navigate(ROUTES.HOME);
    };

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
                        style={{ maxWidth: '600px', margin: 'auto' }} // Define uma largura máxima para o formulário
                    >
                        <Title order={2} align="center" mb="lg">
                            {t('registerPage:register')}
                        </Title>

                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <TextInput
                                withAsterisk
                                label={t('common:email')}
                                placeholder={t('common:your_email')}
                                {...form.getInputProps('email')}
                                mb="md"
                            />
                            <TextInput
                                withAsterisk
                                label={t('common:email')}
                                type="email"
                                {...form.getInputProps('password')}
                                mb="md"
                            />
                            <TextInput
                                withAsterisk
                                label={t('registerPage:firstName')}
                                {...form.getInputProps('personDTO.firstName')}
                                mb="md"
                            />
                            <TextInput
                                withAsterisk
                                label={t('registerPage:lastName')}
                                {...form.getInputProps('personDTO.lastName')}
                                mb="md"
                            />
                            <DateInput
                                label={t('registerPage:birthDate')}
                                withAsterisk
                                {...form.getInputProps('personDTO.birthDate')}
                                mb="md"
                            />
                            <TextInput
                                withAsterisk
                                component={IMaskInput}
                                mask="+55 00 000000000"
                                placeholder={t('registerPage:yourPhone')}
                                label={t('registerPage:phoneNumber')}
                                {...form.getInputProps('personDTO.phoneNumber')}
                                mb="md"
                            />
                            <Group position="center" mt="md">
                                <Button fullWidth size="md" type="submit">{t('common:submit')}</Button>
                            </Group>
                        </form>
                    </Paper>
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default RegisterPage;
