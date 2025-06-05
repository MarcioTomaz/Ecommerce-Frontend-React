// components/header/AppHeader.jsx (Este arquivo NÃO MUDA)
import React, { useContext, useEffect, useState } from 'react';
import { Group, Autocomplete, rem, Anchor, Text, ActionIcon, useMantineColorScheme } from '@mantine/core'; // useMantineColorScheme é importado e usado aqui
import { IconSearch, IconSun, IconMoon } from '@tabler/icons-react';
import classes from './HeaderSearch.module.css';
import { MantineLogo } from "@mantinex/mantine-logo";
import { ROUTES } from "../../routes/URLS.jsx";
import { AuthContext } from "../../GlobalConfig/AuthContext.jsx";
import NotificationButton from "./NotificationButton.jsx";

const initialLinks = [
    { id: 'home', link: '/home', label: 'Home' },
    { id: 'products', link: ROUTES.PRODUCT_LIST, label: 'Produtos' },
    { id: 'about', link: '/learn', label: 'Sobre' },
    { id: 'cart', link: '/cart', label: 'Carrinho' },
    { link: '/login', label: 'Login' },
];

function AppHeader() {
    const { userToken, logout } = useContext(AuthContext);
    const [links, setLinks] = useState(initialLinks);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    useEffect(() => {
        if (userToken) {
            setLinks(prevLinks => [
                ...prevLinks.filter(link => link.label !== 'Login'),
                { link: '/profile', label: 'Perfil' },
                { link: '#', label: 'Logout', onClick: handleLogout }
            ]);
        } else {
            setLinks(initialLinks);
        }
    }, [userToken]);

    function handleLogout() {
        logout();
        setLinks(initialLinks);
    }

    const items = links.map(({ link, label, onClick }) => (
        <Anchor
            key={label}
            href={link}
            className={classes.link}
            onClick={onClick ? (e) => { e.preventDefault(); onClick(); } : undefined}>
            {label}
        </Anchor>
    ));

    return (
        <header className={classes.header}>
            <div className={classes.inner}>
                <Group>
                    <MantineLogo size={28} />
                </Group>

                <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
                    {items}

                    {userToken && <NotificationButton />}

                    {/* Botão para alternar o modo escuro */}
                    <ActionIcon
                        onClick={() => toggleColorScheme()}
                        variant="default"
                        size="lg"
                        aria-label="Toggle color scheme"
                    >
                        {colorScheme === 'dark' ? (
                            <IconSun style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                        ) : (
                            <IconMoon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                        )}
                    </ActionIcon>
                </Group>

                <Autocomplete
                    className={classes.search}
                    placeholder="Search"
                    leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                    visibleFrom="xs"
                />

            </div>
        </header>
    );
}

export default AppHeader;