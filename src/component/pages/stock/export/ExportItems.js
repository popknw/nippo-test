import React, { useState } from 'react'
import SideMenu from '../../main/SideMenu'
import AlertMessage, { useAlertMessage } from '../../../AlertMessage';
import { Button, Grid, IconButton, TextField, Typography } from '@material-ui/core';
import MaterialTable from 'material-table';
import DialogItemTable from '../DialogItemTable';
import { Delete } from '@material-ui/icons';
import history from '../../../../history';
import StockService from '../../../../services/StockService';
import NewLogin from '../../../../services/NewLoginService';

export default function ExportItems() {
    const [items, setItems] = useState([]);
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();

    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };
    const token = localStorage.getItem('token');
    const stockService = new StockService(token, { onError: handleError, onUnAuthorized: async () => NewLogin() });

    const handleItemSelected = (selected) => {
        const list = [];
        selected.map((data) => {
            if (!items.some(t => t.id === data.id)) {
                list.push({ ...data, quantity: 1 })
            }
        })
        setItems([...items, ...list]);
    }

    const addQuantity = (value, id) => {
        setItems(items.map((item) => {
            if (id === item.id) {
                return { ...item, quantity: value };
            }
            return item;
        }));
    };

    const onSubmitImport = async () => {
        if (items.length == 0) {
            showMessage("กรุณาเลือกสินค้า", "error");
        }
        const payload = [];
        items.map((item) => {
            if (item.boms.length === 0) {
                payload.push({ itemId: item.id, quantity: item.quantity })
            } else {
                const errorMessage = `คุณไม่สามารถเบิกสินค้าออก ที่มี BOM ได้ กรุณาเบิกออกวัตถุดิบแทน`;
                showMessage(errorMessage, 'error');
                return;
            }
        })

        console.log(payload);
        const res = await stockService.exportStock({ lines: payload });
        if (!res) {
            return;


        }
        history.goBack();
    }

    return (
        <div>
            <SideMenu >
                <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <MaterialTable
                            title="รายการเบิกสินค้าออก"
                            columns={[
                                { title: 'รูปภาพ', field: 'img', render: (row) => (<img src={row.img} width="50" />) },
                                { title: 'ชื่อสินค้า', field: 'name' },
                                { title: 'คลัง', field: 'stock' },
                                {
                                    title: 'จำนวน', field: 'quantity', type: 'numeric', render: (row) => (<TextField
                                        variant="outlined"
                                        size="small"
                                        inputProps={{ style: { textAlign: "right" } }}
                                        value={row.quantity}
                                        onChange={(e) => addQuantity(e.target.value, row.item.id)}

                                    />)
                                },
                                { title: 'หน่วย', field: 'unit', align: "center" },
                            ]}
                            data={items.map((item) => ({ item: item, img: item.imageUrl, name: item.name, stock: item.inStock, quantity: item.quantity, unit: item.unit === "pcs" ? "ชิ้น" : "กิโลกรัม" }))}
                            actions={[
                                {
                                    icon: 'delete',
                                    tooltip: 'Delete Item',
                                    onClick: (event, rowData) => {
                                        const newList = items.filter((item) => item.id !== rowData.item.id);
                                        setItems(newList);
                                    }
                                },
                                {
                                    icon: "add",
                                    tooltip: "add Items",
                                    isFreeAction: true,
                                    onClick: (event, dataRow) => { }
                                }
                            ]}
                            components={{
                                Action: props => {
                                    if (props.action.icon == 'add') {
                                        return <DialogItemTable onSubmit={handleItemSelected} />
                                    }
                                    return <IconButton color="secondary" onClick={(event) => props.action.onClick(event, props.data)}><Delete /></IconButton>
                                }
                            }}
                            options={{
                                actionsColumnIndex: -1,
                                actionsCellStyle: { alignContent: 'center' },
                                pageSize: 10,
                                search: false,
                                headerStyle: { position: 'sticky', top: 0, fontWeight: 700 },



                            }}
                            localization={{
                                body: {
                                    emptyDataSourceMessage: 'ไม่มีข้อมูล'
                                },
                                header: {
                                    actions: 'ตัวเลือก',


                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>

                        <Grid container justify="flex-end" spacing={2}>
                            <Grid item sm={6} xs={12}>
                                <Grid container justify="flex-end" spacing={2}>
                                    <Grid item sm={4} xs={12}>
                                        <Button fullWidth onClick={() => history.goBack()} size="large" variant="outlined">
                                            <Typography variant="body1" >
                                                ยกเลิก
                                            </Typography>
                                        </Button>
                                    </Grid>
                                    <Grid item sm={4} xs={12}>
                                        <Button color='primary' fullWidth onClick={() => onSubmitImport()} size="large" variant="contained">
                                            <Typography variant="body1" >
                                                บันทึก
                                            </Typography>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>

            </SideMenu>

        </div>
    )
}
