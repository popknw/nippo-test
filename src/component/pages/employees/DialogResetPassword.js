import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Grid, FormControl, TextField, Container } from '@material-ui/core';
import { PropTypes } from 'prop-types';



export default function DialogResetPassword(props) {
    const { userId, onSubmit } = props;
    const [open, setOpen] = React.useState(false);
    const [showError, setShowError] = React.useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const verifyPassword = (n, c) => {
        if (n === c) {
            return true;
        }
        return false;
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };



    return (
        <div>
            <Button size="small" variant="outlined" style={{ color: "#FAAD14", border: "1px solid rgba(255,173,20,1)", backgroundColor: "rgba(255,173,20,0.2)", width: '120px', height: '35px', margin: ' 5px' }}
                onClick={handleClickOpen}>
                เปลี่ยนรหัสผ่าน
            </Button>
            <Dialog aria-labelledby="customized-dialog-title" open={open} maxWidth="sm" fullWidth>
                <DialogTitle id="customized-dialog-title" onClose={handleClose} >
                    เปลี่ยนรหัสผ่านใหม่
                </DialogTitle>
                <DialogContent dividers>

                    <Container maxWidth="md" >
                        {showError && (!password && !confirmPassword) ?
                            <Typography gutterBottom color="secondary">
                                กรุณากรอกรหัสผ่าน เพื่อทำการเปลี่ยนรหัส!
                            </Typography> :
                            null
                        }

                        <Grid item sm={12} xs={12}>
                            <Grid item sm={12} xs={12}>
                                <Typography variant="subtitle1">
                                    รหัสผ่านใหม่
                                </Typography>
                                <FormControl fullWidth size="small" variant="outlined">
                                    <TextField
                                        onChange={e => setPassword(e.target.value)}
                                        size="small"
                                        type={'password'}
                                        value={password}
                                        variant="outlined"
                                        placeholder="รหัสผ่านใหม่"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sm={12} xs={12}>
                                <Typography variant="subtitle1">
                                    ยืนยันรหัสผ่านใหม่
                                </Typography>
                                <FormControl fullWidth size="small" variant="outlined">
                                    <TextField
                                        error={!verifyPassword(password, confirmPassword)}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        size="small"
                                        type={'password'}
                                        value={confirmPassword}
                                        variant="outlined"
                                        placeholder="ยื่นยันรหัสผ่าน"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Container>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="secondary">
                        ยกเลิก
                    </Button>
                    <Button autoFocus
                        disabled={!verifyPassword(password, confirmPassword)}
                        onClick={(e) => {
                            if (!password && !confirmPassword) {
                                setShowError(true)
                            }
                            else {
                                onSubmit(password, userId)
                                handleClose()

                            }

                        }
                        }
                        color="primary">
                        ตกลง
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}


DialogResetPassword.propTypes = {
    userId: PropTypes.number.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);
