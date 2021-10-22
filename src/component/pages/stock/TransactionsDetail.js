import React, { useEffect, useState } from 'react';
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import SideMenu from '../main/SideMenu';
import MaterialTable from 'material-table'
import { Divider, Grid, List, ListItem, ListItemText, Paper, Typography } from '@material-ui/core';
import jwt from 'jwt-decode';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    text: {
        color: 'black',
        fontSize: '18px',
        textAlign: 'left'

    },
    margin: {
        padding: theme.spacing(3),
        borderBottom: "1px solid rgba(0,0,0,0.16)"
    }
}));
function TransactionsDetail(props) {
    const classes = useStyles();
    const page = props.location.state.page;
    const transactions = props.location.state.transactions;
    console.log(transactions);
    const number = props.location.state.number;
    const dateTime = props.location.state.dateTime;
    const user = props.location.state.user;
    const token = localStorage.getItem('token');
    const [title, setTitle] = useState();
    const [licenseExpired, setLicenseExpired] = useState(false);

    const dataRow = transactions.map(trans => {
        return {
            image: `${trans.item.imageUri}`,
            itemName: `${trans.item.name}`,
            sku: `${trans.item.sku ? trans.item.sku : '-'}`,
            quantity: `${trans.quantity}`,
            unit: `${trans.item.unit === 'pcs' ? 'ชิ้น' : 'กิโลกรัม'}`
        }
    });

    const handleTitle = () => {
        if (page === 'adjustment') {
            setTitle('ปรับสต๊อก');
        }
        if (page === 'export') {
            setTitle('เบิกสินค้าออก');
        }
        if (page === 'import') {
            setTitle('นำเข้าสินค้า');
        }
    }

    useEffect(() => {
        const user = jwt(token);
        setLicenseExpired(user.licenseExpired);

        handleTitle()

    }, [])

    return (
        <SideMenu title={title} license={licenseExpired}>
            <Grid container spacing={3} justify="center">
                <Grid item xs={12}>
                    <Paper >

                        <Grid container className={classes.margin} >
                            <Grid item xs={4}>
                                <Typography className={classes.text} variant="subtitle1">หมายเลขนำเช้า: </Typography>
                            </Grid>

                            <Grid item xs={8}>
                                <Typography className={classes.text} variant="subtitle1">{number}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container className={classes.margin} >
                            <Grid item xs={4}>
                                <Typography className={classes.text} variant="subtitle1">วันที่: </Typography>
                            </Grid>

                            <Grid item xs={8}>
                                <Typography className={classes.text} variant="subtitle1">{dateTime}</Typography>
                            </Grid>

                        </Grid>
                        <Grid container className={classes.margin} >
                            <Grid item xs={4}>
                                <Typography className={classes.text} variant="subtitle1">จำนวนรายการ: </Typography>
                            </Grid>

                            <Grid item xs={8}>
                                <Typography className={classes.text} variant="subtitle1">{transactions.length}</Typography>
                            </Grid>
                            <Divider light />
                        </Grid>
                        <Grid container className={classes.margin} >
                            <Grid item xs={4}>
                                <Typography className={classes.text} variant="subtitle1">ผู้ทำรายการ:</Typography>
                            </Grid>

                            <Grid item xs={8}>
                                <Typography className={classes.text} variant="subtitle1">{user}</Typography>
                            </Grid>
                            <Divider light />
                        </Grid>

                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <MaterialTable
                        title={"รายการ" + title}
                        columns={[
                            { title: 'รูปภาพ', field: 'image', width: "10%", render: rowData => <img src={rowData.image} width="50px" style={{ borderRadius: "50%" }} /> },
                            { title: 'SKU', field: 'sku' },
                            { title: 'สินค้า', field: 'itemName' },
                            { title: 'จำนวน', field: 'quantity', type: 'numeric' },
                            { title: 'หน่วย', field: 'unit', align: 'center' },
                        ]}
                        data={dataRow}
                        options={{
                            search: false,
                            actionsCellStyle: { alignContent: 'center' },
                            pageSize: 5,
                            pageSizeOptions: [5, 10, 25, 50, 100],
                            headerStyle: { position: 'sticky', top: 0, fontWeight: 700 },

                        }}

                        localization={{
                            body: {
                                emptyDataSourceMessage: 'ไม่มีข้อมูล'
                            },
                            toolbar: {
                                searchPlaceholder: 'ค้นหา'
                            },
                            header: {
                                actions: 'ตัวเลือก',

                            },
                        }}

                    />
                </Grid>
            </Grid>
        </SideMenu>
    );



}
export default TransactionsDetail;

