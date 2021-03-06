import React, { userState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Add } from '@material-ui/icons';
import MaterialTable from 'material-table';
import ItemService from '../../../services/ItemService';
import { PropTypes } from 'prop-types';
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import NewLogin from '../../../services/NewLoginService';

DialogMaterial.propTypes = {
    onSubmit: PropTypes.func.isRequired,
}

export default function DialogMaterial(props) {
    const { onSubmit } = props;
    const [open, setOpen] = React.useState(false);
    const [items, setItems] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };
    const token = localStorage.getItem('token');
    const itemService = new ItemService(token, { onError: handleError, onUnAuthorized: () => NewLogin() });
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



    useEffect(() => {
        const getItems = async () => {
            let queryParams = { 'isDeleted': false, 'isMaterialItem': true };

            var res = await itemService.list(queryParams);
            if (!res) {
                return;
            }
            setItems(res);
        };
        getItems();
    }, [])
    const dataRow = items.map((item) => ({ item: item, sku: item.sku, name: item.name, sellPrice: item.sellPrice, quantity: item.inStock, tableData: { checked: false } }));
    const filterDataChecked = () => {
        const checked = dataRow.filter((data) => (data.tableData.checked === true));
        console.log(checked);
        onSubmit(checked);
        handleClose();
    }
    return (
        <div>
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <Button color="secondary" size="small" variant="contained" startIcon={<Add />} onClick={handleClickOpen}>?????????????????????????????????</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth="md">
                <DialogTitle id="form-dialog-title">?????????????????????????????????????????????</DialogTitle>
                <DialogContent>
                    <MaterialTable
                        columns={[
                            { title: 'SKU', field: 'sku' },
                            { title: '??????????????????', field: 'name' },
                            { title: '????????????', field: 'sellPrice', type: 'numeric' },
                            { title: '?????????????????????????????????', field: 'quantity', type: 'numeric' },

                        ]}
                        data={dataRow}

                        options={{
                            selection: true,
                            showTextRowsSelected: true,
                            showTitle: false,
                            search: false,
                            toolbar: false,
                            headerStyle: {
                                backgroundColor: '#EEEEEE',
                            },

                        }}
                        style={{
                            border: '1px solid rgba(213,213,213,1)',
                            backgroundColor: 'white',
                            boxShadow: 'none'
                        }}

                        isLoading={loading}
                        localization={{
                            body: {
                                emptyDataSourceMessage: '?????????????????????????????????'
                            },
                            toolbar: {
                                searchPlaceholder: '???????????????',
                            },
                            header: {
                                actions: '????????????????????????',
                            }
                            ,
                        }}



                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="inherit" variant="outlined">
                        ??????????????????
                    </Button>
                    <Button onClick={() => filterDataChecked()} color="secondary" variant="contained">
                        ????????????
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
