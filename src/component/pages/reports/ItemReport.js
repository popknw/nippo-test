import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemSecondaryAction, makeStyles, ListItemText, Paper, Typography, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import MaterialTable, { MTableToolbar } from 'material-table'
import React, { useState, useEffect } from 'react'
import SideMenu from '../main/SideMenu'
import SectionFilter from './SectionFilter'
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import ReportsService from '../../../services/ReportsService'
import { format } from 'date-fns'
import NewLogin from '../../../services/NewLoginService'
import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    LineSeries,
    ScatterSeries,
    BarSeries,

} from '@devexpress/dx-react-chart-material-ui';
import {
    symbol,
    symbolCircle,
} from 'd3-shape';

const Point = (type, styles) => (props) => {
    const {
        arg, val, color,
    } = props;
    return (
        <path
            fill={color}
            transform={`translate(${arg} ${val})`}
            d={symbol().size([10 ** 2]).type(type)()}
            style={styles}
        />
    );
};
const LinePoint = Point(symbolCircle
    , {
        stroke: 'white',
        strokeWidth: '1px',
    });


const LineWithPoint = (props) => {
    const { coordinates } = props;
    return (
        <React.Fragment>
            <LineSeries.Path {...props} coordinates={coordinates} />
            <ScatterSeries.Path {...props} pointComponent={LinePoint} />
        </React.Fragment>
    );
};



export default function ItemRePort() {
    const formatChart = () => tick => tick;
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };
    const reportService = new ReportsService(localStorage.getItem('token'), { onError: handleError, onUnAuthorized: () => NewLogin() });

    const [itemRepoet, setItemRepoet] = useState([])
    const [bestSellerItems, setBestSellerItems] = useState([])
    const [itemsChart, setItemsChart] = useState([])
    const [loading, setLoading] = useState(false)

    const getItemRepoet = async (queryParams) => {
        const res = await reportService.getItemRepoet(queryParams);
        if (!res) { return; }
        setItemRepoet(res);
        setLoading(false)
    }

    const getBestSellerItems = async () => {
        const res = await reportService.getBestSellerItems();
        if (!res) { return; }

        setBestSellerItems(res);
        setLoading(false)
    }

    const getItemsChart = async (queryParams) => {
        const res = await reportService.getItemChart(queryParams);
        if (!res) { return; }

        setItemsChart(res);
        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        const now = new Date();
        const dateNow = format(now, "yyyy-MM-dd")
        const queryParams = {
            start: `${dateNow} 00:00:00`,
            end: format(now, "yyyy-MM-dd HH:mm:ss"),
            userId: ""
        };

        getBestSellerItems();
        getItemRepoet(queryParams);
        getItemsChart(queryParams);

    }, [])
    const setNumberFormat = (number) => {
        let f = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
        return f.format(number);
    }

    const [value, setValue] = React.useState('line');

    const handleChange = (event) => {
        setValue(event.target.value);
    };
    return (
        <div>
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <SideMenu>
                <SectionFilter onSubmitFilter={(queryParams) => { getItemRepoet(queryParams); getItemsChart(queryParams); }} />
                <Grid container spacing={3}>
                    <Grid item xs={12} xs={5}>
                        <Paper variant="outlined" style={{ marginTop: 20, boxShadow: 'none', height: 390, }} >

                            <Grid container style={{ padding: 20 }}>
                                <Grid item xs>
                                    <Typography variant="subtitle2" style={{ color: 'black' }}>รายการขายดี 5 อันดับ</Typography>
                                </Grid>
                                <Grid item xs style={{ textAlign: "right" }}>
                                    <Typography variant="subtitle2" style={{ color: 'black' }}>ยอดขายรวม</Typography>

                                </Grid>
                            </Grid>
                            <List dense={false} style={{ marginTop: 15 }}>
                                {bestSellerItems.map((best) => <ListItem>
                                    <ListItemAvatar>
                                        <Avatar src={best.item.imageUrl} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={best.item.name}
                                    />
                                    <ListItemSecondaryAction>
                                        <Typography>{best.sales}</Typography>
                                    </ListItemSecondaryAction>
                                </ListItem>)}
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} xs={7}>
                        <Paper variant="outlined" style={{ marginTop: 20, boxShadow: 'none' }} >
                            <Grid container >
                                <Grid item xs>
                                    <Typography variant="subtitle2" style={{ padding: 20, color: 'black', textAlign: "left" }}>กราฟ ยอดขายแยกตามสินค้า</Typography>
                                </Grid>
                                <Grid item xs >
                                    <RadioGroup style={{ display: "flow-root", textAlign: "right", padding: 10 }} aria-label="typeChart" name="typeChart" value={value} onChange={handleChange} row>
                                        <FormControlLabel value="line" control={<Radio color="primary" />} label="กราฟเส้น" />
                                        <FormControlLabel value="bar" control={<Radio color="primary" />} label="กราฟแท่ง" />
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                            <Chart
                                height={325}
                                width={600}
                                data={itemsChart}
                            >
                                <ArgumentAxis tickFormat={formatChart} />
                                <ValueAxis />
                                {value === "line" ?
                                    <LineSeries name="คืนเงิน" valueField="costPrice" argumentField="date" seriesComponent={LineWithPoint} />
                                    :
                                    <BarSeries name="คืนเงิน" valueField="costPrice" argumentField="date" />
                                }

                            </Chart>
                        </Paper>
                    </Grid>
                </Grid>

                <Paper variant="outlined" style={{ marginTop: 20, boxShadow: 'none', }}  >
                    <MaterialTable
                        title="ภาพรวม ยอดขายตามสินค้า"
                        style={{
                            backgroundColor: 'white',
                            boxShadow: 'none'
                        }}
                        columns={[
                            { title: 'สินค้า', field: 'itemName' },
                            { title: 'หมวดหมู่', field: 'category' },
                            { title: 'คืนเงิน', field: 'refunds', type: "numeric" },
                            { title: 'จำนวน', field: 'amount', type: "numeric" },
                            { title: 'ราคาขายสุทธิ', field: 'sellPrice', type: "numeric" },
                            { title: 'ต้นทุน', field: 'costPrice', type: "numeric" },
                            { title: 'กำไรขั้นต้น', field: 'totalProfit', type: "numeric" },
                        ]}
                        data={itemRepoet.map(report => ({
                            itemName: report.item.name,
                            category: report.categoryId,
                            refunds: setNumberFormat(report.refundAmount),
                            amount: report.quantity,
                            sellPrice: setNumberFormat(report.sellPriceAmount),
                            costPrice: setNumberFormat(report.costPrice),
                            totalProfit: setNumberFormat(report.costOfGoods)
                        }))}
                        isLoading={loading}

                        options={{
                            search: false,

                            headerStyle: { fontWeight: 700 }

                        }}
                        components={{
                            Toolbar: props => (
                                <div style={{ color: '#1760AD', }}>
                                    <MTableToolbar {...props} />
                                </div>
                            ),
                            Container: props => props.children
                        }}
                    />
                </Paper>

            </SideMenu>

        </div>
    )
}
