import { Button, Container, FormControl, FormControlLabel, Grid, Paper, Radio, RadioGroup, TextField, Typography, Switch } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import SideMenu from '../../main/SideMenu'
import { makeStyles } from '@material-ui/core/styles';
import { DiscountType } from './DiscountListPage';
import AlertMessage, { useAlertMessage } from '../../../AlertMessage'
import Service from '../../../../services/Service';
import history from '../../../../history';
import NewLogin from '../../../../services/NewLoginService';

export class DiscountStatus {
    static ACTIVE = 'active';
    static INACTIVE = 'inactive'
}

const useStyles = makeStyles((theme) => ({
    padding: {
        padding: theme.spacing(3)
    }
}));

export default function AddDiscount(props) {
    const discountDetail = props.location.state.discount;
    const classes = useStyles();
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();

    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };

    const token = localStorage.getItem('token');
    const service = new Service(token, { onError: handleError, onUnAuthorized: () => NewLogin() });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(true);
    const [discount, setDiscount] = React.useState({
        code: "",
        value: "",
        type: DiscountType.ABSOLUTE,
    });

    const handleChange = (event) => {
        setDiscount({ ...discount, [event.target.name]: event.target.value });
    };

    const createDisconut = async () => {
        let payload = discount;
        payload = { ...payload, ['status']: status ? DiscountStatus.ACTIVE : DiscountStatus.INACTIVE };
        setLoading(true);
        let res = await service.createDiscounts(payload);
        if (!res) {
            return;
        }
        setLoading(false);

        history.goBack();
    }

    const updateDiscount = async () => {
        let payload = discount;
        payload = { ...payload, ['status']: status ? DiscountStatus.ACTIVE : DiscountStatus.INACTIVE };
        setLoading(true);

        let res = await service.updateDiscounts(discountDetail.id, payload);
        if (!res) {
            return;
        }
        setLoading(false);
        history.goBack();

    }

    const handleSubmit = () => {
        if (discountDetail) {
            updateDiscount();
        } else {
            createDisconut();
        }
    }
    useEffect(() => {
        console.log(discountDetail);
        if (discountDetail) setDiscount(discountDetail)

    }, [])


    return (
        <div>
            <SideMenu loading={loading}>
                <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
                <Container maxWidth="md">
                    <Paper className={classes.padding} >
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12}>
                                <Typography variant="h6">เพิ่มส่วนลด</Typography>
                            </Grid>
                        </Grid>
                        <Container maxWidth="sm">
                            <Grid container spacing={3} justify="center">
                                <Grid item xs={12} sm={12}>
                                    <Typography>เปิดใช้งานส่วนลด</Typography>
                                    <Switch
                                        checked={status}
                                        onChange={(e) => setStatus(e.target.checked)}
                                        color="primary"
                                        name="status"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />

                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <Typography>ชื่อส่วนลด</Typography>
                                    <TextField variant="outlined" size="small" placeholder="ชื่อส่วนลด" fullWidth name="code" value={discount.code} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Typography>ประเภท</Typography>
                                    <FormControl component="fieldset">
                                        <RadioGroup aria-label="type" name="type" value={discount.type} onChange={handleChange}>
                                            <FormControlLabel value={DiscountType.ABSOLUTE} control={<Radio color="primary" />} label="จำนวนเงิน (บาท)" />
                                            <FormControlLabel value={DiscountType.PERCENTAGE} control={<Radio color="primary" />} label="เปอร์เซ็น (%)" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Typography>จำนวนส่วนลด</Typography>
                                    <TextField variant="outlined" size="small" placeholder="จำนวนส่วนลด" name="value" value={discount.value} onChange={handleChange} />
                                </Grid>
                            </Grid>
                        </Container>
                    </Paper>
                    <Grid container spacing={3} justify="flex-end" style={{ marginTop: 20 }}>
                        <Grid item xs={2}>
                            <Button variant="contained" style={{ color: "blue", border: "1px solid blue", backgroundColor: "white" }} size="medium" fullWidth onClick={() => history.goBack()} >ยกเลิก</Button>
                        </Grid>
                        <Grid item xs={2}>
                            <Button variant="contained" color="primary" size="medium" fullWidth onClick={handleSubmit}>บันทึก</Button>
                        </Grid>

                    </Grid>
                </Container>
            </SideMenu>
        </div>
    )
}
