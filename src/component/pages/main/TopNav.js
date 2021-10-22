import React, {useEffect} from 'react';
import {PropTypes} from 'prop-types';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import {
    createStyles,
    makeStyles,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
        },
    }),
);

export default function TopNav(props) {
    const {drawer, openDrawer, nameAppBar} = props;
    const classes = useStyles();

    const handleDrawerOpen = () => {
        drawer(true);
    };

    useEffect(() => {

    }, []);

    return (
        <AppBar className={clsx(classes.appBar, {[classes.appBarShift]: openDrawer,})} position="fixed">
            <Toolbar>
                <IconButton
                    aria-label="open drawer"
                    className={clsx(classes.menuButton, openDrawer && classes.hide)}
                    color="inherit"
                    edge="start"
                    onClick={handleDrawerOpen}
                >
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6">
                    {nameAppBar}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

TopNav.propTypes = {
    drawer: PropTypes.func,
    nameAppBar: PropTypes.string,
    openDrawer: PropTypes.bool
};
