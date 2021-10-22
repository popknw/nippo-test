import React, { useState, useEffect } from 'react'
import { Button, Chip, Container, Grid } from '@material-ui/core'
import { Add } from '@material-ui/icons';
import MaterialTable from 'material-table'
import SideMenu from '../../main/SideMenu'
import Service from '../../../../services/Service';

import AlertMessage, { useAlertMessage } from '../../../AlertMessage';
import history from '../../../../history';
import { RouteName } from '../../../../models/route_name';
import NewLogin from '../../../../services/NewLoginService';

export default function CategoryListPage() {
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const token = localStorage.getItem('token');

    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };

    const service = new Service(token, { onError: handleError, onUnAuthorized: () => NewLogin() });



    useEffect(() => {
        const getCategories = async () => {
            setLoading(true)
            const categories = await service.getCategories();
            console.log(categories);

            setCategories(categories);
            setLoading(false);
        };
        getCategories();
    }, [])

    const rowData = categories.map((category) => {
        return { category: category, name: category.name, itemQuantity: category.itemCount, isActive: category.isActive };
    })
    return (
        <div>
            <SideMenu>
                <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
                <Container maxWidth="md">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <MaterialTable

                                columns={[
                                    { title: 'ชื่อหมวดหมู่', field: 'name' },
                                    { title: 'จำนวนสินค้า', field: 'itemQuantity', type: 'numeric' },
                                    {
                                        title: 'สถานะ', field: 'isActive', type: 'numeric', render: (rowData => <Chip
                                            label={rowData.isActive ? "เปิด" : "ปิด"}
                                            size="large"
                                            style={{
                                                paddingLeft: 5, paddingRight: 5,
                                                backgroundColor: rowData.isActive === true ? 'rgba(61,193,60,0.2)' : 'rgba(245,34,45,0.2)',
                                                color: rowData.isActive === true ? 'rgba(61,193,60,1)' : 'rgba(245,34,45,1)',
                                                border: rowData.isActive === true ? '1px solid rgba(61,193,60,1)' : '1px solid rgba(245,34,45,1)'
                                            }}
                                        ></Chip>)
                                    }
                                ]}
                                data={rowData}

                                actions={[
                                    {
                                        icon: "add",
                                        tooltip: "add item",
                                        isFreeAction: true,
                                    }
                                ]}
                                components={{
                                    Action: props => (<Button
                                        variant="contained"
                                        size="large"
                                        color="primary"
                                        startIcon={<Add />}
                                        onClick={() => history.push(RouteName.CATEGORIES_DETAIL, { category: null })}

                                    >เพิ่มหมวดหมู่ใหม่</Button>)
                                }}
                                onRowClick={(event, data) => history.push(RouteName.CATEGORIES_DETAIL, { category: data.category })}
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


                </Container>

            </SideMenu>
        </div>
    )
}
