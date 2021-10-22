import { Button, Grid } from '@material-ui/core'
import { Add } from '@material-ui/icons';
import MaterialTable from 'material-table'
import React, { useState, useEffect } from 'react'
import SideMenu from '../main/SideMenu'
import ItemService from '../../../services/ItemService';
import Service from '../../../services/Service';
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import history from '../../../history';
import NewLogin from '../../../services/NewLoginService';
import { RouteName } from '../../../models/route_name';
import jwt_decode from "jwt-decode";

export default function ItemListPage() {
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const [loading, setLoading] = useState(false);
    const [units, setUnits] = useState([]);
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);

    const token = localStorage.getItem('token');
    var decoded = jwt_decode(token);


    function convertCategories(id) {
        return categories.filter(category => category.id === id).map(category => category.name);
    }
    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };

    const service = new Service(token, { onError: handleError, onUnAuthorized: () => NewLogin() });
    const itemService = new ItemService(token, { onError: handleError, onUnAuthorized: () => NewLogin() });

    useEffect(() => {
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
            setUnits(res);

        }

        const getItems = async () => {
            let queryParams = {};
            setLoading(true);
            var res = await itemService.list(queryParams);
            if (!res) {
                setLoading(false);
                return;
            }
            setItems(res);
            setLoading(false);
        };

        getCategories();
        getUnits();
        getItems();
    }, [])

    const dataRow = items.map(item => {
        if (decoded.licenseExpired) {
            return { item: item, name: item.name, category: convertCategories(item.categoryId), sellPrice: item.sellPrice, costPrice: item.costPrice };
        } else {
            return { item: item, name: item.name, category: convertCategories(item.categoryId), sellPrice: item.sellPrice, costPrice: item.costPrice, inStock: item.inStock };

        }
    });

    return (
        <div>
            <SideMenu title={'สินค้า'} license={false}>
                <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <MaterialTable

                            columns={decoded.licenseExpired ?
                                [
                                    { title: 'ชื่อสินค้า', field: 'name' },
                                    { title: 'หมวดหมู่', field: 'category' },
                                    { title: 'ราคา', field: 'sellPrice', type: 'numeric' },
                                    { title: 'ต้นทุน', field: 'costPrice', type: 'numeric' },

                                ] :
                                [
                                    { title: 'ชื่อสินค้า', field: 'name' },
                                    { title: 'หมวดหมู่', field: 'category' },
                                    { title: 'ราคา', field: 'sellPrice', type: 'numeric' },
                                    { title: 'ต้นทุน', field: 'costPrice', type: 'numeric' },
                                    { title: 'คลัง', field: 'inStock', type: 'numeric' },
                                ]}
                            data={dataRow}
                            onRowClick={(event, data) => history.push(RouteName.ITEM_DETAIL, { item: data.item, units: units, categories: categories })}

                            actions={[
                                {
                                    icon: "add",
                                    tooltip: "add item",
                                    isFreeAction: true,
                                    onClick: (event, rowData) => { console.log("click row data . . ."); }
                                }
                            ]}
                            components={{
                                Action: props => (<Button
                                    variant="contained"
                                    size="medium"
                                    color="primary"
                                    startIcon={<Add />}
                                    onClick={() => history.push(RouteName.ITEM_DETAIL, { item: null, units: units, categories: categories })}
                                >เพิ่มสินค้าใหม่</Button>)
                            }}
                            isLoading={loading}
                            options={{
                                pageSize: 10,
                                pageSizeOptions: [5, 10, 25, 50, 100],
                                search: true,
                                searchFieldVariant: 'outlined',
                                searchFieldStyle: { height: 40 },
                                headerStyle: { position: 'sticky', top: 0, fontWeight: 700 },
                                showTitle: false,
                                toolbarButtonAlignment: 'left'

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
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            </SideMenu>

        </div>
    )
}
