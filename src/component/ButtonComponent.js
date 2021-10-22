import React, {useEffect} from 'react';
import {Button, CircularProgress, Typography, makeStyles} from '@material-ui/core';
import {PropTypes} from 'prop-types';

const useStyles = makeStyles(() => ({
    button: {
        height: '50px',
    },   
    circular: {
        color: '#fff',
    },
}));

export default function ButtonComponent(props){
    const {onClick, loading, title, disableButton} = props;
    const classes = useStyles();
     
    useEffect(() => {
    },[]);

    return (
        <Button
            className={classes.button}
            color="primary"
            disabled={disableButton}
            fullWidth
            onClick={onClick} 
            variant="contained"
        >
            {loading && <CircularProgress className={classes.circular} size={30}/>}
            {!loading && <Typography variant="body1">{title}</Typography>}
        </Button>
    );
}

ButtonComponent.propTypes = {
    disableButton: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};
