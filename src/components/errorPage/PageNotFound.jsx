import React from 'react';
import { Container, Title, Text, Button, Group } from '@mantine/core';
import classes from './NothingFoundBackground.module.css';

const PageNotFound = () => {

    return (
        <Container className={classes.root}>
            <div className={classes.inner}>
                <div className={classes.content}>
                    <Title className={classes.title}>Nothing to see here</Title>
                    <Text c="dimmed" size="lg" ta="center" className={classes.description}>
                        Page you are trying to open does not exist. You may have mistyped the address, or the
                        page has been moved to another URL. If you think this is an error contact support.
                    </Text>
                    <Group justify="center">
                        <a href={'/home'} size="md">Take me back to home page</a>
                    </Group>
                </div>
            </div>
        </Container>

    )
}

export default PageNotFound;