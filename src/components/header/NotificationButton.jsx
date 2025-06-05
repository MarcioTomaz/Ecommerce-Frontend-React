import React, {useContext, useEffect, useState} from 'react';
import {Popover, ActionIcon, Text, Stack, Badge} from '@mantine/core';
import {IconBell} from '@tabler/icons-react';
import axios from "axios";
import {API_URL} from "../../hooks/api.jsx";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";


const NotificationButton = () => {

    const {userToken} = useContext(AuthContext);


    const [opened, setOpened] = useState(true);
    const [notifications, setNotifications] = useState([
        {id: 1, title: 'Pedido enviado', content: 'Seu pedido #1234 foi enviado.'},
        {id: 2, title: 'Nova promoção!', content: 'Aproveite 30% em toda a loja.'},
    ]);

    useEffect(() => {
        fetchNotifications()
    }, [])

    const fetchNotifications = () => {
        axios.get(`${API_URL}/notification`,
            {
                headers: {Authorization: `Bearer ${userToken}`},
            })
            .then((response) => {
                setNotifications(response.data);
                console.log("notifications fetched", response.data);

            }).catch((error) => {
            console.log(error);
        })
    }


    return (
        <Popover opened={opened} onChange={setOpened} width={250} position="bottom-end" withArrow>
            <Popover.Target>
                <ActionIcon variant="light" onClick={() => setOpened(o => !o)}>
                    <IconBell/>
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
                <Stack spacing="xs">
                    {notifications.length > 0 ? notifications.map(n => (
                        <div key={n.id}>
                            <Text fw={500}>{n.title}</Text>
                            <Text size="sm" >{n.type}</Text>
                            <Text size="sm" c="dimmed">{n.message}</Text>
                            <Badge color="gray" variant="light" mt={4}>Nova</Badge>
                        </div>
                    )) : (
                        <Text size="sm" c="dimmed">Nenhuma notificação</Text>
                    )}
                </Stack>
            </Popover.Dropdown>
        </Popover>
    )
}

export default NotificationButton;
