import React, { useEffect, useState } from 'react';
import {
    Avatar,
    CircularProgress,
    Grid,
    Paper,
    Typography,
    makeStyles
} from '@material-ui/core';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import MoneyIcon from '@material-ui/icons/Money';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import ImageIcon from '@material-ui/icons/Image';
import Service from '../../../services/Service';
import ReportsService from '../../../services/ReportsService';
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import SiddeMenu from '../main/SideMenu';
import history from '../../../history';
import LoginService from '../../../services/LoginService';
import Dictionary from '../../../services/Dictionary';
import ChartSumTotal from './ChartSumTotal';
import LowStockItemsTable from './LowStockItemsTable';
import LastOrderTable from './LastOrderTable';
import jwt from 'jwt-decode';

const useStyles = makeStyles(() => ({
    ChartSum: {
        height: 255,
        margin: 2,
    },
    GridChartSum: {
        marginRight: 50,
        marginTop: 10
    },
    best_seller: {
        height: 255,
        margin: 2,
    },
    boxGraph: {
        height: 280,
    },
    green: {
        backgroundColor: '#00A110',
        color: '#EFEFEF',
    },
    lowStockTableMaginTop: {
        marginTop: 15
    },
    pamary: {
        backgroundColor: '#1760AD',
        color: '#EFEFEF',
    },
    red: {
        backgroundColor: '#FF0000',
        color: '#EFEFEF',
    },
    root: {
        height: 100,
        margin: 2
    },
    space: {
        margin: 2,
    },
    table: {
        minWidth: 780,
    },
    tableHeadAlign: {
        fontWeight: 650,
    },
    text_blue: {
        color: '#1760AD',
    },
    text_red: {
        backgroundColor: '#FF0000',
        borderRadius: 5,
        color: '#EFEFEF',
        minWidth: 80,
        paddingLeft: 8,
        paddingRight: 8,
    },
    text_white_bold: {
        color: '#EFEFEF'
    },
    text_yellow: {
        backgroundColor: '#ffde2c',
        borderRadius: 5,
        color: '#000',
        minWidth: 80,
        paddingLeft: 8,
        paddingRight: 8,
    }
}));

