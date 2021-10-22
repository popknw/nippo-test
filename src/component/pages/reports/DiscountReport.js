import { Paper } from '@material-ui/core'
import MaterialTable, { MTableToolbar } from 'material-table'
import React, { useEffect, useState } from 'react'
import ReportsService from '../../../services/ReportsService'
import SideMenu from '../main/SideMenu'
import SectionFilter from './SectionFilter'
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import { format } from 'date-fns'
import NewLogin from '../../../services/NewLoginService'


export default function DiscountReport() {
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };
    const reportService = new ReportsService(localStorage.getItem('token'), { onError: handleError, onUnAuthorized: () => NewLogin() });
    const [loading, setLoading] = useState(false);
    const [discountReport, setDiscountReport] = useState([])

    const getDiscountReport = async (queryParams) => {
        setLoading(true)
        const res = await reportService.getDiscountReport(queryParams);
        if (!res) {
            setLoading(false)
            return;
        }
        setDiscountReport(res);
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
        getDiscountReport(queryParams);
    }, [])

    const setNumberFormat = (number) => {
        let f = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
        return f.format(number);
    }
    return (
        <div>
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <SideMenu>
                <SectionFilter onSubmitFilter={(queryParams) => getDiscountReport(queryParams)} />
                <Paper variant="outlined" style={{ marginTop: 20, boxShadow: 'none', }}  >
                    <MaterialTable
                        title="ภาพรวม ส่วนลด"
                        style={{
                            backgroundColor: 'white',
                            boxShadow: 'none'
                        }}
                        columns={[
                            { title: 'ชื่อส่วนลด', field: 'discountName' },
                            { title: 'จำนวน(ครั้ง)', field: 'totalQuantity', type: "numeric" },
                            { title: 'ยอดรวม', field: 'totalAmount', type: "numeric" },

                        ]}
                        data={discountReport.map(report => ({
                            discountName: report.discount.code,
                            totalQuantity: report.quantity,
                            totalAmount: setNumberFormat(report.totalAmount),
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
