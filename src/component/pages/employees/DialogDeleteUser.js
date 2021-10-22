import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { PropTypes } from 'prop-types';
import { Typography } from '@material-ui/core';

export default function DialogDeleteUser(props) {
    const { userId, email, onSubmit } = props;
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button
                size="small"
                variant="outlined"
                color="secondary"
                style={{
                    color: "rgba(255,0,0,1)",
                    border: "1px solid rgba(255,0,0,1)",
                    backgroundColor: "rgba(255,0,0,0.2)",
                    width: '60px', height: '35px',
                    margin: ' 5px'
                }}
                onClick={handleClickOpen}
            >
                ลบ
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">ลบรายชื่อพนักงาน</DialogTitle>
                <DialogContent dividers>
                    <DialogContentText id="alert-dialog-description">
                        <Typography > คุณต้องการลบข้อมูลผู้ใช้ "{email}"ใช่หรือไม่ </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions dividers>

                    <Button onClick={handleClose} color="secondary">
                        ยกเลิก
                    </Button>
                    <Button onClick={() => onSubmit(userId)} color="primary" autoFocus>
                        ตกลง
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

DialogDeleteUser.propTypes = {
    userId: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
}
