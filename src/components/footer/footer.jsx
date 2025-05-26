import React from 'react';
import {Anchor, Group, ActionIcon, rem} from '@mantine/core';
import {MantineLogo} from "@mantinex/mantine-logo";
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react';
import classes from './Footer.module.css'



const links = [
    { link: '#', label: 'Contact' },
    { link: '#', label: 'Privacy' },
    { link: '#', label: 'Blog' },
    { link: '#', label: 'Store' },
    { link: '#', label: 'Careers' },
];

const items = links.map((link) => (
    <Anchor
        c="dimmed"
        key={link.label}
        href={link.link}
        lh={1}
        onClick={(event) => event.preventDefault()}
        size="sm"
    >
        {link.label}
    </Anchor>
));

function Footer() {
    return (
        <>
            <div className={classes.footer}>
                <div className={classes.inner}>
                    <MantineLogo size={28}/>

                    <Group className={classes.links}>{items}</Group>

                    <Group gap="xs" justify="flex-end" wrap="nowrap">
                        <ActionIcon size="lg" variant="default" radius="xl">
                            <IconBrandTwitter style={{width: rem(18), height: rem(18)}} stroke={1.5}/>
                        </ActionIcon>
                        <ActionIcon size="lg" variant="default" radius="xl">
                            <IconBrandYoutube style={{width: rem(18), height: rem(18)}} stroke={1.5}/>
                        </ActionIcon>
                        <ActionIcon size="lg" variant="default" radius="xl">
                            <IconBrandInstagram style={{width: rem(18), height: rem(18)}} stroke={1.5}/>
                            notlisanna        </ActionIcon>
                    </Group>
                </div>
            </div>
        </>
    );
}

export default Footer;
