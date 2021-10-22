import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import jwt from 'jwt-decode';

import { Grid, Chip, TextField, MenuItem, Avatar } from '@material-ui/core';
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import ItemService from '../../../services/ItemService';
import Service from '../../../services/Service';
import SideMenu from '../main/SideMenu';
import MaterialTable from 'material-table'
import NewLogin from '../../../services/NewLoginService';
import { Image } from '@material-ui/icons';
import jwt_decode from "jwt-decode";
import { RouteName } from '../../../models/route_name';

export default function StockHomePage() {
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const [loading, setLoading] = useState(false);
    const [unit, setUnit] = useState([]);

    function converUnits(items) {
        return unit.filter(item => items === item.value).map(item => item.display);
    }
    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };

    const token = localStorage.getItem('token');
    var decoded = jwt_decode(token);

    const service = new Service(token, { onError: handleError, onUnAuthorized: () => NewLogin() });
    const itemService = new ItemService(token, { onError: handleError, onUnAuthorized: () => NewLogin() });
    const [categories, setCategories] = useState([]);
    const [categoryIdSelected, setCategoryIdSelected] = useState(0);
    const [itemLists, setItemList] = useState([]);
    const [licenseExpired, setLicenseExpired] = useState(false);


    const getItems = async () => {
        let queryParams = {};
        if (categoryIdSelected !== 0) {
            queryParams = { "categoryId": categoryIdSelected === 0 ? {} : categoryIdSelected };
        }

        setLoading(true);
        var res = await itemService.list(queryParams);
        if (!res) {
            setLoading(false);
            return;
        }
        setItemList(res);
        setLoading(false);
    };
    const getCategories = async () => {
        const res = await service.getCategories();
        if (!res) {
            return;
        }
        setCategories(res);
    };
    const getUnits = async () => {
        const res = await service.getUnits();
        if (!res) {
            return;
        }
        setUnit(res);
    };

    useEffect(() => {
        const user = jwt(token);
        setLicenseExpired(user.licenseExpired);

        getUnits();
        getCategories();
        getItems();

    }, [categoryIdSelected]);

    const checkStock = (safetyStock, inStock) => {
        if (inStock <= safetyStock) {
            return true;
        }
        return false;
    };

    const handleSearchByDropdown = async (event) => {
        setCategoryIdSelected(event.target.value);
        getItems();
    }

    const dataRow = itemLists.map(item => {
        if (licenseExpired) {
            return {
                item: item,
                itemId: item.id,
                img: item.imageUrl,
                name: item.name,
                sellPrice: item.sellPrice,
                stock: item.inStock,
                unit: converUnits(item.unit),
            }
        } else {
            return {
                item: item,
                itemId: item.id,
                img: item.imageUrl,
                name: item.name,
                sellPrice: item.sellPrice,
                stock: item.inStock,
                unit: converUnits(item.unit),
                status: checkStock(item.safetyStock, item.inStock) ? 'ใกล้หมด' : 'ปกติ'
            }
        }

    });

    const getStatusBackgroundColor = (item) => {
        if (item.stockTracking) {
            if (item.inStock === 0) return 'rgba(255,0,0,0.2)';
            return item.inStock <= item.safetyStock ? 'rgba(243,187,21,0.2)' : 'rgba(61,193,60,0.2)';
        }

        return 'rgba(61,193,60,0.2)';
    }
    const getTextColor = (item) => {
        if (item.stockTracking) {
            if (item.inStock === 0) return 'rgba(255,0,0,1)';
            return item.inStock <= item.safetyStock ? 'rgba(243,187,21,1)' : 'rgba(61,193,60,1)';
        }

        return 'rgba(61,193,60,1)';
    }
    const getBorderColor = (item) => {
        if (item.stockTracking) {
            if (item.inStock === 0) return '1px solid rgba(255,0,0,1)';
            return item.inStock <= item.safetyStock ? '1px solid rgba(243,187,21,1)' : '1px solid rgba(61,193,60,1)';
        }

        return '1px solid rgba(61,193,60,1)';
    }
    const getStatusText = (item) => {
        if (item.stockTracking) {
            if (item.inStock === 0) return 'หมด';
            return item.inStock <= item.safetyStock ? 'ใกล้หมด' : 'ปกติ';
        }

        return 'ปกติ';
    }
    return (
        <SideMenu title='คลังสินค้า' license={licenseExpired} loading={false}>
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <MaterialTable
                        title="สินค้าทั้งหมด"
                        columns={[
                            {
                                title: '', field: 'img', width: "10%", render: rowData => !rowData.img ?
                                    <Avatar style={{ width: "50px", height: '50px' }}><Image /> </Avatar>
                                    : <img src={rowData.img} width="50px" style={{ borderRadius: "50%" }} />
                            },
                            { title: 'ชื่อสินค้า', field: 'name' },
                            { title: 'ราคา', field: 'sellPrice', type: 'numeric' },
                            {
                                title: 'คลัง', field: 'stock', type: 'numeric', render: rowData => <Typography variant="body1" style={{ color: 'black' }}
                                >{rowData.stock}</Typography>
                            },
                            { title: 'หน่วย', field: 'unit', type: 'numeric' },
                            licenseExpired ? {} :
                                {
                                    title: 'สถานะ', field: 'status', align: 'center',
                                    render: rowData => <Chip
                                        label={getStatusText(rowData.item)}
                                        size="medium"
                                        style={{
                                            paddingLeft: 5, paddingRight: 5,
                                            backgroundColor: getStatusBackgroundColor(rowData.item),
                                            color: getTextColor(rowData.item),
                                            border: getBorderColor(rowData.item),
                                        }} />
                                },

                        ]}
                        data={dataRow}
                        isLoading={loading}
                        options={{
                            actionsColumnIndex: -1,
                            actionsCellStyle: { alignContent: 'center' },
                            pageSize: 10,
                            pageSizeOptions: [5, 10, 25, 50, 100],
                            search: true,
                            searchFieldVariant: 'outlined',
                            searchFieldStyle: { height: 40 },
                            headerStyle: { position: 'sticky', top: 0, fontWeight: 700 },
                            toolbarButtonAlignment: "right"
                        }}
                        localization={{
                            body: {
                                emptyDataSourceMessage: 'ไม่มีข้อมูล'
                            },
                            toolbar: {
                                searchPlaceholder: 'ค้นหา'
                            },
                            header: {
                                actions: 'ตัวเลือก',

                            },
                        }}
                        actions={[
                            {
                                icon: "category",
                                tooltip: "category",
                                isFreeAction: true,
                                onClick: () => { }

                            }
                        ]}

                        components={{
                            Action: props => (
                                <TextField
                                    id="category"
                                    select
                                    variant="outlined"
                                    size="small"
                                    margin="none"
                                    style={{ marginLeft: 10, width: "200px" }}
                                    value={categoryIdSelected}
                                    onChange={handleSearchByDropdown}

                                >
                                    <MenuItem value={0}>{"ทั้งหมด"}</MenuItem>
                                    {
                                        categories.map((category) => <MenuItem key={category.name} value={category.id}>{category.name}</MenuItem>)
                                    }
                                </TextField>
                            ),
                        }}
                    />
                </Grid>
            </Grid>

        </SideMenu>
    );
}
