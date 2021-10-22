import { Paper } from '@material-ui/core'
import MaterialTable, { MTableToolbar } from 'material-table'
import React, { useState, useEffect } from 'react'
import SideMenu from '../main/SideMenu'
import SectionFilter from './SectionFilter'
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import ReportsService from '../../../services/ReportsService'
import { format } from 'date-fns'
import NewLogin from '../../../services/NewLoginService'

export default function PaymentReport() {
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };
    const reportService = new ReportsService(localStorage.getItem('token'), { onError: handleError, onUnAuthorized: () => NewLogin() });

    const [paymentReport, setPaymentReport] = useState([])
    const [loading, setLoading] = useState(false)

    const getPaymentReport = async (queryParams) => {
        setLoading(true)
        const res = await reportService.getPaymentReport(queryParams);
        if (!res) {
            setLoading(false)
            return;
        }

        setPaymentReport(res);
        setLoading(false);
    }

    useEffect(() => {

        const now = new Date();
        const dateNow = format(now, "yyyy-MM-dd")
        const queryParams = {
            start: `${dateNow} 00:00:00`,
            end: format(now, "yyyy-MM-dd HH:mm:ss"),
            userId: ""
        };
        getPaymentReport(queryParams);
    }, [])
    const setNumberFormat = (number) => {
        let f = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
        return f.format(number);
    }

    function getTextTypename(type) {
        if (type === 'cash') { return 'เงินสด' }
        if (type === 'credit') { return 'เครดิต' }
        if (type === 'credit_card') { return 'บัตรเครดิต' }
        return 'อื่นๆ'
    }
    return (
        <div>
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <SideMenu>
                <SectionFilter onSubmitFilter={(queryParams) => getPaymentReport(queryParams)} />
                <Paper variant="outlined" style={{ marginTop: 20, boxShadow: 'none', }}  >
                    <MaterialTable
                        title="ภาพรวม ยอดขาย แยกตาม พนักงาน"
                        style={{
                            backgroundColor: 'white',
                            boxShadow: 'none'
                        }}
                        columns={[
                            { title: 'ประเภทการชำระ', field: 'paymentType' },
                            { title: 'จำนวน(ครั้ง)', field: 'totalQuantity', type: "numeric" },
                            { title: 'ยอดรวม', field: 'totalAmount', type: "numeric" }


                        ]}
                        data={paymentReport.map(report => ({
                            paymentType: getTextTypename(report.type),
                            totalQuantity: Intl.NumberFormat().format(report.quantity),
                            totalAmount: setNumberFormat(report.amount),
                        }))}
                        isLoading={loading}
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
