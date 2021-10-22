import React, { useEffect, useState } from 'react';
import {
    Button,
    Grid,
    TextField,
    Typography,
    makeStyles
} from '@material-ui/core';
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import ItemService from '../../../services/ItemService';
import StockService from '../../../services/StockService';
import Service from '../../../services/Service';
import history from '../../../history';
import SideMenu from '../main/SideMenu';
import LoginService from '../../../services/LoginService';
import MaterialTable from 'material-table'
import DialogItemTable from './DialogItemTable';
import NewLogin from '../../../services/NewLoginService';


const useStyles = makeStyles((theme) => ({
    boxButton: {
        textAlign: 'right',
    },
    button: {
        minWidth: 180,
    },
    button_cancel: {
        width: '150px',
    },
    callAmount: {
        width: 150
    },
    callChecbox: {
        width: 40
    },
    callName: {
        minWidth: 100
    },
    paper: {
        color: theme.palette.text.secondary,
        padding: theme.spacing(2),
    },
    root: {
        minHeight: 200
    },
    table: {
        weidth: 780,
    },
    margin: {
        margin: 5
    }

}));

export default function StockForm(props) {
    const page = props.location.state;
    const [title, setTitle] = useState();
    const classes = useStyles();
    const [categories, setCategories] = useState([]);
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };
    const Authorized = () => {
        NewLogin();
    };
    const loginService = new LoginService('', { onError: handleError, onUnAuthorized: Authorized });
    const login = async (data) => {
        const res = await loginService.login(data);
        if (!res) {
            history.push('/');
            return;
        }
        localStorage.removeItem('token');
        localStorage.setItem('token', res.token);
        window.location.href = '/stock';
    };
    const token = localStorage.getItem('token');
    const service = new Service(token, { onError: handleError, onUnAuthorized: Authorized });
    const itemService = new ItemService(token, { onError: handleError, onUnAuthorized: Authorized });
    const stockService = new StockService(token, { onError: handleError, onUnAuthorized: Authorized });
    const [itemSelected, setItemSelected] = useState([])


    const loadCategories = async () => {
        const categories = await service.getCategories();
        setCategories(categories);
    };

    const stockImports = async (data) => {
        const res = await stockService.importStock(data);
        if (!res) {
            return;
        }
        history.push('/stock/import', page);
    };

    const stockExports = async (data) => {
        const res = await stockService.exportStock(data);
        if (!res) {
            return;
        }
        history.push('/stock/export', page);
    };

    const stockAdjustment = async (data) => {
        const res = await stockService.adjustmentStock(data);
        if (!res) {
            return;
        }
        history.push('/stock/adjustment', page);
    };

    // const itemSelected = [];
    // const checkItemSelected = (items) => {
    //     if (items) {
    //         for (let i = 0; i < items.length; i++) {
    //             itemSelected.push(items[i].id);
    //         }
    //         return items;
    //     }
    // };

    const [listaddItems, setListaddItems] = useState([]);
    // const onConfirmAddItems = (items) => {
    //     if (items) {
    //         setListaddItems(items.map((item) => {
    //             return { ...item, quantity: 1, selected: false };
    //         }));
    //         checkItemSelected(items);
    //         dialogClose();
    //     }
    //     if (items === false) {
    //         dialogClose();
    //     }
    // };

    // const addQuantity = (items, id) => {
    //     setListaddItems(listaddItems.map((item) => {
    //         if (id === item.id) {
    //             return { ...item, quantity: items };
    //         }
    //         return item;
    //     }));
    // };

    const isBomsAlert = () => {
        const errorMessage = `คุณไม่สามารถ${title}ที่มี BOM ได้ กรุณา${title === 'นำเข้าสินค้า' ? 'นำเข้า' : 'นำออก'}วัตถุดิบแทน`;
        return showMessage(errorMessage, 'error');
    };
    function saveStock() {
        // const lines = [];
        // for (let i = 0; i < listaddItems.length; i++) {
        //     const boms = listaddItems[i].boms;
        //     if (boms.length > 0) {
        //         return isBomsAlert();
        //     }
        //     const itemId = listaddItems[i].id;
        //     const quantity = listaddItems[i].quantity;

        //     lines.push({ 'itemId': itemId, 'quantity': quantity });
        // }

        // if (page === 'import') {
        //     stockImports({ lines });
        // }
        // if (page === 'export') {
        //     stockExports({ lines });
        // }
        // if (page === 'adjustment') {
        //     stockAdjustment({ lines });
        // }

    }

    const linkPage = (page) => {
        if (page === 'import') {
            history.push('/stock/import', page);
        }
        if (page === 'export') {
            history.push('/stock/export', page);
        }
        if (page === 'adjustment') {
            history.push('/stock/adjustment');
        }
    };
    useEffect(() => {
        if (page === 'import') {
            setTitle('นำเข้า')
        }
        if (page === 'export') {
            setTitle('เบิกออก')
        }
        if (page === 'adjustment') {
            setTitle('Adjustment')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dataRow = itemSelected.map((t) => ({ name: t.name, image: t.imageUrl, stock: t.inStock, quantity: t.quantity, unit: t.unit }));

    function handleRemove(id) {
        const newList = listaddItems.filter((item) => item.id !== id);

        setListaddItems(newList);
    }
    return (
        <SideMenu title={title}>
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <Grid container spacing={3}>
                <Grid className={classes.root} item xs={12}>
                    <MaterialTable
                        title="รายการสินค้าที่เลือก"
                        columns={[
                            { title: 'รูปภาพ', field: 'image', width: "10%", render: rowData => <img src={rowData.image} width="50px" style={{ borderRadius: "50%" }} /> },
                            { title: 'ชื่อสินค้า', field: 'name' },
                            { title: 'คลัง', field: 'stock' },
                            {
                                title: title, field: 'quantity', align: 'right', render: (rowData) => <TextField
                                    variant="outlined"
                                    size="small"
                                    value={rowData.quantity}
                                //onChange={(e) => addQuantity(e.target.value, rowData.itemId)}
                                />
                            },
                            { title: 'หน่วย', field: 'unit', align: 'right' },

                        ]}
                        data={dataRow}
                        actions={[
                            {
                                icon: 'delete',
                                tooltip: 'ลบ',
                                iconProps: { color: 'secondary' },
                                // onClick: (event, rowData) => { handleRemove(rowData.itemId); }
                            },
                            {
                                icon: 'add',
                                tooltip: 'add item',
                                isFreeAction: true,
                                // onClick: (e, data) => { }

                            }
                        ]}
                        components={{
                            Action: props => {
                                if (props.action.icon == 'add') {
                                    return <DialogItemTable onSubmit={(selected) => {
                                        console.log(selected)

                                        const list = [];
                                        selected.map(item => list.push({ ...item, ['quantity']: 1 }))

                                        setItemSelected(list);
                                        console.log(list);

                                    }} />
                                }
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
                        <Grid className={classes.boxButton} item sm={6} xs={12}>
                            <Grid container justify="flex-end" spacing={2}>
                                <Grid item sm={4} xs={12}>
                                    <Button fullWidth onClick={() => linkPage(page)} size="large" variant="outlined">
                                        <Typography variant="body1" className={classes.margin}>
                                            ยกเลิก
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid className={classes.boxButton} item sm={4} xs={12}>
                                    <Button color='primary' fullWidth onClick={() => saveStock()} size="large" variant="contained">
                                        <Typography variant="body1" className={classes.margin}>
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
    );
}
