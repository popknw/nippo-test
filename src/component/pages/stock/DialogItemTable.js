import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Add } from '@material-ui/icons';
import MaterialTable from 'material-table';
import { PropTypes } from 'prop-types';
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import { Grid, MenuItem, Typography } from '@material-ui/core';
import ItemService from '../../../services/ItemService';
import Service from '../../../services/Service';
import NewLogin from '../../../services/NewLoginService';

DialogItemTable.propTypes = {
    onSubmit: PropTypes.func.isRequired,
}
export default function DialogItemTable(props) {
    const { onSubmit } = props;

    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        console.log(errorMessage);
        showMessage(errorMessage, 'error');
    };

    const service = new Service(localStorage.getItem('token'), { onError: handleError, onUnAuthorized: () => NewLogin() });
    const itemService = new ItemService(localStorage.getItem('token'), { onError: handleError, onUnAuthorized: () => NewLogin() });
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [categories, setCategories] = React.useState([]);
    const [categoryId, setCategoryId] = React.useState(0);
    const [items, setItems] = React.useState([]);
    const [rowSelected, setRowSelected] = React.useState([]);
    const [count, setCount] = React.useState(0);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function getItems() {
        setLoading(true);
        let queryParams = { 'isDeleted': false, 'stockTracking': true };
        if (categoryId && categoryId !== 0) {
            queryParams = { ...queryParams, ['categoryId']: categoryId }
        }
        var res = await itemService.list(queryParams);
        if (!res) {
            return;
        }
        setItems(res);
        setLoading(false);
    };

    async function getCategories() {
        const categories = await service.getCategories();
        setCategories(categories);
    };

    const handleRowSelected = (rows) => {
        console.log(rows);
    }

    useEffect(() => {
        getItems();
        getCategories();
    }, [categoryId])


    const dataRow = items.map((item) => ({ item: item, sku: item.sku, name: item.name, sellPrice: item.sellPrice, quantity: item.inStock, tableData: { checked: false } }));

    const filterDataChecked = () => {
        const checked = dataRow.filter((data) => data.tableData.checked === true).map(data => data.item);

        onSubmit(checked);
        handleClose();
    }
    return (
        <div>
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <Button variant="contained" color="primary" size="large" startIcon={<Add />} onClick={handleClickOpen} >เลือกสินค้า</Button>
            <Dialog open={open} aria-labelledby="form-dialog-title" fullWidth maxWidth="md">
                <DialogTitle id="form-dialog-title">เลือกสินค้า</DialogTitle>
                <DialogContent dividers>
                    <DialogContentText>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    select
                                    style={{ width: "150px" }}
                                    value={categoryId}
                                    onChange={(event) => setCategoryId(event.target.value)}
                                >
                                    <MenuItem value={0}>ทั้งหมด</MenuItem>
                                    {categories.map((category) => <MenuItem key={category.name} value={category.id}>{category.name}</MenuItem>)}
                                </TextField>
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    style={{ width: "200px", marginLeft: 10 }}
                                    placeholder="SKU หรือชื่อสินค้า"

                                />
                            </Grid>
                            <Grid item xs={12}>
                                <MaterialTable
                                    columns={[
                                        { title: 'SKU', field: 'sku' },
                                        { title: 'สินค้า', field: 'name' },
                                        { title: 'ราคา', field: 'sellPrice', type: 'numeric' },
                                        { title: 'จำนวนสินค้า', field: 'quantity', type: 'numeric' },

                                    ]}
                                    data={dataRow}

                                    options={{
                                        selection: true,
                                        showTextRowsSelected: true,
                                        showTitle: false,
                                        search: false,
                                        toolbar: false,
                                        headerStyle: {
                                            backgroundColor: '#EEEEEE',
                                        },

                                    }}
                                    style={{
                                        border: '1px solid rgba(213,213,213,1)',
                                        backgroundColor: 'white',
                                        boxShadow: 'none'
                                    }}
                                    onRowSelected={handleRowSelected}
                                    isLoading={loading}
                                    localization={{
                                        body: {
                                            emptyDataSourceMessage: 'ไม่มีข้อมูล'
                                        },
                                        toolbar: {
                                            searchPlaceholder: 'ค้นหา',
                                        },
                                        header: {
                                            actions: 'ตัวเลือก',
                                        }
                                        ,
                                    }}



                                />
                            </Grid>
                        </Grid>

                    </DialogContentText>

                </DialogContent>
                <DialogActions>

                    <Typography variant="inherit">เลือกสินค้าแล้ว ชิ้น</Typography>
                    <Button
                        onClick={handleClose}
                        color="inherit"
                        style={{ width: "120px" }}
                        variant="outlined"
                        size="large"
                        fullWidth>
                        ยกเลิก
                    </Button>
                    <Button
                        onClick={filterDataChecked}
                        style={{
                            marginLeft: 10,
                            width: "120px",
                            color: "white",
                            backgroundColor: "#ED2121", border: "1px solid #ED2121"
                        }}
                        size="large"
                        variant="outlined"
                        fullWidth>
                        ยืนยัน
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
