import { Grid, Paper, Typography, makeStyles, Divider, Container } from '@material-ui/core'
import MaterialTable, { MTableToolbar } from 'material-table';
import React, { useEffect, useState } from 'react'
import SideMenu from '../main/SideMenu'
import SectionFilter from './SectionFilter'
import ReportsService from '../../../services/ReportsService';
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import { format } from 'date-fns'
import NewLogin from '../../../services/NewLoginService';


import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    LineSeries,
    Legend,
    Title,
    ScatterSeries
} from '@devexpress/dx-react-chart-material-ui';
import { withStyles } from '@material-ui/core/styles';

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
const useStyles = makeStyles(() => ({
    testAlignCenter: {
        textAlign: "center"
    },
    chart: {
        paddingRight: '20px',
    },
}));


const legendStyles = () => ({
    root: {
        display: 'flex',
        margin: 'auto',
        flexDirection: 'row',
    },
});
const legendLabelStyles = theme => ({
    label: {
        paddingTop: theme.spacing(1),
        whiteSpace: 'nowrap',
    },
});
const legendItemStyles = () => ({
    item: {
        flexDirection: 'column',
    },
});

const legendRootBase = ({ classes, ...restProps }) => (
    <Legend.Root {...restProps} className={classes.root} />
);
const legendLabelBase = ({ classes, ...restProps }) => (
    <Legend.Label className={classes.label} {...restProps} />
);
const legendItemBase = ({ classes, ...restProps }) => (
    <Legend.Item className={classes.item} {...restProps} />
);
const Root = withStyles(legendStyles, { name: 'LegendRoot' })(legendRootBase);
const Label = withStyles(legendLabelStyles, { name: 'LegendLabel' })(legendLabelBase);
const Item = withStyles(legendItemStyles, { name: 'LegendItem' })(legendItemBase);

const titleStyles = {
    title: {
        whiteSpace: 'pre',
    },
};
const TitleText = withStyles(titleStyles)(({ classes, ...props }) => (
    <Title.Text {...props} className={classes.title} />
));

export default function SaleSummaryReport() {
    const classes = useStyles();
    const formatChart = () => tick => tick;
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    let f = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };
    const reportService = new ReportsService(localStorage.getItem('token'), { onError: handleError, onUnAuthorized: () => NewLogin() });

    const [salse, setsalse] = useState([])
    const [total, setTotal] = useState()


    const getSaleSummaryReport = async (queryParams) => {

        const res = await reportService.getSaleSummary(queryParams);
        if (!res) { return; }

        setsalse(res);
    }
    const getProfileSummary = async (queryParams) => {

        const res = await reportService.getProfileSummary(queryParams);
        if (!res) { return; }

        setTotal(res);
    }


    useEffect(() => {
        const now = new Date();
        const dateNow = format(now, "yyyy-MM-dd")
        const queryParams = {
            start: `${dateNow} 00:00:00`,
            end: format(now, "yyyy-MM-dd HH:mm:ss"),
            userId: ""
        };
        getSaleSummaryReport(queryParams);
        getProfileSummary(queryParams);
    }, [])

    const setNumberFormat = (number) => {
        return f.format(number);
    }

    return (
        <div>
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />

            <SideMenu license={false}>
                <SectionFilter onSubmitFilter={(queryParams) => { getSaleSummaryReport(queryParams); getProfileSummary(queryParams); }} />
                <Paper variant="outlined" style={{ marginTop: 20 }} >
                    <Grid container style={{ padding: 10 }} >
                        <Grid item xs={12} sm className={classes.testAlignCenter}>
                            <Typography>ยอดขายรวม</Typography>
                            <Typography>{f.format(total?.totalAmount ?? 0.00)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm className={classes.testAlignCenter}>
                            <Typography>คืนเงิน</Typography>
                            <Typography>{f.formattotal?.refundAmount ?? 0.00}</Typography>
                        </Grid>
                        <Grid item xs={12} sm className={classes.testAlignCenter}>
                            <Typography>ส่วนลด</Typography>
                            <Typography>{f.format(total?.discountAmount ?? 0.00)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm className={classes.testAlignCenter}>
                            <Typography>ราคาขายสุทธิ</Typography>
                            <Typography>{f.format(total?.costAmount ?? 0.00)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm className={classes.testAlignCenter}>
                            <Typography>กำไรรวม</Typography>
                            <Typography>{f.format(total?.profit ?? 0.00)}</Typography>

                        </Grid >
                    </Grid>
                    <Grid container >
                        <Grid item xs={12} sm={12}> <Divider light /></Grid>
                    </Grid>
                    <Grid container >
                        <Grid item xs={12} sm={12}>

                            <Chart
                                data={salse}
                            >
                                <ArgumentAxis tickFormat={formatChart} />
                                <ValueAxis />

                                <LineSeries name="ยอดขายรวม" valueField="totalAmount" argumentField="date" seriesComponent={LineWithPoint} />
                                <LineSeries name="คืนเงิน" valueField="refundAmount" argumentField="date" seriesComponent={LineWithPoint} />
                                <LineSeries name="ส่วนลด" valueField="discountAmount" argumentField="date" seriesComponent={LineWithPoint} />
                                <LineSeries name="ราคาขายสุทธิ" valueField="costAmount" argumentField="date" seriesComponent={LineWithPoint} />
                                <LineSeries name="กำไรรวม" valueField="profit" argumentField="date" seriesComponent={LineWithPoint} />
                                <Legend position="bottom" rootComponent={Root} itemComponent={Item} labelComponent={Label} />
                            </Chart>
                        </Grid>
                    </Grid>

                </Paper>

                <Paper variant="outlined" style={{ marginTop: 20 }}  >
                    <MaterialTable
                        title="หน้าสรุปยอดขาย"
                        style={{

                            backgroundColor: 'white',
                            boxShadow: 'none',

                        }}
                        columns={[
                            { title: 'วันที่', field: 'dateTime' },
                            { title: 'ยอดขายรวม', field: 'totalAmount' },
                            { title: 'คืนเงิน', field: 'refunds', },
                            { title: 'ส่วนลด', field: 'discount' },
                            { title: 'ราคาขายสุทธิ', field: 'netPrices' },
                            { title: 'กำไรรวม', field: 'totalProfit' },
                        ]}
                        data={salse.map(report => ({
                            dateTime: report.date,
                            totalAmount: setNumberFormat(report.totalAmount),
                            refunds: setNumberFormat(report.refundAmount),
                            discount: setNumberFormat(report.discountAmount),
                            netPrices: setNumberFormat(report.costAmount),
                            totalProfit: setNumberFormat(report.profit),
                        }))}

                        options={{
                            search: false,
                            pageSize: 5,
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
