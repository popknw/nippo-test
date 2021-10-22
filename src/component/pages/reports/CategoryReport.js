import { Paper } from '@material-ui/core'
import MaterialTable, { MTableToolbar } from 'material-table'
import React, { useState, useEffect } from 'react'
import SideMenu from '../main/SideMenu'
import SectionFilter from './SectionFilter'
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import ReportsService from '../../../services/ReportsService'
import { format } from 'date-fns'
import NewLogin from '../../../services/NewLoginService'

export default function CategoryReport() {
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };
    const reportService = new ReportsService(localStorage.getItem('token'), { onError: handleError, onUnAuthorized: () => NewLogin() });
    const [loading, setLoading] = useState(false);
    const [categoryReport, setCategoryReport] = useState([])

    const getCategoryReport = async (queryParams) => {
        setLoading(true)
        const res = await reportService.getCategoryReport(queryParams);
        if (!res) { return; }

        setCategoryReport(res);
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

        getCategoryReport(queryParams);
    }, [])

    const setNumberFormat = (number) => {
        let f = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
        return f.format(number);
    }
    return (
        <div>
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <SideMenu>
                <SectionFilter onSubmitFilter={(value) => getCategoryReport(value)}
                />
                <Paper variant="outlined" style={{ marginTop: 20, boxShadow: 'none', }}  >
                    <MaterialTable
                        title="ภาพรวม ยอดขาย แยกตาม หมวดหมู่"
                        style={{
                            backgroundColor: 'white',
                            boxShadow: 'none'
                        }}
                        columns={[
                            { title: 'สินค้า', field: 'itemName' },
                            { title: 'หมวดหมู่', field: 'category' },
                            { title: 'คืนเงิน', field: 'refunds', type: "numeric" },
                            { title: 'จำนวน', field: 'amount', type: "numeric" },
                            { title: 'ราคาขายสุทธิ', field: 'netPrices', type: "numeric" },
                            { title: 'ต้นทุน', field: 'costPrice', type: "numeric" },
                            { title: 'กำไรขั้นต้น', field: 'totalProfit', type: "numeric" },
                        ]}
                        data={categoryReport.map(report => ({
                            itemName: report.item.name,
                            category: report.category.name,
                            refunds: setNumberFormat(report.refundAmount),
                            amount: report.quantity,
                            netPrices: setNumberFormat(report.sellPriceAmount),
                            costPrice: setNumberFormat(report.costPrice),
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
