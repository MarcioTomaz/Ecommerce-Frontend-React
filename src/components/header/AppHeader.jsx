import React, { useContext, useEffect, useState } from 'react';
import { Group, Autocomplete, rem, Anchor } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import classes from './HeaderSearch.module.css';
import { MantineLogo } from "@mantinex/mantine-logo";
import { ROUTES } from "../../routes/URLS.jsx";
import { AuthContext } from "../../GlobalConfig/AuthContext.jsx";

const initialLinks = [
    { link: '/home', label: 'Home' },
    { link: ROUTES.PRODUCT_LIST, label: 'Produtos' },
    { link: '/learn', label: 'Sobre' },
    { link: '/cart', label: 'Carrinho' },
    { link: '/login', label: 'Login' },
];

function AppHeader() {
    const { userToken, logout } = useContext(AuthContext);
    const [links, setLinks] = useState(initialLinks);

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
