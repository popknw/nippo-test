import { Paper, Chip } from '@material-ui/core'
import MaterialTable, { MTableToolbar } from 'material-table'
import React, { useState, useEffect } from 'react'
import SideMenu from '../main/SideMenu'
import SectionFilter from './SectionFilter'
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import ReportsService from '../../../services/ReportsService'
import { format } from 'date-fns'
import NewLogin from '../../../services/NewLoginService'

export default function ReceiptReport() {
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };
    const reportService = new ReportsService(localStorage.getItem('token'), { onError: handleError, onUnAuthorized: () => NewLogin() });

    const [receiptReport, setReceiptReport] = useState([])
    const [loading, setLoading] = useState(false)

    const getReceiptReport = async (queryParams) => {
        setLoading(true)
        const res = await reportService.getReceiptReport(queryParams);
        if (!res) { return; }

        setReceiptReport(res);
        setLoading(false)
    }

    useEffect(() => {
        const now = new Date();
        const dateNow = format(now, "yyyy-MM-dd")
        const queryParams = {
            start: `${dateNow} 00:00:00`,
            end: format(now, "yyyy-MM-dd HH:mm:ss"),
            userId: ""
        };
        getReceiptReport(queryParams);
    }, [])

    const getStatusBackgroundColor = (report) => {
        if (report.status === 'paid') {
            if (report.paymentType === "cash") {
                return "rgba(82,198,26,0.2)"
            }
            if (report.paymentType === "credit_card") {
                return "rgba(181,123,255,0.2)"
            }
        }
        if (report.status === 'credit') {
            return "rgba(24,144,255,0.2)";
        }
        if (report.status === 'fully_refunded') {
            return 'rgba(250,173,20,0.2)';

        }
        return 'rgba(250,173,20,0.2)';
    }
    const getTextColor = (report) => {
        if (report.status === 'paid') {
            if (report.paymentType === "cash") {
                return "rgba(82,198,26,1)"
            }
            if (report.paymentType === "credit_card") {
                return "rgba(181,123,255,1)"
            }
        }
        if (report.status === 'credit') {
            return "rgba(24,144,255,1)";
        }
        if (report.status === 'fully_refunded') {
            return 'rgba(250,173,20,1)';

        }
        return 'rgba(250,173,20,1)';

    }
    const getBorderColor = (report) => {
        if (report.status == 'paid') {
            if (report.paymentType === "cash") {
                return "1px solid rgba(82,198,26,1)"
            }
            if (report.paymentType === "credit_card") {
                return "1px solid rgba(181,123,255,1)"
            }
        }
        if (report.status === 'credit') {
            return "1px solid rgba(24,144,255,1)";
        }
        if (report.status === 'fully_refunded') {
            return '1px solid rgba(250,173,20,1)';

        }
        return '1px solid rgba(250,173,20,1)';

    }
    const getStatusText = (report) => {
        if (report.status == 'paid') {
            if (report.paymentType === "cash") {
                return "เงินสด"
            }
            if (report.paymentType === "credit_card") {
                return "บัตรเครดิต"
            }
        }

        if (report.status === 'credit') {
            return "เครดิต";
        }
        if (report.status === 'fully_refunded') {
            return "คืนเงินแล้ว";
        }





        return 'คืนเงินบางส่วน';
    }

    const setNumberFormat = (number) => {
        let f = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
        return f.format(number);
    }
    return (
        <div>
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <SideMenu>
                <SectionFilter onSubmitFilter={(queryParams) => getReceiptReport(queryParams)} />
                <Paper variant="outlined" style={{ marginTop: 20, boxShadow: 'none', }}  >
                    <MaterialTable
                        title="ภาพรวม ใบเสร็จรับเงิน"
                        style={{
                            backgroundColor: 'white',
                            boxShadow: 'none'
                        }}
                        columns={[
                            { title: 'เลขที่', field: 'number' },
                            { title: 'วันที่', field: 'date' },
                            { title: 'พนักงาน', field: 'employee', },
                            { title: 'ลูกค้า', field: 'customer' },
                            {
                                title: 'ประเภท', field: 'paymentType', render: rowData => <Chip
                                    label={getStatusText(rowData.report)}
                                    size="medium"
                                    style={{
                                        paddingLeft: 5, paddingRight: 5,
                                        backgroundColor: getStatusBackgroundColor(rowData.report),
                                        color: getTextColor(rowData.report),
                                        border: getBorderColor(rowData.report),
                                    }} />
                            },
                            { title: 'ยอด', field: 'totalAmount' },

                        ]}
                        data={receiptReport.map(report => ({
                            report: report,
                            number: report.id,
                            date: format(new Date(report.createdAt), "dd/MM/yyyy"),
                            employee: report.user.firstName + " " + report.user.lastName,
                            customer: report.customerId ?? "-",
                            paymentType: report.paymentType,
                            totalAmount: setNumberFormat(report.totalAmount)
                        }))}
                        isLoading={loading}
                        options={{
                            search: false,
                            pageSize: 10,
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
