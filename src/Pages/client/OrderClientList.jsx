import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";
import axios from "axios";
import {ROUTES as ROTES, ROUTES as ROTE, ROUTES} from "../../routes/URLS.jsx";
import {Button, Container, Group, Pagination, Select, Table, useMantineTheme} from "@mantine/core";
import {API_URL} from "../../hooks/api.jsx";
import {useNavigate} from "react-router-dom";


const OrderClientList = () => {
    const {login, userToken} = useContext(AuthContext);
    const [userData, setUserData] = useState([]);
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const [orders, setOrders] = useState([]);

    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState(null);

    const fetchOrders = (pageNumber, status) => {
        const params = {
            page: pageNumber - 1,
            size: pageSize,
            ...(status && { status: status }),
        }

        axios.get(`${API_URL}${ROUTES.ORDER_LIST}`,
            {headers: {'Authorization': `Bearer ${userToken}`},
            params,
            })
            .then(response => {
                const {content, totalPages: tp } = response.data;
                setOrders(content);
                setTotalPages(tp);
            })
            .catch((error) => {console.error(error);});
    };


    const orderDetails= (orderId) =>{
        navigate(ROUTES.ORDER_DETAILS.replace(':id', orderId));
    }

    // Dispara busca ao montar, ao mudar página ou filtro
    useEffect(() => {
        fetchOrders(page, statusFilter);
    }, [page, statusFilter, userToken]);

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        setPage(1);
    }

    const clearFilter = () =>{
        setStatusFilter(null);
        setPage(1);
    }


    const rows = orders.map((row) => (
        <Table.Tr key={row.id}  style={{textAlign: "center"}}>
            <Table.Td>{row.id}</Table.Td>
            <Table.Td>{row.status}</Table.Td>
            <Table.Td>{row.total}</Table.Td>
            <Table.Td>
                <Button style={{background: theme.colors.blue[9]}}
                        onClick={() => orderDetails(row.id)}>Detalhes</Button>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Container>
            {/* Filtro de status */}
            <Group mb="md" spacing="sm">
                <Select
                    label="Filtrar por status"
                    placeholder="Selecione o status"
                    data={[
                        { value: 'PENDING', label: 'Pendente' },
                        { value: 'PROCESSING', label: 'Em Processamento' },
                        { value: 'WAITING_FOR_PAYMENT', label: 'Aguardando Pagamento' },
                        { value: 'PAID', label: 'Pago' },
                        { value: 'SHIPPED', label: 'Enviado' },
                        { value: 'DELIVERED', label: 'Entregue' },
                        { value: 'CANCELED', label: 'Cancelado' }
                    ]}
                    value={statusFilter}
                    onChange={handleStatusChange}
                    clearable
                />
                {statusFilter && (
                    <Button variant="outline" onClick={clearFilter}>
                        Limpar filtro
                    </Button>
                )}
            </Group>
            <Table min={700}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th style={{width: "20%", textAlign: "center"}}>Id do Pedido</Table.Th>
                        <Table.Th style={{textAlign: "center"}}>Status</Table.Th>
                        <Table.Th style={{textAlign: "center"}}>Total</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>

            <Pagination
                page={page}
                onChange={setPage}
                total={totalPages}
                position="center"
                mt="md"
            />

            <Button style={{background: theme.colors.yellow[9]}} onClick={() => navigate('/profile')} type="button"
                    mt="md">Voltar</Button>
        </Container>
    );

}

export default OrderClientList;