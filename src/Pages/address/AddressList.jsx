import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {Button, Container, Group, Modal, Table, Text, useMantineTheme} from '@mantine/core';
import axios from "axios";
import {API_URL} from "../../hooks/api.jsx";
import {ROUTES} from "../../routes/URLS.jsx";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";


const AddressList = () => {

    const { login, userToken } = useContext(AuthContext);
    const [userData, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [opened, setOpened] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const navigate = useNavigate();
    const theme = useMantineTheme();

    useEffect(() => {
        if (userToken) {
            setIsLoading(true);
            axios.get(`${API_URL}/address/read/addresses`,
                {headers: { 'Authorization': `Bearer ${userToken}` }})
                .then(response => {
                    setUserData(response.data);
                    setIsLoading(false);
                })
                .catch(error => {
                    setError(error);
                    setIsLoading(false);
                });
        }
    }, [userToken]);

    const editAddress = (id) => {
        navigate(ROUTES.ADDRESS_UPDATE_ID + `/${id}`)
    }

    const confirmDeleteAddress = (id) => {
        setSelectedAddressId(id);
        setOpened(true);
    };

    const deleteAddress = () => {
        axios.delete(`${API_URL}/address/delete/${selectedAddressId}`,
            {headers: { 'Authorization': `Bearer ${userToken}` }})
            .then(() => {
                setUserData(userData.filter((address) => address.id !== selectedAddressId));
                setOpened(false);
            })
            .catch(error => {
                setError(error);
                setOpened(false);
            });
    }

    const rows = userData.map((row) => (
        <Table.Tr key={row.id}>
            <Table.Td>{row.id}</Table.Td>
            <Table.Td>{row.street}</Table.Td>
            <Table.Td>{row.residencyType}</Table.Td>
            <Table.Td>{row.number}</Table.Td>
            <Table.Td>{row.district}</Table.Td>
            <Table.Td>{row.zipCode}</Table.Td>
            <Table.Td>{row.city}</Table.Td>
            <Table.Td>{row.addressType}</Table.Td>
            <Table.Td>
                <Button style={{background: theme.colors.blue[9]}} onClick={() => editAddress(row.id)}>Editar</Button>
            </Table.Td>
            <Table.Td>
                <Button style={{background: theme.colors.red[9]}}
                        onClick={() => confirmDeleteAddress(row.id)}>Excluir</Button>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Container>
            <Button onClick={() => navigate(ROUTES.ADDRESS_REGISTER)}>Cadastrar novo endereço</Button>

            <Table miw={700}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Id</Table.Th>
                        <Table.Th>Street</Table.Th>
                        <Table.Th>ResidencyType</Table.Th>
                        <Table.Th>Number</Table.Th>
                        <Table.Th>District</Table.Th>
                        <Table.Th>ZipCode</Table.Th>
                        <Table.Th>City</Table.Th>
                        <Table.Th>AddressType</Table.Th>
                        <Table.Th>Ações</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Confirmar Exclusão"
                centered
            >
                <Text>Você tem certeza de que deseja excluir este endereço? Esta ação não pode ser desfeita.</Text>

                <Group position="apart" mt="md">
                    <Button onClick={() => setOpened(false)}>Cancelar</Button>
                    <Button color="red" onClick={deleteAddress}>Confirmar Exclusão</Button>
                </Group>
            </Modal>
            <Button style={{background: theme.colors.yellow[9]}} onClick={() => navigate('/profile')} type="button"
                    mt="md">Voltar</Button>

        </Container>
    );
}

export default AddressList;
