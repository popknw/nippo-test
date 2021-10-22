import { Button, Container, FormControlLabel, Grid, MenuItem, Paper, Radio, RadioGroup, Switch, TextField, Typography } from '@material-ui/core';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';

import React, { useState, useEffect } from 'react';
import SideMenu from '../main/SideMenu';
import ItemService from '../../../services/ItemService';
import Service from '../../../services/Service';

import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import ImageSection from './ImageSection';
import DialogMaterial from './DialogMaterial';
import history from '../../../history';
import NewLogin from '../../../services/NewLoginService';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(3)
    },
    alignRight: {
        textAlign: "right"
    },
    header: {
        fontWeight: "bold"
    }
}));

export default function ItemDetail(props) {
    const getItemData = props.location.state.item;
    let imageUrl = '';
    if (getItemData) {
        imageUrl = getItemData.imageUrl;
    }
    const categories = props.location.state.categories;
    const units = props.location.state.units;
    const classes = useStyles();
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const [loading, setLoading] = useState(false);
    const [itemBom, setItemBom] = useState([]);
    const [item, setItem] = useState({
        name: "",
        sku: "",
        ean: "",
        categoryId: "",
        unit: "",
        sellPrice: 0,
        costPrice: 0,
        discountPrice: 0,
        stockTracking: true,
        safetyStock: 0,
        isSellItem: true,
        isMaterialItem: false,
        isBomItem: false,
        isDeleted: false,
        isActive: true,
        initStock: 0,
        image: "",
    });

    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };
    const token = localStorage.getItem('token');
    const itemService = new ItemService(token, { onError: handleError, onUnAuthorized: () => NewLogin() });

    const handleOnChange = (e) => {
        setItem({ ...item, [e.target.name]: e.target.value });
    }
    const handleShowItemBom = (bom) => {
        if (bom.length === 0) { return; }
        const array = [];
        bom.map((t) => array.push({ name: t.item.name, quantity: t.quantity, itemId: t.item.id }))
        setItemBom(array);

    }
    useEffect(() => {
        if (getItemData) {
            handleShowItemBom(getItemData.boms)
            setItem({ ...getItemData, isBomItem: getItemData.boms.length > 0 ? true : false, image: {} })
        } else {
            setItem({ ...item, unit: units[0].value, categoryId: categories[0].id })
        }


    }, [])

    const handleSubmit = async () => {
        const itemSelected = [];
        itemBom.map((data) => itemSelected.push({ childItemId: data.itemId, quantity: data.quantity }));
        const payload = item;
        delete payload.boms;
        delete payload.imageUrl;
        if (item.isBomItem === true) {
            payload = { ...item, ['boms']: itemSelected };
        }

        if (getItemData) {
            console.log(payload);
            const res = await itemService.update(getItemData.id, payload);
            if (!res) { return; }
        } else {
            const res = await itemService.create(payload);
            if (!res) { return; }

        }
        history.goBack();

    }


    return (
        <div>
            <SideMenu loading={loading}>
                <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
                <Paper className={classes.paper}>
                    <Container maxWidth="md">
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="subtitle1" className={classes.header}>ข้อมูลทั่วไป</Typography>
                            </Grid>
                            <Grid item xs={6} className={classes.alignRight}>
                                <FormControlLabel
                                    value="start"
                                    control={<Switch color="primary" checked={true} />}
                                    label="สินค้าปิดการใช้งาน"
                                    labelPlacement="start" /></Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2">ชื่อสินค้า</Typography>
                                <TextField variant="outlined" size="small" placeholder="ชื่อสินค้า" fullWidth name="name" value={item.name} onChange={handleOnChange} /></Grid>
                            <Grid item xs={6}>
                                <Typography>SKU</Typography>
                                <TextField variant="outlined" size="small" placeholder="ระบบสร้างอัตโนมัติ" name="sku" fullWidth value={item.sku} onChange={handleOnChange} /> </Grid>
                            <Grid item xs={6}>
                                <Typography>EAN</Typography>
                                <TextField variant="outlined" size="small" placeholder="EAN" fullWidth name="ean" value={item.ean} onChange={handleOnChange} /> </Grid>
                            <Grid item xs={12}>
                                <Typography >หมวดหมู่</Typography>
                                <TextField
                                    select
                                    name="categoryId"
                                    value={item.categoryId}
                                    onChange={
                                        handleOnChange
                                    }
                                    variant="outlined"
                                    size="small"
                                    fullWidth

                                >
                                    {categories.map(category => (<MenuItem key={category.name} value={category.id}>{category.name}</MenuItem>))}
                                </TextField>

                            </Grid>
                            <Grid item xs={12}>
                                <Typography >หน่วยสินค้า</Typography>
                                <RadioGroup row aria-label="unnitId" name="unit" value={item.unit} onChange={handleOnChange} >
                                    {units.map(unit => (<FormControlLabel key={unit.display} value={unit.value} control={<Radio />} label={unit.display} />))}
                                </RadioGroup>

                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" className={classes.header}>ข้อมูลขาย</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography>ราคาต้นทุน</Typography>
                                <TextField variant="outlined" size="small" placeholder="ราคาต้นทุน" type="number" fullWidth name="costPrice" value={item.costPrice} onChange={handleOnChange} /> </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography>ราคาลด</Typography>
                                <TextField variant="outlined" size="small" placeholder="ราคาลด" type="number" type="number" fullWidth name="discountPrice" value={item.discountPrice} onChange={handleOnChange} /> </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography>ราคาขาย</Typography>
                                <TextField variant="outlined" size="small" placeholder="ราคาขาย" type="number" fullWidth name="sellPrice" value={item.sellPrice} onChange={handleOnChange} /> </Grid>
                            <Grid item xs={12}>
                                <Grid container >
                                    <Grid item xs={12} sm={3}><Typography>แสดงสินค้าในหน้าการขาย</Typography></Grid>
                                    <Grid item xs={12} sm={1}><Switch color="primary" checked={item.isActive} onChange={(e) => setItem({ ...item, [e.target.name]: e.target.checked })} name="isActive" /></Grid>
                                </Grid>

                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" className={classes.header}>ข้อมูลคลัง</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container >
                                    <Grid item xs={12} sm={3}><Typography>หักสินค้าคงคลัง</Typography></Grid>
                                    <Grid item xs={12} sm={1}><Switch color="primary" checked={item.stockTracking} onChange={(e) => setItem({ ...item, [e.target.name]: e.target.checked })} name="stockTracking" /></Grid>
                                </Grid>
                            </Grid>
                            {item.stockTracking ?
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Grid container >
                                            <Grid item xs={12} sm={3}><Typography>แจ้งเตือนสินค้าใกล้หมด</Typography></Grid>
                                            <Grid item xs={12} sm={3}><TextField variant="outlined" type="number" size="small" fullWidth placeholder="จำนวน" name="safetyStock" value={item.safetyStock} onChange={handleOnChange} /></Grid>
                                        </Grid>
                                    </Grid>

                                    {!getItemData ?
                                        <Grid item xs={12}>
                                            <Grid container >
                                                <Grid item xs={12} sm={3}><Typography>สินค้าคงเหลือ</Typography></Grid>
                                                <Grid item xs={12} sm={3}><TextField variant="outlined" type="number" size="small" fullWidth placeholder="จำนวน" name="initStock" value={item.initStock} onChange={handleOnChange} /></Grid>
                                            </Grid>
                                        </Grid> : null}
                                </Grid>
                                : null

                            }
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" className={classes.header}>ปรเภทสินค้า</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container >
                                    <Grid item xs={12} sm={3}><Typography>สินค้าหลัก</Typography></Grid>
                                    <Grid item xs={12} sm={1}><Switch color="primary" checked={item.isSellItem} onChange={(e) => setItem({ ...item, [e.target.name]: e.target.checked })} name="isSellItem" /></Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container >
                                    <Grid item xs={12} sm={3}><Typography>ส่วนประกอบ</Typography></Grid>
                                    <Grid item xs={12} sm={1}><Switch color="primary" checked={item.isMaterialItem} onChange={(e) => setItem({ ...item, [e.target.name]: e.target.checked })} name="isMaterialItem" /></Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" className={classes.header}>อื่นๆ</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container >
                                    <Grid item xs={12} sm={3}><Typography>BOM</Typography></Grid>
                                    <Grid item xs={12} sm={1}><Switch color="primary" checked={item.isBomItem} onChange={(e) => setItem({ ...item, [e.target.name]: e.target.checked })} name="isBomItem" /></Grid>
                                    {item.isBomItem ?
                                        <Grid item xs={12} sm={8} style={{ textAlign: "right" }}>
                                            <DialogMaterial onSubmit={(itemSelected) => {
                                                const bom = [];
                                                itemSelected.map((data) => {
                                                    if (!itemBom.some(t => t.itemId === data.item.id)) {
                                                        bom.push({ name: data.name, quantity: 1, itemId: data.item.id })
                                                    }
                                                })
                                                setItemBom([...itemBom, ...bom]);
                                            }} />
                                            <Grid item xs={12} sm={12}>
                                                <MaterialTable
                                                    style={{
                                                        marginTop: 20,
                                                        border: '1px solid rgba(213,213,213,1)',
                                                        backgroundColor: 'white',
                                                        boxShadow: 'none'
                                                    }}

                                                    columns={[
                                                        { title: 'ชื่อสินค้า', field: 'name' },
                                                        {
                                                            title: 'หักออก', field: 'quantity', width: "10%", type: 'numeric', render: row => (<TextField
                                                                style={{ width: 100 }}
                                                                inputProps={{ style: { textAlign: "right" } }}
                                                                variant="outlined"
                                                                size="small"
                                                                value={row.quantity}
                                                            />)
                                                        }

                                                    ]}
                                                    data={itemBom.map((bom => ({ itemId: bom.itemId, name: bom.name, quantity: bom.quantity })))}
                                                    actions={[
                                                        rowData => ({
                                                            icon: 'delete',
                                                            tooltip: 'Delete User',
                                                            onClick: (event, rowData) => {
                                                                const newList = itemBom.filter((item) => item.itemId !== rowData.itemId);
                                                                setItemBom(newList)
                                                            },

                                                        })
                                                    ]}
                                                    options={{
                                                        search: false,
                                                        showTitle: false,
                                                        toolbar: false,
                                                        actionsColumnIndex: -1,
                                                        paging: false,

                                                    }}
                                                    localization={{
                                                        body: {
                                                            emptyDataSourceMessage: 'เลือกสินค้า'
                                                        },
                                                        header: {
                                                            actions: '',
                                                            fontWeight: "700"

                                                        },
                                                    }}
                                                />

                                            </Grid>
                                        </Grid>

                                        : null
                                    }
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container >
                                    <Grid item xs={12} sm={3}><Typography>รูปภาพ</Typography></Grid>
                                    <Grid item xs={12} sm={9}>
                                        <ImageSection imageUrl={imageUrl} onImageSelected={(image) => setItem({ ...item, ['image']: image })} />
                                    </Grid>
                                </Grid>
                            </Grid>



                        </Grid>
                    </Container>

                </Paper>
                <Grid container justify="flex-end" spacing={2} style={{ marginTop: 20 }}>
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
                                <Button color='primary' fullWidth onClick={() => handleSubmit()} size="large" variant="contained">
                                    <Typography variant="body1" >
                                        บันทึก
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </SideMenu>

        </div>
    )
}
