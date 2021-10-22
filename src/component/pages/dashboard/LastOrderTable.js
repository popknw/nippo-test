import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {CircularProgress,Grid} from '@material-ui/core';
import {dataTableService} from '../../../services';
var dateFormat = require('dateformat');

function LastOrderTableHeader(props) {
    const {classes, order, orderBy, onSortButtonClick} = props;

    return (
        <TableHead>
            <TableRow>
                <TableCell align="left"> 
                    <TableSortLabel
                        direction={orderBy === 'createdAt' ? order : 'asc'}
                        onClick={() => {onSortButtonClick('createdAt');}}
                    >
                        <Typography className={classes.tableHeadAlign} variant="body2">
                            วันที่
                        </Typography>
                    </TableSortLabel> 
                </TableCell> 
                <TableCell align="left"> 
                    <TableSortLabel
                        direction={orderBy === 'id' ? order : 'asc'}
                        onClick={() => {onSortButtonClick('id');}}
                    >
                        <Typography className={classes.tableHeadAlign} variant="body2">
                            หมายเลขคำสั่งซื้อ
                        </Typography>
                    </TableSortLabel> 
                </TableCell> 
                <TableCell align="left"> 
                    <TableSortLabel
                        direction={orderBy === 'fullName' ? order : 'asc'}
                        onClick={() => {onSortButtonClick('fullName');}}
                    >
                        <Typography className={classes.tableHeadAlign} variant="body2">
                            ชื่อลูกค้า
                        </Typography>
                    </TableSortLabel> 
                </TableCell> 
                
                <TableCell align="right"> 
                    <TableSortLabel
                        direction={orderBy === 'subtotalAmount' ? order : 'asc'}
                        onClick={() => {onSortButtonClick('subtotalAmount');}}
                    >
                        <Typography className={classes.tableHeadAlign} variant="body2">
                            ยอดชำระ
                        </Typography>
                    </TableSortLabel> 
                    
                </TableCell> 
                <TableCell align="right"> 
                    <TableSortLabel
                        direction={orderBy === 'paymentMethod' ? order : 'asc'}
                        onClick={() => {onSortButtonClick('paymentMethod');}}
                    >
                        <Typography className={classes.tableHeadAlign} variant="body2">
                            ประเภทการชำระเงิน
                        </Typography>
                    </TableSortLabel>
                    
                </TableCell> 
            
            </TableRow>
        </TableHead>
    );
}

LastOrderTableHeader.propTypes = {
    classes: PropTypes.object.isRequired,
    onSortButtonClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};

const useStyles = makeStyles(() => ({
    ChartSum:{
        height: 255,
        margin: 2,
    },
    GridChartSum:{
        marginRight:50,
        marginTop:10
    },
    best_seller:{
        height: 255,
        margin: 2,
    },
    boxGraph:{
        height: 280,
    },
    green: {
        backgroundColor: '#00A110',
        color: '#EFEFEF',
    },
    lowStockTableMaginTop:{
        marginTop:15
    },
    pamary:{
        backgroundColor: '#1760AD',
        color: '#EFEFEF',
    },
    red: {
        backgroundColor: '#FF0000',
        color: '#EFEFEF',
    },
    root: {
        height: 100,
        margin: 2 
    },
    space: {
        margin: 2,
    },
    table: {
        minWidth: 780,
    },
    tableHeadAlign:{
        fontWeight: 650,
    },
    text_blue:{
        color: '#1760AD',
    },
    text_red: {
        backgroundColor: '#FF0000',
        borderRadius: 5,
        color: '#EFEFEF',
        minWidth: 80,
        paddingLeft: 8,
        paddingRight: 8,
    },
    text_white_bold:{
        color: '#EFEFEF' 
    },
    text_yellow: {
        backgroundColor: '#ffde2c',
        borderRadius: 5,
        color: '#000',
        minWidth: 80,
        paddingLeft: 8,
        paddingRight: 8,
    }
}));

export default function LastOrdersTable(props) {
    const {orders, isLoading} = props;
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleSortButtonClick = (property) => {
        const isDesc = orderBy === property && order === 'asc';
        setOrder(isDesc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function renderRows(){  
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, orders.length - page * rowsPerPage);
        if(isLoading){
            return(
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={2}/>
                        <TableCell align="right">
                            {isLoading && <CircularProgress size={18}/>} 
                        </TableCell>
                        <TableCell colSpan={2}/>
                    </TableRow>
                </TableBody>
            );
        }

        if(orders.length == 0) {
            return (
                <TableBody>
                    <TableRow style={{height: 53 * emptyRows}}>
                        <TableCell colSpan={2}/>
                        <TableCell align="center">
                            <Typography variant="body1">
                                ไม่มีข้อมูล
                            </Typography>
                        </TableCell>
                        <TableCell colSpan={2}/>
                    </TableRow>
                </TableBody>
            );
        }
        
        return(
            <TableBody>
                {dataTableService.stableSort(orders, dataTableService.getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                        return (
                            <TableRow key={row.id} tabIndex={-1} style={{height:60}}>
                                <TableCell align="left"> 
                                    <Typography variant="body2">
                                        { dateFormat((row.createdAt), 'mm/dd/yyyy HH:MM')} 
                                    </Typography>
                                </TableCell>
                                <TableCell align="left"> 
                                    <Typography variant="body2">
                                        {row.id}
                                    </Typography>
                                </TableCell>
                                <TableCell align="left"> 
                                    <Typography variant="body2">
                                        {row.fullName}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right"> 
                                    <Typography variant="body2">
                                        { new Intl.NumberFormat().format(row.subtotalAmount)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right"> 
                                    <Typography variant="body2">
                                        {row.paymentMethod}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                {emptyRows > 0 && (
                    <TableRow style={{height: 53 * emptyRows}}>
                        <TableCell colSpan={6}/>
                    </TableRow>
                )}
            </TableBody>
        );
    }
    
    return (
        <Paper className={classes.paper}>
            <Grid className={classes.space} container justify="center" spacing={3}>
                <Grid className={classes.space} item sm={12} xs={12}>
                    <Typography className={classes.text_blue} variant="h6"> 
                        {orders.length}
                        {' '}
                        ออร์เดอร์ล่าสุด
                    </Typography> 
                </Grid>
            </Grid>
            <TableContainer>
                <Table
                    className={classes.table}
                >
                    <LastOrderTableHeader
                        classes={classes}
                        onSortButtonClick={handleSortButtonClick}
                        order={order}
                        orderBy={orderBy}
                        rowCount={orders.length}
                    />
                    { 
                        renderRows()
                    }
                        
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={orders.length}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Paper>
    );
}
LastOrdersTable.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    orders: PropTypes.array.isRequired
};