export default function DashBoardPage() {
    const classes = useStyles();
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();

    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        if (!errorMessage) showMessage(errorMessage, 'error');
    };
    const Authorized = () => {
        const email = localStorage.getItem('email');
        const password = localStorage.getItem('password');
        login({ email, password });
    };
    const loginService = new LoginService('', { onError: handleError, onUnAuthorized: Authorized });
    const login = async (data) => {
        const res = await loginService.login(data);
        if (!res) {
            history.push('/');
            return;
        }
        localStorage.removeItem('token');
        localStorage.setItem('token', res.token);
        window.location.href = '/dashboard';
    };
    const token = localStorage.getItem('token');
    const service = new Service(token, { onError: handleError, onUnAuthorized: Authorized });
    const reportsService = new ReportsService(token, { onError: handleError, onUnAuthorized: Authorized });
    const [orders, setOrders] = useState([]);
    const [isTableOrderLoading, setIsTableOrderLoading] = useState(false);
    const GetFormattedYearMonth = (years) => {
        const todayTime = new Date();
        const month = todayTime.getMonth() + 1;
        const year = todayTime.getFullYear();
        if (years) {
            return year;
        }
        return year + '-' + month;
    };
    const [loading, setLoading] = useState(false);
    const [loadingGraph, setLoadingGraph] = useState(false);

    const [loadingBestSeller, setLoadingBestSeller] = useState(false);
    const [licenseExpired, setLicenseExpired] = useState(false);
    const [revenue, setRevenue] = useState('0');
    const [cost, setCost] = useState('0');
    const [profit, setProfit] = useState('0');
    const [graph, setGraph] = useState({});
    const [bestSeller, setBestSeller] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [isLowStockItemsTableLoading, setIsLowStockItemsTableLoading] = useState(false);

    function RenderBestSellingProducts(item) {
        return (
            <Grid alignItems="center" className={classes.space} container justify="center" key={item.id} spacing={2}>
                <Grid item sm={3} xs={3}>
                    {item.imageUrl ? (
                        <Avatar
                            className={classes.square}
                            src={item.imageUrl}
                            variant="square"
                        />
                    ) : (
                        <Avatar className={classes.square} variant="square">
                            <ImageIcon />
                        </Avatar>
                    )
                    }
                </Grid>
                <Grid item sm={5} xs={5}>
                    <Typography variant="body2">
                        {item.name}
                    </Typography>
                </Grid>
                <Grid item sm={4} xs={4}>
                    <Typography variant="body2">
                        {new Intl.NumberFormat().format(item.sellPrice)}
                    </Typography>
                </Grid>
            </Grid>
        );
    }
    const LoadingProgress = (props) => {
        const { title, loading } = props;
        if (title === '0') {
            return (
                <Typography variant="h6">
                    {loading && <CircularProgress size={18} />}
                    {!loading && '฿ 0'}
                </Typography>
            );
        } else {
            return (
                <Typography variant="h6">
                    {loading && <CircularProgress size={18} />}
                    {!loading && '฿ ' + new Intl.NumberFormat().format(title)}
                </Typography>
            );
        }
    };

    // useEffect(() => {
    //     const user = jwt(token);
    //     setLicenseExpired(user.licenseExpired);
    //     const loadOrders = async () => {
    //         setIsTableOrderLoading(true);
    //         const lastOrders = await service.getOrders({'limit': 50, 'sort': 'desc'});
    //         setOrders(lastOrders.map((order) => {
    //             const fullName = !order.customer 
    //                 ? '-' 
    //                 : `${order.customer.firstName} ${order.customer.lastName}`;

    //             return {...order, fullName, paymentMethod: Dictionary.translate(order.paymentMethod)};
    //         }));
    //         setIsTableOrderLoading(false);
    //     };
    //     const loadProfitAndLoss = async () => {
    //         var res = await reportsService.getProfitAndLoss();
    //         if (!res) {
    //             setLoading(false);
    //             return;
    //         }
    //         for (const i in res) {
    //             setRevenue(res[i].revenue);
    //             setCost(res[i].cost);
    //             setProfit(res[i].profit);
    //         }
    //         setLoading(false);
    //     };
    //     const loadBestSeller = async () => {
    //         var res = await reportsService.getBestSellerItems();
    //         if (!res) {
    //             setLoadingBestSeller(false);
    //             return;
    //         }
    //         setBestSeller(res);
    //         setLoadingBestSeller(false);
    //     };
    //     const loadLowStockItems = async () => {
    //         setIsLowStockItemsTableLoading(true);
    //         var items = await reportsService.getBelowSafetyStockItems();
    //         setLowStockItems(items.map((item) => {
    //             return {...item, unit: Dictionary.translate(item.unit)};
    //         }));
    //         setIsLowStockItemsTableLoading(false);
    //     };
    //     const loadGraph = async () => {
    //         let queryParams = `dateFrom=${GetFormattedYearMonth(true)}-01-01&dateTo=${GetFormattedYearMonth(true)}-12-31`;
    //         var res = await reportsService.getProfitAndLoss(queryParams);
    //         if (!res) {
    //             setLoadingGraph(false);
    //             return;
    //         }
    //         setGraph(res);
    //         setLoadingGraph(false);
    //     };
    //     setLoading(true);
    //     loadProfitAndLoss();
    //     loadOrders();
    //     loadLowStockItems();
    //     setLoadingBestSeller(true);
    //     loadBestSeller();
    //     setLoadingGraph(true);
    //     loadGraph();
    // },[]);

    return (
        <SiddeMenu title={'รายงาน'} license={licenseExpired}>
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            {/* <Grid container justify="center" spacing={3} style={{marginTop:5}}>
                <Grid item sm={4} xs={12}>
                    <Paper className={classes.pamary}>
                        <Grid className={classes.root} container justify="center" spacing={2}>
                            <Grid item sm={8} xs={8}>
                                <Typography className={classes.text_white_bold} variant="h6">
                                    ราคาต้นทุนสินค้า
                                </Typography>
                                <LoadingProgress loading={loading} title={cost}/>
                            </Grid>
                            <Grid alignItems="center" container item justify="center" sm={4} xs={4}>
                                <Avatar className={classes.red}>
                                    <LocalMallIcon/>
                                </Avatar>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Paper className={classes.pamary}>
                        <Grid className={classes.root} container justify="center" spacing={2}>
                            <Grid item sm={8} xs={8}>
                                <Typography className={classes.text_white_bold} variant="h6">
                                    สรุปยอดกำไร
                                </Typography>
                                <LoadingProgress loading={loading} title={profit}/>
                            </Grid>
                            <Grid alignItems="center" container item justify="center" sm={4} xs={4}>
                                <Avatar className={classes.green}>
                                    <MoneyIcon/>
                                </Avatar>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Paper className={classes.pamary}>
                        <Grid className={classes.root} container justify="center" spacing={2}>
                            <Grid item sm={8} xs={8}>
                                <Typography className={classes.text_white_bold} variant="h6">
                                    ยอดขายรายเดือน
                                </Typography>
                                <LoadingProgress loading={loading} title={revenue}/>
                            </Grid>
                            <Grid alignItems="center" container item justify="center" sm={4} xs={4}>
                                <Avatar className={classes.pamary}>
                                    <MonetizationOnIcon fontSize="large"/>
                                </Avatar>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container justify="center" spacing={3}>
                <Grid className={classes.boxGraph} item sm={9} xs={12}>
                    <Paper>
                        <Grid alignItems="center" className={classes.ChartSum} container justify="center">
                            { loadingGraph ?(
                                <Grid container item justify="center" sm={12} xs={12}>
                                    <LoadingProgress loading={loadingGraph} title={cost}/>
                                </Grid>
                            ):(
                                Object.keys(graph).length !== 0 ? (
                                    <Grid className={classes.GridChartSum} sm={12} xs={12}>
                                        <ChartSumTotal items={graph}/> 
                                    </Grid>
                                ):(
                                    <Grid className={classes.GridChartSum} sm={12} xs={12}>
                                        <center>ไม่มีข้อมูล</center>
                                    </Grid>
                                )
                            )}
                        </Grid>
                    </Paper> 
                </Grid>
                <Grid className={classes.boxGraph} item sm={3} xs={12}>
                    <Paper>
                        <Grid className={classes.best_seller} container justify="center" spacing={2}>
                            <Grid item sm={12} xs={12}>
                                <Typography className={classes.text_blue} variant="h6">
                                    3 อันดับสินค้าขายดี
                                </Typography>
                            </Grid> 
                            <Grid item sm={12} xs={12}>
                                <Grid alignItems="center" container justify="center" spacing={2}>
                                    {!bestSeller?(             
                                        <Grid container spacing={2}>
                                            <Grid alignItems="center" container item justify="center" xs={12}>
                                                <Typography variant="body1">
                                                    ไม่มีข้อมูล
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    ):(
                                        loadingBestSeller ?(
                                            <Grid container spacing={2}>
                                                <Grid alignItems="center" container item justify="center" xs={12}>
                                                    { loadingBestSeller && <CircularProgress size={18}/>}
                                                </Grid>
                                            </Grid>
                                        ):( 
                                            bestSeller.map((row) => 
                                                RenderBestSellingProducts(row.item)
                                            )
                                        )
                                    )} 
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

            </Grid>
        
            
                <Grid className={classes.lowStockTableMaginTop} container justify="center" spacing={3}>
                {
                licenseExpired ? null :
                <Grid item lg={6} md={12}>
                    <LowStockItemsTable isLoading={isLowStockItemsTableLoading} lowStockItems={lowStockItems}/>
                </Grid>
                }
                <Grid item lg={licenseExpired ? 12 : 6 } md={12}>
                    <LastOrderTable isLoading={isTableOrderLoading} orders={orders}/>
                </Grid>
            </Grid> */}


        </SiddeMenu>
    );
}
