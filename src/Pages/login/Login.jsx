import React, {useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {Anchor, Text, Button, Container, Group, TextInput, Title, Paper, Alert} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useClientLogin} from "../../hooks/client/useClientLogin.jsx";
import classes from './login.module.css';
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";
import {useTranslation} from "react-i18next";
import {IconInfoCircle} from "@tabler/icons-react";

const Login = () => {
    const {login, userToken} = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState(null);
    const {mutate, isError, error} = useClientLogin();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation(['common', 'login']);
    const [notificationError, setNotificationError] = useState(false);
    const icon = <IconInfoCircle/>;

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: ''
        },
        validate: {
            password: (value) => (value.length > 3 ? null : 'Invalid password'),
        },
    });

    useEffect(() => {
        if (userToken) {
            navigate('/profile');
        }
    }, [userToken]);

    const handleSubmit = (values) => {
        mutate(values, {
            onSuccess: (data) => {
                login(data.token, data.role); // Armazena o token no contexto

            },
            onError: (error) => {
                setNotificationError(true);
                // console.error('Error during mutation:', error);
                setErrorMessage(error.response?.data?.message || 'Ocorreu um erro durante a requisição.');
            }
        });
    };

    const handleCloseNotificationError = () => {
        setNotificationError(false);
    }

    return (
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                {t('login:welcome_back')}
            </Title>

            <Text c="dimmed" size="sm" ta="center" mt={5}>
                {t('login:no_account_question')}
                <Anchor size="sm" href='/register'>
                    {t('login:create_account')}
                </Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">

                {notificationError &&(
                    <Alert variant="filled" color="red" withCloseButton title={t('login:loginError')} icon={icon}
                           onClose={handleCloseNotificationError}>
                    </Alert>
                )}
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        withAsterisk
                        label={t('common:email')}
                        placeholder={t('common:your_email')}
                        key={form.key('email')}
                        {...form.getInputProps('email')}
                    />

                    <TextInput
                        withAsterisk
                        label={t("login:password")}
                        placeholder={t("login:password")}
                        type="password"
                        key={form.key('password')}
                        {...form.getInputProps('password')}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button type="submit">{t("common:submit")}</Button>
                    </Group>

                    <Anchor component="button" size="sm">
                        {t("login:password_forgot")}
                    </Anchor>
                </form>
            </Paper>

            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </Container>
    );
}

export default Login;