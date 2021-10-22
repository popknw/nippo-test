import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import StockService from '../../../services/StockService';
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import SiddeMenu from '../main/SideMenu';
import history from '../../../history';
import LoginService from '../../../services/LoginService';
import jwt from 'jwt-decode';
import MaterialTable from 'material-table'
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DateFnsUtils from '@date-io/date-fns';
import BaseService from '../../../services/BaseService';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import CircularProgress from '@material-ui/core/CircularProgress';
import NewLogin from '../../../services/NewLoginService';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));
var dateFormat = require('dateformat');
export default function StockCardPage() {
    const classes = useStyles();
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const [loading, setLoading] = useState(false);
    const [licenseExpired, setLicenseExpired] = useState(false);
    const [listItemsStockTransactions, setListItemsStockTransactions] = useState([]);
    const authorized = (e) => {
        if (e.response.data.error === 'กรุณาขยายสิทธิ์การใช้งานเพื่อใช้ฟังก์ชันนี้') {
            setLicenseExpired(true);
            showMessage(e.response.data.error, 'error');
        }
        NewLogin()
    };

    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };

    const loginService = new LoginService('', { onError: handleError, onUnAuthorized: authorized });

    const login = async (data) => {
        const res = await loginService.login(data);
        if (!res) {
            history.push('/');
            return;
        }
        localStorage.removeItem('token');
        localStorage.setItem('token', res.token);
    };

    const token = localStorage.getItem('token');
    const stockService = new StockService(token, { onError: handleError, onUnAuthorized: authorized });

    const fetchStockTransactions = async () => {
        setLoading(true);
        const res = await stockService.getStockTransactions();
        if (!res) {
            return;
        }
        setListItemsStockTransactions(res);
        setLoading(false);
    };


    useEffect(() => {
        const user = jwt(token);
        setLicenseExpired(user.licenseExpired);

        fetchStockTransactions();
    }, []);


    function getRefNumber(transaction) {
        const map = {
            'adjustment': transaction.stockAdjustmentId,
            'export': transaction.stockExportId,
            'export_cancelled': transaction.stockExportId,
            'import': transaction.stockImportId,
            'import_cancelled': transaction.stockImportId,
            'refund': transaction.orderId,
            'sale': transaction.orderId,
        };

        return map[transaction.type] ?? 'ไม่มีข้อมูล';
    }

    function translateType(transactionType) {
        const map = {
            'adjustment': 'ปรับสต็อค',
            'export': 'เบิกสินค้า',
            'export_cancelled': 'ยกเลิกเบิกสินค้า',
            'import': 'นำเข้าสินค้า',
            'import_cancelled': 'ยกเลิกนำเข้า',
            'refund': 'คืนเงิน',
            'sale': 'ขาย',
        };
        return map[transactionType] ?? '';
    }


    const rowData = listItemsStockTransactions.map(row => {
        return {
            dateTime: dateFormat((row.createdAt), 'dd/mm/yyyy HH:MM'),
            tarnsId: `${row.id}`,
            name: row.item.name,
            refNo: getRefNumber(row),
            transType: translateType(row.type),
            quantity: row.quantity,
            unit: row.unit === 'pcs' ? 'ชิ้น' : 'กิโลกรัม',
            user: `${row.user.firstName + ' ' + row.user.lastName}`,


        }
    });


    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };
    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const fetchTransactions = async () => {
        if (licenseExpired) {
            setListItemsStockTransactions([]);
            return;
        }
        const transactions = await stockService.getStockTransactions({
            dateFrom: BaseService.toApiDateFormat(startDate),
            dateTo: BaseService.toApiDateFormat(endDate),
        });
        if (!transactions) {
            return;
        }
        setListItemsStockTransactions(transactions);
    };

    return (
        <SiddeMenu title={'รายการเคลื่อนไหวสินค้า'} license={licenseExpired}>
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <Grid container justify="flex-end" spacing={2}>
                <Grid item xs={12}>
                    <MaterialTable
                        columns={[
                            { title: 'วันที่/เวลา', field: 'dateTime' },
                            { title: 'รหัส', field: 'tarnsId' },
                            { title: 'ชื่อสินค้า', field: 'name', },
                            { title: 'เลขที่อ้างอิง', field: 'refNo', align: 'center' },
                            { title: 'ประเภท', field: 'transType', align: 'center' },
                            { title: 'จำนวน', field: 'quantity', align: 'right' },
                            { title: 'หน่วย', field: 'unit', align: 'center' },
                            { title: 'ผู้ใช้', field: 'user', align: 'center' },
                        ]}
                        data={rowData}
                        title="Demo Title"
                        actions={[
                            {
                                icon: 'filter_list',
                                isFreeAction: true,
                                tooltip: 'ตัวกรอง',
                                onClick: () => handleClickOpen()

                            },
                            {
                                icon: 'refresh',
                                isFreeAction: true,
                                tooltip: 'รีเฟรช',
                                onClick: () => fetchStockTransactions()

                            }
                        ]}
                        options={{
                            showTitle: false,
                            search: true,
                            searchFieldVariant: 'outlined',
                            searchFieldStyle: { height: 40 },
                            pageSize: 10,
                            headerStyle: { position: 'sticky', top: 0, fontWeight: 700 },
                        }}
                        localization={{
                            body: {
                                emptyDataSourceMessage: loading ? (<CircularProgress />) : 'ไม่มีข้อมูล'
                            },
                            toolbar: {
                                searchPlaceholder: 'ค้นหา'
                            },
                            header: {
                                actions: 'ตัวเลือก',

                            },
                        }}
                    />

                </Grid>
            </Grid>
            <Dialog onClose={handleClose} open={open}>
                <DialogContent>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="space-evenly">
                            <Grid className={classes.grid_margin}>
                                <KeyboardDatePicker
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    format="dd/MM/yyyy"
                                    id="date-picker-dialog"
                                    label="เริ่ม"
                                    margin="normal"
                                    onChange={handleStartDateChange}
                                    value={startDate}
                                />
                            </Grid>
                            <Grid item xs>
                                <KeyboardDatePicker
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    format="dd/MM/yyyy"
                                    id="date-picker-dialog"
                                    label="สิ้นสุด"
                                    margin="normal"
                                    onChange={handleEndDateChange}
                                    value={endDate}
                                />
                            </Grid>
                        </Grid>
                    </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={handleClose}>
                        ยกเลิก
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => {
                            fetchTransactions();
                            handleClose();
                        }}
                    >
                        ตกลง
                    </Button>
                </DialogActions>
            </Dialog>
        </SiddeMenu>
    );
}
