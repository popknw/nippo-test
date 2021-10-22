import { Button, Container, Grid, Paper, TextField, Typography, MenuItem } from '@material-ui/core'
import React, { useState, useEffect } from 'react';
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import SideMenu from '../main/SideMenu';
import { makeStyles } from '@material-ui/core/styles';
import jwt from 'jwt-decode';
import Service from '../../../services/Service';
import history from '../../../history';
import UserService from '../../../services/UserService';
import NewLogin from '../../../services/NewLoginService';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'left',
        color: theme.palette.text.secondary,
    },
    textHeader: {
        color: "black"
    }
}));
export default function UserDetail() {
    const classes = useStyles();
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const [loading, setLoading] = useState(false);

    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };


    const Authorized = () => {
        NewLogin();
    };
    const token = localStorage.getItem('token');
    const service = new Service(token, { onError: handleError, onUnAuthorized: Authorized });
    const userService = new UserService(token, { onError: handleError, onUnAuthorized: Authorized });
    const [roles, setRoles] = useState([]);
    const [licenseExpired, setLicenseExpired] = useState(false);
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "",
    });

    const handleTextField = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const createUser = async () => {
        setLoading(true);
        const res = await userService.createUser(user);
        if (!res) {
            return;
        }
        setLoading(false);
        history.goBack();

    };

    useEffect(() => {
        const user = jwt(token);
        setLicenseExpired(user.licenseExpired);
        (async () => {
            const loadRoles = async () => {
                const res = await service.getRoles();
                if (!res) {
                    return;
                }

                setRoles(res);
            };
            await loadRoles();

        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <SideMenu license={licenseExpired} loading={loading} >
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <div className={classes.root}>
                <Container maxWidth="md" style={{ marginTop: 50 }}>
                    <Paper className={classes.paper}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6" className={classes.textHeader}>เพิ่มพนักงานใหม่</Typography>

                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    label="ชื่อ"
                                    size="medium"
                                    name="firstName"
                                    value={user.firstName}
                                    onChange={handleTextField}
                                />

                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="lastName"
                                    variant="outlined"
                                    label="นามสกุล"
                                    fullWidth
                                    size="medium"
                                    value={user.lastName}
                                    onChange={handleTextField} />

                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="email"
                                    variant="outlined"
                                    label="อีเมล"
                                    fullWidth
                                    size="medium" value={user.email}
                                    onChange={handleTextField} />

                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="password"
                                    type="password"
                                    variant="outlined"
                                    label="รหัสผ่าน"
                                    fullWidth
                                    size="medium"
                                    value={user.password}
                                    onChange={handleTextField}
                                />

                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    name='role'
                                    select
                                    variant="outlined"
                                    label="ตำแหน่ง"
                                    fullWidth
                                    size="medium"
                                    value={user.role}
                                    onChange={handleTextField}
                                >

                                    {roles.map((role) => (
                                        <MenuItem key={role.value} value={role.value}>
                                            {role.display}
                                        </MenuItem >
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} justify="flex-end" style={{ marginTop: 30 }}>
                            <Grid item xs={2}>
                                <Button variant="outlined" size="large" color="primary" fullWidth onClick={() => history.goBack()}>ยกเลิก</Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button variant="contained" size="large" color="primary" fullWidth onClick={createUser}>บันทึก</Button>

                            </Grid>

                        </Grid>
                    </Paper>
                </Container>
            </div>


        </SideMenu >
    )
}
