import React, { useEffect, useState } from 'react';
import AlertMessage, { useAlertMessage } from '../../../AlertMessage';
import history from '../../../../history';
import MaterialTable from 'material-table'
import { Button, Chip, Grid } from '@material-ui/core';
import jwt from 'jwt-decode';
import swal from 'sweetalert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ImportExport } from '@material-ui/icons';
import StockService from '../../../../services/StockService';
import SideMenu from '../../main/SideMenu';
import { RouteName } from '../../../../models/route_name';
import NewLogin from '../../../../services/NewLoginService';


var dateFormat = require('dateformat');
export default function AdjustmentStockPage() {
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const [loading, setLoading] = useState(false);

    const [itemStock, setItemStock] = useState([]);

    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };

    const stockService = new StockService(localStorage.getItem('token'), { onError: handleError, onUnAuthorized: () => NewLogin() });
    const [licenseExpired, setLicenseExpired] = useState(false);



    const LodeStockAdjustment = async () => {
        setLoading(true);
        const res = await stockService.getStockAdjustment();
        if (!res) {
            return;
        }
        console.log(res);
        setItemStock(res);
        setLoading(false);
    };

    const cancelAdjustment = async (rowData) => {
        const res = await stockService.cancelAdjustment(rowData.adjId);
        if (!res) {
            return;
        }
        swal(`ยกเลิกใบปรับสต๊อก หมายเลข ${rowData.number} เรียบร้อย`, {
            icon: "success",
        });
        LodeStockAdjustment();
    };

    useEffect(() => {
        const user = jwt(localStorage.getItem('token'));
        setLicenseExpired(user.licenseExpired);

        LodeStockAdjustment();
    }, []);

    const dataRow = itemStock.map(item => {
        return {
            adjId: item.id,
            transactions: item.transactions,
            number: `${item.number}`,
            dateTime: `${dateFormat((item.cancelledByUserId ? item.cancelledAt : item.adjustedAt), 'dd/mm/yyyy HH:MM')}`,
            amount: `${item.transactions.length}`,
            stockType: `${item.status === 'cancelled' ? 'ยกเลิก' : 'ADJUST'}`,
            user: item.adjustedByUserId,
        }
    });

    return (
        <SideMenu title={'ปรับสต๊อก'} license={licenseExpired} >
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <Grid container spacing={3} justify="flex-end">

                <Grid item xs={12}>
                    <MaterialTable
                        title="รายการปรับสต๊อก"
                        columns={[
                            { title: 'วันที่/เวลา', field: 'dateTime' },
                            { title: 'ใบปรับสต๊อก', field: 'number' },
                            { title: 'จำนวนรายการสินค้า', field: 'amount', align: 'center' },
                            {
                                title: 'ประเภท', field: 'stockType', align: 'center', render: rowData => <Chip
                                    label={rowData.stockType}
                                    style={{
                                        color: rowData.stockType === 'ยกเลิก' ? "rgba(255,0,0,1)" : "rgba(181,123,255,1)",
                                        border: rowData.stockType === 'ยกเลิก' ? "1px solid rgba(255,0,0,1)" : "1px solid rgba(181,123,255,1)",
                                        backgroundColor: rowData.stockType == 'ยกเลิก' ? "rgba(255,0,0,0.2)" : "rgba(181,123,255,0.2)",
                                    }}
                                    size="large" />
                            },
                        ]}
                        data={dataRow}
                        onRowClick={(event, rowData) => history.push(RouteName.ADJUSTMENT_TRANSACTION, {
                            transactions: rowData.transactions,
                            page: 'adjustment',
                            number: rowData.number,
                            dateTime: rowData.dateTime,
                            user: rowData.user
                        })}

                        options={{
                            actionsColumnIndex: -1,
                            pageSize: 10,
                            pageSizeOptions: [5, 10, 25, 50, 100],
                            search: true,
                            searchFieldVariant: 'outlined',
                            searchFieldStyle: { height: 40 },
                            showTitle: false,
                            toolbarButtonAlignment: "left",
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
                        actions={[
                            {
                                isFreeAction: true,
                                icon: 'add',
                                tooltip: 'export'
                            },

                            {
                                icon: 'edit',
                                tooltip: 'Edit Index',
                                onClick: (event, rowData) => {
                                    event.stopPropagation();
                                    swal({
                                        title: `ต้องการยกเลิกใบปรับสต๊อก หมายเลข ${rowData.number} `,
                                        text: "การยกเลิกใบปรับสต๊อกไม่สามารถเรียกกลับคืนได้",
                                        icon: "warning",
                                        buttons: ['ยกเลิก', 'ตกลง'],
                                        dangerMode: true,
                                    })
                                        .then((willDelete) => {
                                            if (willDelete) {
                                                cancelAdjustment(rowData)
                                            }
                                        });
                                }
                            },

                        ]}

                        components={{
                            Action: props => {
                                if (props.action.icon === "edit") {
                                    return <Button size="small"
                                        style={{
                                            color: "rgba(255,0,0,1)",
                                            border: "1px solid rgba(255,0,0,1)",
                                            backgroundColor: "rgba(255,0,0,0.2)",
                                            width: '60px', height: '35px',
                                            margin: ' 5px'
                                        }}
                                        disabled={props.data.stockType === 'ยกเลิก'}
                                        onClick={(event) => props.action.onClick(event, props.data)}
                                    >
                                        ยกเลิก
                                    </Button>
                                } else {
                                    return <Button
                                        variant="contained"
                                        size="large"
                                        color="primary"
                                        startIcon={<ImportExport />}
                                        onClick={() => history.push(RouteName.ADJUSTMENT_ITEMS)}
                                    >Adjustments</Button>
                                }
                            },


                        }}

                    />
                </Grid>
            </Grid>


        </SideMenu>
    );

}
