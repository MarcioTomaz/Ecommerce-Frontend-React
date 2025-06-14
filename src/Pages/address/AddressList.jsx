import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {Button, Container, Group, Modal, Table, Text, useMantineTheme} from '@mantine/core';
import axios from "axios";
import {API_URL} from "../../hooks/api.jsx";
import {ROUTES} from "../../routes/URLS.jsx";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";
import {useTranslation} from "react-i18next";


const AddressList = () => {

    const { login, userToken } = useContext(AuthContext);
    const [userData, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [opened, setOpened] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const { t, i18n } = useTranslation(['common', 'address']);

    const navigate = useNavigate();
    const theme = useMantineTheme();

    useEffect(() => {
        fetchAddress();
    }, [userToken]);


    const fetchAddress = async () => {
        try {
            if(userToken){
                setIsLoading(true);
                const response = await axios.get(`${API_URL}/address/read/addresses`,
                    {headers: { 'Authorization': `Bearer ${userToken}` }});
                setUserData(response.data);
                setIsLoading(false);
            }
        }catch(error) {
            setError(error);
        }
    }

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
            {/*<Table.Td>{row.addressType}</Table.Td>*/}
            <Table.Td>
                <Button style={{background: theme.colors.blue[9]}} onClick={() => editAddress(row.id)}>{t('common:edit')}</Button>
            </Table.Td>
            <Table.Td>
                <Button style={{background: theme.colors.red[9]}}
                        onClick={() => confirmDeleteAddress(row.id)}>{t('common:delete')}</Button>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Container>
            <Button onClick={() => navigate(ROUTES.ADDRESS_REGISTER)}>{t('address:registerNewAddress')}</Button>

            <Table miw={700}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>{t('common:id')}</Table.Th>
                        <Table.Th>{t('address:street')}</Table.Th>
                        <Table.Th>{t('address:residencyType')}</Table.Th>
                        <Table.Th>{t('address:number')}</Table.Th>
                        <Table.Th>{t('address:district')}</Table.Th>
                        <Table.Th>{t('address:zipCode')}</Table.Th>
                        <Table.Th>{t('address:city')}</Table.Th>
                        {/*<Table.Th>{t('address:addressType')}</Table.Th>*/}
                        <Table.Th>{t('address:actions')}</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={t('address:confirmDeleteTitle')}
                centered
            >
                <Text>{t('address:confirmDeleteMessage')}</Text>

                <Group position="apart" mt="md">
                    <Button onClick={() => setOpened(false)}>{t('common:cancel')}</Button>
                    <Button color="red" onClick={deleteAddress}>{t('address:confirmDeleteButton')}</Button>
                </Group>
            </Modal>
            <Button style={{background: theme.colors.yellow[9]}} onClick={() => navigate('/profile')} type="button"
                    mt="md">{t('common:back')}</Button>

        </Container>
    );
}

export default AddressList;
