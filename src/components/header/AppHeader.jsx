import React, {startTransition, useContext, useEffect, useState} from 'react';
import {
    Group,
    ActionIcon,
    Select,
    rem,
    useMantineColorScheme
} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import classes from './HeaderSearch.module.css';
import { MantineLogo } from '@mantinex/mantine-logo';
import { ROUTES } from '../../routes/URLS.jsx';
import { AuthContext } from '../../GlobalConfig/AuthContext.jsx';
import NotificationButton from './NotificationButton.jsx';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom'; //

function AppHeader() {
    const { userToken, logout } = useContext(AuthContext);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const { t, i18n, ready } = useTranslation('header');
    const navigate = useNavigate(); //

    const [links, setLinks] = useState([]);

    // Função para obter os links iniciais (para usuários não logados)
    const getInitialLinks = () => [
        { id: 'home', to: '/home', label: t('home') },
        { id: 'products', to: ROUTES.PRODUCT_LIST, label: t('products') },
        { id: 'about', to: '/learn', label: t('about') },
        { id: 'cart', to: ROUTES.CART_DETAILS, label: t('cart') },
        { id: 'login', to: ROUTES.LOGIN, label: t('login') },
    ];

    function handleLogout() {
        startTransition( () =>{
            logout();
            navigate(ROUTES.LOGIN);
        });
    }

    useEffect(() => {
        if (!ready) return; // Espera o namespace "header" ser carregado

        if (userToken) {
            setLinks([
                { id: 'home', to: '/home', label: t('home') },
                { id: 'products', to: ROUTES.PRODUCT_LIST, label: t('products') },
                { id: 'about', to: '/learn', label: t('about') },
                { id: 'cart', to: ROUTES.CART_DETAILS, label: t('cart') },
                { id: 'profile', to: ROUTES.PROFILE, label: t('profile') },

                { id: 'logout', label: t('logout'), onClick: handleLogout },
            ]);
        } else {
            setLinks(getInitialLinks());
        }
    }, [userToken, t, ready, navigate]);

    const items = links.map(({ id, to, label, onClick }) => {
        if (onClick) {

            return (
                <a
                    key={id || label}
                    className={classes.link}
                    onClick={(e) => { e.preventDefault(); onClick(); }}
                    style={{cursor: 'pointer'}}
                >
                    {label}
                </a>
            );
        }
        return (
            <Link
                key={id || label}
                to={to}
                className={classes.link}
            >
                {label}
            </Link>
        );
    });

    const handleLanguageChange = (value) => {
        i18n.changeLanguage(value);
    };

    // Evita renderizar o cabeçalho antes das traduções estarem prontas
    if (!ready) return null;

    return (
        <header className={classes.header}>
            <div className={classes.inner}>
                <Group>
                    <Link to={ROUTES.HOME}>
                        <MantineLogo size={28} />
                    </Link>
                </Group>

                <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
                    {items}

                    {userToken && <NotificationButton />}

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

                <Group position="right">
                    <Select
                        data={[
                            { value: 'pt-BR', label: 'Português (Brasil)' },
                            { value: 'en', label: 'English' },
                        ]}
                        placeholder={t('select_language')}
                        value={i18n.language}
                        onChange={handleLanguageChange}
                        allowDeselect={false}
                        style={{ width: 180 }}
                    />
                </Group>
            </div>
        </header>
    );
}

export default AppHeader;
