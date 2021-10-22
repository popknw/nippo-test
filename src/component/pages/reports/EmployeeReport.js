import { Paper } from '@material-ui/core'
import MaterialTable, { MTableToolbar } from 'material-table'
import React, { useState, useEffect } from 'react'
import SideMenu from '../main/SideMenu'
import SectionFilter from './SectionFilter'
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import ReportsService from '../../../services/ReportsService'
import { format } from 'date-fns'
import NewLogin from '../../../services/NewLoginService'

export default function EmployeeReport() {
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const [loading, setLoading] = useState(false);
    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };
    const reportService = new ReportsService(localStorage.getItem('token'), { onError: handleError, onUnAuthorized: () => NewLogin() });

    const [employeeReport, setEmployeeReport] = useState([])

    const getEmployeeReport = async (queryParams) => {
        setLoading(true)

        const res = await reportService.getEmployeeReport(queryParams);
        if (!res) {
            setLoading(false)
            return;
        }

        setEmployeeReport(res);
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
        getEmployeeReport(queryParams);
    }, [])
    const setNumberFormat = (number) => {
        let f = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
        return f.format(number);
    }
    return (
        <div>
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <SideMenu>
                <SectionFilter onSubmitFilter={(queryParams) => getEmployeeReport(queryParams)} />
                <Paper variant="outlined" style={{ marginTop: 20, boxShadow: 'none', }}  >
                    <MaterialTable
                        title="ภาพรวม ยอดขาย แยกตาม พนักงาน"
                        style={{
                            backgroundColor: 'white',
                            boxShadow: 'none'
                        }}
                        columns={[
                            { title: 'พนักงาน', field: 'name' },
                            { title: 'ยอดขายรวม', field: 'totalAmount', type: "numeric" },
                            { title: 'คืนเงิน', field: 'refunds', type: "numeric" },
                            { title: 'จำนวน', field: 'amount', type: "numeric" },
                            { title: 'ราคาขายสุทธิ', field: 'netPrices', type: "numeric" },
                            { title: 'ต้นทุน', field: 'costPrice', type: "numeric" },
                            { title: 'กำไรขั้นต้น', field: 'totalProfit', type: "numeric" },
                        ]}
                        data={employeeReport.map(report => ({
                            name: report.user.firstName + " " + report.user.lastName,
                            totalAmount: setNumberFormat(report.totalAmount),
                            refunds: setNumberFormat(report.refundAmount),
                            amount: report.quantity,
                            netPrices: setNumberFormat(report.sellPriceAmount),
                            costPrice: setNumberFormat(report.costAmount),
                            totalProfit: setNumberFormat(report.costOfGoods)
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
