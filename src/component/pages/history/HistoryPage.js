import React, { useEffect, useState } from 'react';
import {
    Grid,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import jwt from 'jwt-decode';
import MaterialTable from 'material-table'
import DateFnsUtils from '@date-io/date-fns';
import ReportsService from '../../../services/ReportsService';
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import SiddeMenu from '../main/SideMenu';
import history from '../../../history';
import LoginService from '../../../services/LoginService';
import { dataTableService } from '../../../services';
import CircularProgress from '@material-ui/core/CircularProgress';
import NewLogin from '../../../services/NewLoginService';



var dateFormat = require('dateformat');
export default function HistoryPage() {
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const [loading, setLoading] = useState(false);

    const [licenseExpired, setLicenseExpired] = useState(false);
    const [listAuthLogs, setAuthLogs] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());

    const authorized = (e) => {
        if (e.response.data.error === 'กรุณาขยายสิทธิ์การใช้งานเพื่อใช้ฟังก์ชันนี้') {
            setLicenseExpired(true);
            showMessage(e.response.data.error, 'error');
        }
        NewLogin();
    };

    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };
    const token = localStorage.getItem('token');
    const reportsService = new ReportsService(token, { onError: handleError, onUnAuthorized: authorized });
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

    const UserLog = async () => {
        setLoading(true);
        const res = await reportsService.getUserLog();
        if (!res) {
            return;
        }
        setAuthLogs(res);
        setLoading(false);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };
    const handleEndDateChange = (date) => {
        setEndDate(date);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const filterFormDialog = () => {

        const days = dataTableService.dateFilter(startDate, endDate, listAuthLogs, 'createdAt');
        console.log(days);
        setAuthLogs(days);
        handleClose();
    }
    const getTextEventType = (data) => {

        if (data === 'login') {
            return 'เข้าระบบ';
        }
        if (data === 'logout')
            return "ออกระบบ";

    }


    useEffect(() => {
        const user = jwt(token);
        setLicenseExpired(user.licenseExpired);
        UserLog();
    }, []);

    const dataRow = listAuthLogs.map((log) => {
        return {
            dateTime: dateFormat((log.createdAt), 'dd/mm/yyyy HH:MM'),
            lodType: getTextEventType(log.eventType),
            email: log.eventData.email,
            cash: log.cashBalance,
            credit: log.creditBalance,
            creditCard: log.creditCardBalance
        }
    });

    return (
        <SiddeMenu title={'ประวัติข้อมูล'} license={licenseExpired}>
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <Grid container justify="flex-end" spacing={2}>
                <Grid item xs={12}>
                    <MaterialTable
                        title="ประวัติข้อมูล"
                        columns={[
                            { title: 'วันที่/เวลา', field: 'dateTime' },
                            { title: 'ประเภท', field: 'lodType' },
                            { title: 'อีเมล', field: 'email', align: 'center' },
                            { title: 'เงินสด', field: 'cash', type: 'numeric' },
                            { title: 'เครดิต', field: 'credit', type: 'numeric' },
                            { title: 'บัตรเครดิต', field: 'creditCard', type: 'numeric' },

                        ]}
                        data={dataRow}
                        actions={[
                            {
                                icon: 'filter_list',
                                tooltip: 'กรองข้อมูล',
                                isFreeAction: true,
                                onClick: (event) => handleClickOpen()
                            },
                            {
                                icon: 'refresh',
                                tooltip: 'รีเฟรช',
                                isFreeAction: true,
                                onClick: (event) => UserLog()
                            }
                        ]}
                        options={{
                            pageSize: 10,
                            actionsColumnIndex: -1,
                            search: true,
                            searchFieldVariant: 'outlined',
                            searchFieldStyle: { height: 40 },
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
            <Dialog
                onClose={handleClose}
                open={open}
                scroll="body"
                fullWidth
                maxWidth="sm"
                aria-labelledby="max-width-dialog-title">
                <DialogTitle id="max-width-dialog-title">ตัวกรอง</DialogTitle>
                <DialogContent dividers={false}>
                    <Grid container spacing={3} >
                        <Grid item xs={6} >
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    format="dd/MM/yyyy"
                                    id="date-picker-dialog"
                                    fullWidth
                                    label="เริ่ม"
                                    inputVariant="outlined"
                                    onChange={handleStartDateChange}
                                    value={startDate}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={6}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    format="dd/MM/yyyy"
                                    id="date-picker-dialog"
                                    inputVariant="outlined"
                                    fullWidth
                                    size
                                    label="สิ้นสุด"
                                    onChange={handleEndDateChange}
                                    value={endDate}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={handleClose}>
                        ยกเลิก
                    </Button>
                    <Button color="primary" onClick={filterFormDialog} >
                        ตกลง
                    </Button>
                </DialogActions>
            </Dialog>
        </SiddeMenu>
    );
}
