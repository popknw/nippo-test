import { Grid, Paper, Typography, makeStyles } from '@material-ui/core'
import MaterialTable, { MTableToolbar } from 'material-table';
import React, { useState, useEffect } from 'react'
import NewLogin from '../../../services/NewLoginService';
import ReportsService from '../../../services/ReportsService';
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import SideMenu from '../main/SideMenu'

const useStyles = makeStyles(() => ({
    textAlignCenter: {
        textAlign: "center",

    }
}));

export default function TaxReport() {
    const classes = useStyles();
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const [loading, setLoading] = useState(false)
    const [taxOverView, setTaxOverView] = useState([])
    const [taxSummary, setTaxSummary] = useState([])

    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };
    const reportService = new ReportsService(localStorage.getItem('token'), { onError: handleError, onUnAuthorized: () => NewLogin() });

    useEffect(() => {
        setLoading(true)
        const getTaxOverViewReport = async () => {
            const res = await reportService.getTaxOverViewReport();
            if (!res) { return; }
            setTaxOverView(res)
            setLoading(false)
        }
        const getTaxSummaryReport = async () => {
            const res = await reportService.getTaxSummaryReport();
            if (!res) { return; }
            setTaxSummary(res)
            setLoading(false)
        }
        getTaxOverViewReport();
        getTaxSummaryReport();



    }, [])

    const setNumberFormat = (number) => {
        let f = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
        return f.format(number);
    }

    return (
        <div>
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <SideMenu>
                <Paper variant="outlined" style={{ padding: 20, boxShadow: 'none', }}  >
                    <Grid container spacing={3} >
                        <Grid item xs={4} className={classes.textAlignCenter}>
                            <Typography variant="caption">รายได้ที่ต้องเสียภาษี</Typography>
                            <Typography variant="h6">{setNumberFormat(taxSummary[0] ? taxSummary[0].totalAmount : 0.00)}</Typography>

                        </Grid>
                        <Grid item xs={4} className={classes.textAlignCenter}>
                            <Typography variant="caption">การขายที่ไม่ต้องเสียภาษี</Typography>
                            <Typography variant="h6">{setNumberFormat(taxSummary[0] ? taxSummary[0].costAmount : 0.00)}</Typography>
                        </Grid>
                        <Grid item xs={4} className={classes.textAlignCenter}>
                            <Typography variant="caption">ยอดขายรวมสุทธิ</Typography>
                            <Typography variant="h6">{setNumberFormat(taxSummary[0] ? taxSummary[0].summary : 0.00)}</Typography>
                        </Grid>
                    </Grid>


                </Paper>
                <Paper variant="outlined" style={{ marginTop: 20, boxShadow: 'none', }}  >
                    <MaterialTable
                        title="ภาพรวม ภาษี"
                        style={{
                            backgroundColor: 'white',
                            boxShadow: 'none'
                        }}
                        columns={[
                            { title: 'ชื่อภาษี', field: 'taxName' },
                            { title: 'อัตราภาษี(ร้อยละ)', field: 'taxRate' },
                            { title: 'รายได้ที่ต้องเสียภาษี', field: 'taxableIncome', },
                            { title: 'ยอดเงินภาษี', field: 'taxAmount' },
                        ]}
                        data={taxOverView.map((row) => ({
                            taxName: row.vatName,
                            taxRate: row.vatRate,
                            taxableIncome: setNumberFormat(row.totalAmount),
                            taxAmount: setNumberFormat(row.vatTotalAmount)
                        }))}

                        isLoading={loading}

                        options={{
                            search: false,
                            pageSize: 10,
                            headerStyle: { fontWeight: 700 },
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
