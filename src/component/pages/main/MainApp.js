import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import SideMenu from './SideMenu.js';
import TopNav from './TopNav.js';

const useStyles = makeStyles(() =>
    createStyles({
        body: {
            marginTop: '64px'
        },
        root: {
            display: 'flex',
        }
    }),
);

export default function MainApp(props) {
    const { children } = props;
    const classes = useStyles();

    const [nameBar, setNameBar] = useState('');
    const onConfirm_nameBar = (data) => {
        setNameBar(data);
    };

    const [openDrawer, setOpenDrawer] = useState(false);
    const handleDrawerOpen = (data) => {
        setOpenDrawer(data);
    };
    const onConfirm_Drawer = (data) => {
        handleDrawerOpen(data);
    };

    const token = localStorage.getItem('token');
    useEffect(() => {
        if (!token) {
            window.location.href = '/';
        }
    }, []);

    return (
        <div className={classes.root}>
            <TopNav drawer={onConfirm_Drawer} nameAppBar={nameBar} openDrawer={openDrawer} />

            <SideMenu drawer={onConfirm_Drawer} nameBar={onConfirm_nameBar} openDrawer={openDrawer} />
            <Grid container item justify="center" sm={12} xs={12}>
                <Box className={classes.body}>{children}</Box>
            </Grid>

        </div>
    );
}
MainApp.propTypes = {
    children: PropTypes.node
};
