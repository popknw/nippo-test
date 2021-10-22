import React, { useEffect, useState } from 'react';
import AlertMessage, { useAlertMessage } from '../../../AlertMessage';
import { Button, Chip, Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import MaterialTable from 'material-table'
import swal from 'sweetalert';
import jwt from 'jwt-decode';
import { ImportExport } from '@material-ui/icons';
import { RouteName } from '../../../../models/route_name';
import StockService from '../../../../services/StockService';
import SideMenu from '../../main/SideMenu';
import history from '../../../../history';
import NewLogin from '../../../../services/NewLoginService';


var dateFormat = require('dateformat');

export default function ImportStock() {
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const [loading, setLoading] = useState(false);

    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };

    const token = localStorage.getItem('token');
    const stockService = new StockService(token, { onError: handleError, onUnAuthorized: () => NewLogin() });
    const [licenseExpired, setLicenseExpired] = useState(false);
    const [itemStock, setItemStock] = useState([]);

    const LodeStockImports = async () => {
        setLoading(true);
        const res = await stockService.getStockImports();
        if (!res) {
            return;
        }

        setItemStock(res.map((item) => {
            return { ...item, selected: false };
        }));
        setLoading(false);
    };
    const cancelStockImport = async (rowData) => {
        const res = await stockService.cancelImport(rowData.impId);
        if (!res) {
            return;
        }
        swal(`ยกเลิกใบนำเข้า หมายเลข ${rowData.number} เรียบร้อย`, {
            icon: "success",
        });
        LodeStockImports();

    };


    useEffect(() => {
        const user = jwt(token);
        setLicenseExpired(user.licenseExpired);

        LodeStockImports();

    }, []);
    const dataRow = itemStock.map(item => {
        return {
            impId: item.id,
            transactions: item.transactions,
            number: `${item.number}`,
            dateTime: `${dateFormat((item.importedAt), 'dd/mm/yyyy HH:MM')}`,
            amount: `${item.transactions.length}`,
            stockType: `${item.status === 'cancelled' ? 'ยกเลิก' : 'นำเข้าสินค้า'}`,
            user: item.importedByUserId
        }
    });

    return (
        <SideMenu license={licenseExpired} >
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <Grid container spacing={3} justify="flex-end">
                <Grid item xs={12}>
                    <MaterialTable
                        title="รายการนำเข้าสินค้า"
                        columns={[
                            { title: 'วันที่/เวลา', field: 'dateTime' },
                            { title: 'ใบนำเข้าสินค้า', field: 'number' },
                            { title: 'จำนวนรายการสินค้า', field: 'amount', align: 'center' },
                            {
                                title: 'ประเภท', field: 'stockType', align: 'center', render: rowData => <Chip
                                    label={rowData.stockType}
                                    style={{
                                        paddingLeft: 5, paddingRight: 5,
                                        backgroundColor: rowData.stockType === 'ยกเลิก' ? 'rgba(255,0,0,0.2)' : 'rgba(61,193,60,0.2)',
                                        color: rowData.stockType === 'ยกเลิก' ? 'rgba(255,0,0,1)' : 'rgba(61,193,60,1)',
                                        border: rowData.stockType === 'ยกเลิก' ? '1px solid rgba(255,0,0,1)' : '1px solid rgba(61,193,60,1)'
                                    }} />

                            },
                        ]}
                        data={dataRow}
                        onRowClick={(event, rowData) => history.push(RouteName.IMPORT_TRANSACTION, { transactions: rowData.transactions, page: 'import', number: rowData.number, dateTime: rowData.dateTime, user: rowData.user })}
                        actions={[
                            {
                                isFreeAction: true,
                                icon: 'add',
                                tooltip: 'import'
                            },
                            {
                                icon: 'edit',
                                tooltip: 'Edit Index',
                                onClick: (e, rowData) => {
                                    e.stopPropagation();
                                    swal({
                                        title: `ต้องการยกเลิกใบนำเข้าสินค้า หมายเลข ${rowData.number} `,
                                        text: "การยกเลิกใบนำเข้าสินค้าไม่สามารถเรียกกลับคืนได้",
                                        icon: "warning",
                                        buttons: ['ยกเลิก', 'ตกลง'],
                                        dangerMode: true,
                                    })
                                        .then((willDelete) => {
                                            if (willDelete) {
                                                cancelStockImport(rowData)
                                            }
                                        });
                                }
                            },

                        ]}

                        options={{
                            actionsColumnIndex: -1,
                            actionsCellStyle: { alignContent: 'center' },
                            pageSize: 10,
                            pageSizeOptions: [5, 10, 25, 50, 100],
                            search: true,
                            searchFieldVariant: 'outlined',
                            searchFieldStyle: { height: 40 },
                            toolbarButtonAlignment: 'left',
                            showTitle: false,
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
                        components={{
                            Action: props => {
                                if (props.action.icon === 'edit') {
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
                                }
                                else {
                                    return <Button
                                        variant="contained"
                                        size="large"
                                        color="primary"
                                        startIcon={<ImportExport />}
                                        onClick={() => history.push(RouteName.IMPORT_ITEMS)}
                                    >นำเข้าสินค้า</Button>
                                }
                            }


                        }}

                    />
                </Grid>
            </Grid>


        </SideMenu>
    );
}
