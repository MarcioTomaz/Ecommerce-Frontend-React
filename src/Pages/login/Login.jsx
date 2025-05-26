import React, {useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {Anchor, Text, Button, Container, Group, TextInput, Title, Paper} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useClientLogin} from "../../hooks/client/useClientLogin.jsx";
import classes from './login.module.css';
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";
import {ROUTES} from "../../routes/URLS.jsx";

const Login = () => {
    const {login, userToken} = useContext(AuthContext);
    const {userRole, setUserRole} = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState(null);
    const {mutate, isError, error} = useClientLogin();
    const navigate = useNavigate();

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
                console.error('Error during mutation:', error);
                setErrorMessage(error.response?.data?.message || 'Ocorreu um erro durante a requisição.');
            }
        });
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                Welcome back!
            </Title>

            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Do not have an account yet?{' '}
                <Anchor size="sm" href='/register'>
                    Create account
                </Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        withAsterisk
                        label="Email"
                        placeholder="your@email.com"
                        key={form.key('email')}
                        {...form.getInputProps('email')}
                    />

                    <TextInput
                        withAsterisk
                        label="Password"
                        placeholder="password"
                        type="password"
                        key={form.key('password')}
                        {...form.getInputProps('password')}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>

                    <Anchor component="button" size="sm">
                        Forgot password?
                    </Anchor>
                </form>
            </Paper>

            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </Container>
    );
}

export default Login;