import React, { useEffect, useState } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import jwt from 'jwt-decode';
import pos_login from '../.././images/logo/POS.png';
import LoginService from '../../services/LoginService';
import AlertMessage, { useAlertMessage } from '../AlertMessage';
import history from '../../history';
import ButtonComponent from '../ButtonComponent';
import { RouteName } from '../../models/route_name';

const useStyles = makeStyles(() => ({
    circular: {
        color: '#fff',
    },
    icon: {
        fontSize: 20
    },
    image: {
        width: '45%'
    },
    marginBar: {
        marginTop: '10%',
    },
    marginButton: {
        marginTop: 30
    }
}));

export default function LoginPage() {
    const classes = useStyles();
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = RouteName.SALE_SUMMARY;
    }
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disableButton, setDisableButton] = useState(true);
    const [loading, setLoading] = useState(false);

    const [values, setValues] = useState({
        amount: '',
        password: '',
        showPassword: 'boolean',
        weight: '',
        weightRange: '',
    });

    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };
    const Authorized = () => {
        history.push(RouteName.LOGIN);
    };
    const loginService = new LoginService('', { onError: handleError, onUnAuthorized: Authorized });

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const login = async (data) => {
        const res = await loginService.login(data);
        if (!res) {
            setLoading(false);
            return;
        }
        const user = jwt(res.token);
        if (user.isCashier) {
            showMessage('คุณไม่มีสิทธิ์เข้าระบบหลังบ้าน', 'error');
            setLoading(false);
            return;
        }
        localStorage.setItem('token', res.token);
        history.push(RouteName.SALE_SUMMARY);
    };

    const submit = () => {
        if (email !== '' && password !== '') {
            localStorage.clear();
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);
            setLoading(true);
            login({ email, password });
        }
    };
    useEffect(() => {

        setDisableButton(email === '' || password === '');
    }, [email, password]);

    return (
        <Container className={classes.marginBar} maxWidth="xs">
            <Grid container spacing={2}>
                <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
                <Box
                    alignItems="center"
                    display="flex"
                    height={150}
                    justifyContent="center"
                    width={400}
                >
                    <img alt="complex" className={classes.image} src={pos_login} />
                </Box>
                <Grid item sm={12} xs={12}>
                    <FormControl fullWidth size="medium" variant="outlined">
                        <InputLabel htmlFor="outlined-email"> อีเมล </InputLabel>
                        <OutlinedInput
                            id="outlined-email"
                            labelWidth={40}
                            onChange={e => setEmail(e.target.value)}
                            type={'email'}
                            value={email}
                        />
                    </FormControl>
                </Grid>
                <Grid item sm={12} xs={12}>
                    <FormControl fullWidth size="medium" variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password"> รหัสผ่าน </InputLabel>
                        <OutlinedInput
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        edge="end"
                                        onClick={handleClickShowPassword}
                                    >
                                        {values.showPassword ? (
                                            <VisibilityOff className={classes.icon} />
                                        ) : (
                                            <Visibility className={classes.icon} />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            }
                            id="outlined-adornment-password"
                            labelWidth={70}
                            onChange={e => setPassword(e.target.value)}
                            onKeyPress={(e) => { e.key === 'Enter' && submit(); }}
                            type={values.showPassword ? 'password' : 'text'}
                            value={password}
                        />
                    </FormControl>
                </Grid>
            </Grid>

            <Grid className={classes.marginButton} container spacing={3}>
                <Grid item sm={12} xs={12}>
                    <FormControl fullWidth size="small" variant="outlined">
                        <ButtonComponent
                            disableButton={loading === true || disableButton}
                            loading={loading}
                            onClick={submit}
                            title={'เข้าสู่ระบบ'}
                        />
                    </FormControl>
                </Grid>
            </Grid>
        </Container>
    );
}
