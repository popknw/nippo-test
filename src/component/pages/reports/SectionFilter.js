import { Grid, MenuItem, TextField, Typography } from '@material-ui/core'
import React, { useState, useEffect } from "react";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker, DateTimePicker } from '@material-ui/pickers';
import PropTypes from 'prop-types';
import UserService from '../../../services/UserService';
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import NewLogin from '../../../services/NewLoginService';
import { format } from 'date-fns'


export default function SectionFilter(props) {
    const { onSubmitFilter } = props;
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const now = new Date();
    const dateNow = format(now, "yyyy-MM-dd")

    const [dateStart, handleDateStart] = useState(new Date(`${dateNow} 00:00:00`));
    const [dateEnd, handleDateEnd] = useState(new Date());
    const [userId, setUserId] = useState(0);
    const [users, setUsers] = useState([]);

    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };

    const userService = new UserService(localStorage.getItem('token'), { onError: handleError, onUnAuthorized: () => NewLogin() });

    const getUsers = async () => {
        const res = await userService.getUsers();
        if (!res) { return; }

        setUsers(res);
    }

    useEffect(() => {
        getUsers();
    }, [])

    const onChangeFilter = (start, end, user) => {
        const queryParams = {
            start: format(start, "yyyy-MM-dd HH:mm:ss"),
            end: format(end, "yyyy-MM-dd HH:mm:ss"),
            userId: user === 0 ? "" : user
        };
        onSubmitFilter(queryParams);
    }


    return (
        <div>
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <Grid container spacing={1} >
                <Grid item xs={12} style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }} >
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDateTimePicker
                            style={{ backgroundColor: "white", width: "220px", marginRight: 20 }}
                            inputVariant="outlined"
                            size="small"
                            ampm={false}
                            format="dd/MM/yyyy HH:mm"
                            value={dateStart}
                            onChange={date => { handleDateStart(date); onChangeFilter(date, dateEnd, userId); }}
                        />
                        <Typography variant="subtitle1" style={{ marginRight: 20 }}>ถึง</Typography>
                        <KeyboardDateTimePicker
                            style={{ backgroundColor: "white", width: "220px", marginRight: 20 }}
                            inputVariant="outlined"
                            onChange={date => { handleDateEnd(date); onChangeFilter(dateStart, date, userId); }}
                            size="small"
                            ampm={false}
                            format="dd/MM/yyyy HH:mm"
                        />
                    </MuiPickersUtilsProvider>
                    <TextField
                        style={{ backgroundColor: "white", width: "220px", marginRight: 20 }}
                        select
                        size="small"
                        variant="outlined"
                        fullWidth
                        value={userId}
                        onChange={(e) => {
                            setUserId(e.target.value);
                            onChangeFilter(dateStart, dateEnd, e.target.value);

                        }}                   >
                        <MenuItem value={0}>พนักงานทังหมด</MenuItem>
                        {
                            users.map((user) => (<MenuItem key={user.id} value={user.id}  >{user.firstName + " " + user.lastName}</MenuItem>))
                        }
                    </TextField>
                </Grid>
            </Grid>

        </div >
    )
}
SectionFilter.propTypes = {
    onSubmitFilter: PropTypes.func.isRequired,
}
