import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {PropTypes} from 'prop-types';

const defaultMessageAlert = {
    message: '',
    open: false,
    type: ''
};
export function useAlertMessage() {
    const [messageAlert, setMessageAlert] = React.useState(defaultMessageAlert);

    const closeMessage = () => {
        setMessageAlert({...messageAlert, open: false});
    };

    const showMessage = (message, type) => {
        setMessageAlert({message, open: true, type});
    };

    return [messageAlert, closeMessage, showMessage];
}

export default function AlertMessage(props) {
    const {messageAlert = defaultMessageAlert, autoHideDuration = 6000, onClose} = props;
    const {open, type, message} = messageAlert;
    return (
        <Snackbar
            anchorOrigin={{horizontal: 'center', vertical: 'top'}}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            open={open}
        >
            <MuiAlert elevation={6} onClose={onClose} severity={type} variant="filled">
                {message}
            </MuiAlert>
        </Snackbar>
    );
}

AlertMessage.propTypes = {
    autoHideDuration: PropTypes.number,
    messageAlert: PropTypes.object,
    onClose: PropTypes.func,
};
