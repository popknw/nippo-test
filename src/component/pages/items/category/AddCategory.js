import React, { useState, useEffect } from 'react'
import { Button, Container, Grid, Paper, TextField, Typography, Switch } from '@material-ui/core'
import SideMenu from '../../main/SideMenu'
import { makeStyles } from '@material-ui/core/styles';
import AlertMessage, { useAlertMessage } from '../../../AlertMessage'
import Service from '../../../../services/Service';
import history from '../../../../history';
import { RouteName } from '../../../../models/route_name';
import NewLogin from '../../../../services/NewLoginService';

const useStyles = makeStyles((theme) => ({
    padding: {
        padding: theme.spacing(3)
    }
}));
export default function AddCategory(props) {
    const categoryDetail = props.location.state.category;

    const classes = useStyles();
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const [loading, setLoading] = useState(false)

    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };

    const token = localStorage.getItem('token');
    const service = new Service(token, { onError: handleError, onUnAuthorized: () => NewLogin() });

    const [category, setCategory] = useState({
        isActive: true,
        isCheckoutQuickFilter: true,
        name: ""

    })
    const handleChange = (e) => {
        setCategory({ ...category, [e.target.name]: e.target.value });
    }

    const createCategory = async () => {

        setLoading(true)
        let res = await service.createCategory(category);
        if (!res) {
            setLoading(false)
            return;
        }
        setLoading(false)
        history.goBack();
    }

    const updateCategory = async () => {

        setLoading(true)
        let res = await service.updateCategory(categoryDetail.id, category);
        if (!res) {
            setLoading(false)
            return;
        }
        setLoading(false)
        history.goBack();
    }

    const handleSubmit = () => {
        if (categoryDetail) {
            updateCategory();
        } else {
            createCategory();
        }
    }

    useEffect(() => {
        if (categoryDetail) { setCategory(categoryDetail) }
    }, [])
    return (
        <div>
            <SideMenu loading={loading}>
                <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
                <Container maxWidth="md">
                    <Paper className={classes.padding} >
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12}>
                                <Typography variant="h6">เพิ่มหมวดหมู่</Typography>
                            </Grid>
                        </Grid>
                        <Container maxWidth="sm">
                            <Grid container spacing={3} justify="center">
                                <Grid item xs={12} sm={4}>
                                    <Typography>เปิดใช้งานส่วนลด</Typography>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <Switch
                                        checked={category.isActive}
                                        onChange={(e) => setCategory({ ...category, [e.target.name]: e.target.checked })}
                                        color="primary"
                                        name="isActive"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />

                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography>แสดงหน้าขาย</Typography>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <Switch
                                        checked={category.isCheckoutQuickFilter}
                                        onChange={(e) => setCategory({ ...category, [e.target.name]: e.target.checked })}
                                        color="primary"
                                        name="isCheckoutQuickFilter"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />

                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography>หมวดหมู่</Typography>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <TextField variant="outlined" size="small" placeholder="หมวดหมู่" fullWidth name="name" value={category.name} onChange={handleChange} />
                                </Grid>


                            </Grid>
                        </Container>
                    </Paper>
                    <Grid container spacing={3} justify="flex-end" style={{ marginTop: 20 }}>
                        <Grid item xs={2}>
                            <Button variant="contained" style={{ color: "blue", border: "1px solid blue", backgroundColor: "white" }} size="medium" fullWidth onClick={() => history.goBack()} >ยกเลิก</Button>
                        </Grid>
                        <Grid item xs={2}>
                            <Button variant="contained" color="primary" size="medium" fullWidth onClick={() => handleSubmit()} >บันทึก</Button>
                        </Grid>

                    </Grid>
                </Container>
            </SideMenu>
        </div>
    )
}
