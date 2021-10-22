import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import jwt_decode from "jwt-decode";
import {
    AppBar,
    CssBaseline,
    Divider,
    Drawer,
    Hidden,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    Toolbar,
    Typography,
    makeStyles,
    useTheme,
    Icon,
    Backdrop, CircularProgress
} from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import history from '../../../history';
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import swal from 'sweetalert';
import LoginService from '../../../services/LoginService';
import { RouteName } from '../../../models/route_name';
import NewLogin from '../../../services/NewLoginService';

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
    appBar: {
        [theme.breakpoints.up('sm')]: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(2)
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            flexShrink: 0,
            width: drawerWidth,
        },
    },
    drawerPaper: {
        width: drawerWidth,
    },

    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },

    root: {
        display: 'flex',
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    item: {
        height: 60
    },
    green: {
        color: '#009422'
    },
    pink: {
        color: '#F84872'
    },
    blue: {
        color: '#2295D2'
    },
    orange: {
        color: '#F9774D'
    },
    subMenu: {
        marginLeft: theme.spacing(7),
        fontSize: 14,
        color: "black"
    },
    divider: {
        backgroundColor: '#ECECEC'
    },
    iconExpand: {
        color: "#858585"

    },
    bottomPush: {
        position: "fixed",
        bottom: 0,
        textAlign: "center",
        paddingBottom: 10,
        width: drawerWidth
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

function SideMenu(props) {
    const { children, window, loading = false } = props;
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    let path = history.location.pathname;

    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };

    var token = localStorage.getItem('token');
    var decoded = jwt_decode(token);

    const loginService = new LoginService(token, { onError: handleError, onUnAuthorized: () => NewLogin() });
    const logout = async () => {
        const res = await loginService.logout();
        if (!res) {
            return;
        }
        localStorage.clear();
        history.push(RouteName.LOGIN);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const [open, setOpen] = useState({
        report: false,
        items: false,
        stock: false,
        history: false,
        employee: false,

    });
    const handleClick = (name) => {
        setOpen({ ...open, [name]: !open[name] });
    };

    const subMenuReport = () => {
        if (decoded.licenseExpired) {
            return [
                { name: "สรุปยอดขาย", link: RouteName.SALE_SUMMARY }
            ];
        }

        return [
            { name: "สรุปยอดขาย", link: RouteName.SALE_SUMMARY },

            { name: "ยอดขายตามสินค้า", link: RouteName.REPORT_ITEM },
            { name: "ยอดขาย แยกตาม หมวดหมู่", link: RouteName.REPORT_CATEGORY },
            { name: "ยอดขาย แยกตาม พนักงาน", link: RouteName.REPORT_EMPLOYEE },
            { name: "ยอดขาย แยกตาม ประเภทการชำระเงิน", link: RouteName.REPORT_PAYMENT },
            { name: "ใบเสร็จรับเงิน", link: RouteName.REPORT_RECEIPT },
            { name: "ส่วนลด", link: RouteName.REPORT_DISCOUNT },
            { name: "ภาษี", link: RouteName.REPORT_TAX }


        ];
    };

    const subMenuItems = [
        { name: "รายการสินค้า", link: RouteName.ITEMS },
        { name: "หมวดหมู่", link: RouteName.CATEGORIES },
        { name: "ส่วนลด", link: RouteName.DISCOUNTS },
    ];
    const subMenuStock = () => {
        if (decoded.licenseExpired) {
            return [
                { name: "รายการคลัง", link: RouteName.STOCK },
                { name: "นำเข้า", link: RouteName.IMPORT_LIST },
                { name: "เบิกออก", link: RouteName.EXPORT_LIST },
            ]
        } else {
            return [
                { name: "รายการคลัง", link: RouteName.STOCK },
                { name: "นำเข้า", link: RouteName.IMPORT_LIST },
                { name: "เบิกออก", link: RouteName.EXPORT_LIST },
                { name: "Adjustments", link: RouteName.ADJUSTMENT_LIST },
            ]
        }
    };

    const isReport = () => {
        if (path === RouteName.SALE_SUMMARY || path === RouteName.REPORT_ITEM || path === RouteName.REPORT_CATEGORY || path === RouteName.REPORT_EMPLOYEE || path === RouteName.REPORT_PAYMENT || path === RouteName.REPORT_RECEIPT || path === RouteName.REPORT_DISCOUNT || path === RouteName.REPORT_TAX) {
            return true;
        }
        return false;
    }

    const checkPathStock = () => {
        if (path === RouteName.STOCK || path === RouteName.IMPORT_LIST || path === RouteName.EXPORT_LIST || path === RouteName.ADJUSTMENT_LIST || path === RouteName.IMPORT_ITEMS) {
            return true;
        }
        return false;
    }
    const isItems = () => {
        if (path === RouteName.ITEMS || path === RouteName.ITEM_DETAIL || path === RouteName.CATEGORIES || path === RouteName.DISCOUNTS || path === RouteName.CATEGORIES_DETAIL || path === RouteName.DISCOUNTS_DETAIL) {
            return true;
        }
        return false;

    }
    const checkSubmenu = (menu) => {
        if (menu === 'รายการคลัง') {
            return path === RouteName.STOCK ? true : false;
        }
        if (menu === 'นำเข้า') {
            return path === RouteName.IMPORT_ITEMS || path === RouteName.IMPORT_LIST ? true : false;
        }
        if (menu === 'เบิกออก') {
            return path === RouteName.EXPORT_LIST || path === RouteName.EXPORT_ITEMS ? true : false;
        }
        if (menu === 'Adjustments') {
            return path === RouteName.ADJUSTMENT_LIST || path === RouteName.ADJUSTMENT_ITEMS ? true : false;
        }
        if (menu === 'รายการสินค้า') {
            return path === RouteName.ITEMS || path === RouteName.ITEM_DETAIL ? true : false;
        }
        if (menu === 'หมวดหมู่') {
            return path === RouteName.CATEGORIES || path === RouteName.CATEGORIES_DETAIL ? true : false;
        }
        if (isReport() && menu === 'ส่วนลด') {
            return path === RouteName.REPORT_DISCOUNT ? true : false;
        }

        if (menu === 'ส่วนลด') {
            return path === RouteName.DISCOUNTS || path === RouteName.DISCOUNTS_DETAIL ? true : false;
        }
        if (menu === 'สรุปยอดขาย') {
            return path === RouteName.SALE_SUMMARY ? true : false;
        }
        if (menu === 'ยอดขายตามสินค้า') {
            return path === RouteName.REPORT_ITEM ? true : false;
        }
        if (menu === 'ยอดขาย แยกตาม หมวดหมู่') {
            return path === RouteName.REPORT_CATEGORY ? true : false;
        }
        if (menu === 'ยอดขาย แยกตาม พนักงาน') {
            return path === RouteName.REPORT_EMPLOYEE ? true : false;
        }
        if (menu === 'ยอดขาย แยกตาม ประเภทการชำระเงิน') {
            return path === RouteName.REPORT_PAYMENT ? true : false;
        }
        if (menu === 'ใบเสร็จรับเงิน') {
            return path === RouteName.REPORT_RECEIPT ? true : false;
        }

        if (menu === 'ภาษี') {
            return path === RouteName.REPORT_TAX ? true : false;
        }

    }
    const drawer = (
        <div>
            <div className={classes.toolbar} />
            <Divider />
            <List style={{ padding: 0 }}>
                <ListItem className={classes.item} button onClick={() => handleClick('report')} component={Link} to={RouteName.SALE_SUMMARY} selected={isReport()}>
                    <ListItemIcon>
                        <Icon className={classes.green}>bar_chart_black</Icon>
                    </ListItemIcon>
                    <ListItemText primary="รายงาน" />
                    {isReport() ? <Icon className={classes.iconExpand}>expand_less</Icon> : <Icon className={classes.iconExpand} > expand_more</Icon>}
                </ListItem>
                <Collapse in={isReport()} timeout="auto" unmountOnExit>
                    <List component="div" disablePaddinge dense="true">
                        {subMenuReport().map((menu) => <ListItem key={menu.name} button component={Link} to={menu.link} >
                            <ListItemText>
                                <Typography variant="subtitle1" className={classes.subMenu} style={{ color: checkSubmenu(menu.name) ? "#1760AD" : "black" }} >{menu.name}</Typography>
                            </ListItemText>
                        </ListItem >)}
                    </List>
                </Collapse>
                <Divider className={classes.divider} />
                {
                    decoded.isAdmin ?
                        <List style={{ padding: 0 }}>
                            <ListItem className={classes.item} button onClick={() => handleClick('items')} component={Link} to={RouteName.ITEMS} selected={isItems()} >
                                <ListItemIcon>
                                    <Icon className={classes.pink}>shopping_basket</Icon>
                                </ListItemIcon>
                                <ListItemText primary="สินค้า" />
                                {isItems() ? <Icon className={classes.iconExpand}>expand_less</Icon> : <Icon className={classes.iconExpand}>expand_more</Icon>}
                            </ListItem>

                            <Collapse in={isItems()} timeout="auto" unmountOnExit>
                                <List component="div" disablePaddinge dense="true">
                                    {subMenuItems.map((menu) => <ListItem key={menu.name} button component={Link} to={menu.link}  >
                                        <ListItemText>
                                            <Typography variant="subtitle1" className={classes.subMenu} style={{ color: checkSubmenu(menu.name) ? "#1760AD" : "black" }} >{menu.name}</Typography>
                                        </ListItemText>
                                    </ListItem >)}
                                </List>
                            </Collapse>
                            <Divider className={classes.divider} />
                        </List> : null

                }


                <ListItem
                    className={classes.item}
                    button
                    selected={checkPathStock()}
                    onClick={() => handleClick('stock')}
                    component={Link}
                    to={RouteName.STOCK}

                >
                    <ListItemIcon>
                        <Icon className={classes.blue}>storefront</Icon>
                    </ListItemIcon>
                    <ListItemText primary="คลัง" />
                    {checkPathStock() ? <Icon className={classes.iconExpand}>expand_less</Icon> : < Icon className={classes.iconExpand}>expand_more</Icon>}
                </ListItem>

                <Collapse in={checkPathStock()} timeout="auto" unmountOnExit>
                    <List component="div" disablePaddinge dense="true">
                        {subMenuStock().map((menu) => <ListItem key={menu.name} button component={Link} to={menu.link} >
                            <ListItemText >
                                <Typography variant="subtitle1" className={classes.subMenu} style={{ color: checkSubmenu(menu.name) ? "#1760AD" : "black" }} >{menu.name}</Typography>
                            </ListItemText>
                        </ListItem >)}
                    </List>
                </Collapse>
                <Divider className={classes.divider} />

                {
                    decoded.isAdmin && !decoded.licenseExpired ?
                        <List>
                            <ListItem button className={classes.item} component={Link} to={RouteName.HISTORY} selected={path == RouteName.HISTORY} >
                                <ListItemIcon>
                                    <Icon className={classes.orange}>history</Icon>
                                </ListItemIcon>
                                <ListItemText primary="ประวัติข้อมูล" />
                            </ListItem>

                            <Divider className={classes.divider} />
                        </List> : null}

                <ListItem button className={classes.item} component={Link} to={RouteName.USERS} selected={path == RouteName.USERS} >
                    <ListItemIcon>
                        <Icon className={classes.green}>manage_accounts</Icon>
                    </ListItemIcon>
                    <ListItemText primary="พนักงาน" />
                </ListItem>
                <Divider className={classes.divider} />
                <List  >

                    <ListItem button className={classes.item}>
                        <ListItemIcon>
                            <ExitToAppRoundedIcon className={classes.pink} />
                        </ListItemIcon>
                        <Typography onClick={() => {
                            swal({
                                title: `ต้องการออกจากระบบใช่หรือไม่`,
                                icon: "warning",
                                buttons: ['ยกเลิก', 'ตกลง'],
                                dangerMode: true,
                            })
                                .then((willDelete) => {
                                    if (willDelete) {
                                        logout();
                                    }
                                });
                        }}
                            variant="body2">
                            ออกจากระบบ
                        </Typography>
                    </ListItem>
                    <Divider className={classes.divider} />
                    {/* <ListItem style={{ width: drawerWidth, placeContent: "center" }} >
                        <Typography variant="caption">
                            {'version ' + packageJson.version}
                        </Typography>
                    </ListItem> */}
                </List>
            </List>
        </div >
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar className={classes.appBar} position="fixed">
                <Toolbar>
                    <IconButton
                        aria-label="open drawer"
                        className={classes.menuButton}
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography noWrap variant="h6">Nippo Genius</Typography>
                </Toolbar>
            </AppBar>
            <nav aria-label="mailbox folders" className={classes.drawer}>
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden implementation="css" smUp>
                    <Drawer
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        container={container}
                        onClose={handleDrawerToggle}
                        open={mobileOpen}
                        variant="temporary"
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden implementation="css" xsDown>
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        open
                        variant="permanent"
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {children}
            </main>
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );


}

SideMenu.propTypes = {
    children: PropTypes.array,
    title: PropTypes.string,
    window: PropTypes.func,
    license: PropTypes.bool,
    loading: PropTypes.bool,
};

export default SideMenu;
