import React, {useContext, useEffect, useState} from 'react';
import {Popover, ActionIcon, Text, Stack, Badge, Pagination, Button} from '@mantine/core';
import {IconBell} from '@tabler/icons-react';
import axios from "axios";
import {API_URL} from "../../hooks/api.jsx";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";
import {useTranslation} from "react-i18next";


const NotificationButton = () => {

    const {userToken} = useContext(AuthContext);

    const [opened, setOpened] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [pageSize] = useState(3);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { t, i18n } = useTranslation(['common', 'notification']);

    const markAsRead = async (id) => {
        try {
            await axios.put(
                `${API_URL}/notification/read`,
                { id },
                { headers: { Authorization: `Bearer ${userToken}` } }
            );
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
        } catch (error) {
            console.log(error);
        }
    };

    const fetchNotifications = async (pageNumber) => {
        try {
            const params = {
                page: pageNumber -1,
                size: pageSize,
            }

            const response = await axios.get(`${API_URL}/notification`,
                {params, headers:{Authorization: `Bearer ${userToken}`}});

            const {content, totalPages} = response.data;
            setNotifications(content);
            setTotalPages(totalPages);

        }catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchNotifications(page)
    }, [page]);

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
                            <Text size="sm" >{t(`notification:${n.type}`)}</Text>
                            <Text size="sm" c="dimmed">{n.message}</Text>
                            {!n.isRead && (
                                <Badge color="gray" variant="light" mt={4}>
                                    {t('notification:newNotification')}
                                </Badge>
                            )}
                            <Button
                                size="xs"
                                variant="light"
                                mt={6}
                                disabled={n.isRead}
                                onClick={() => markAsRead(n.id)}
                            >
                                {t('notification:read') ?? 'Lido'}
                            </Button>
                        </div>
                    )) : (
                        <Text size="sm" c="dimmed">{t('notification:')}</Text>
                    )}
                </Stack>
                <Pagination
                    page={page}
                    onChange={setPage}
                    total={totalPages}
                    position="center"
                    mt="md"
                />
            </Popover.Dropdown>

        </Popover>
    )
}

export default NotificationButton;
