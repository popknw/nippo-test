import { Avatar, Button, Chip, Container } from '@material-ui/core'
import { Add, LocalOfferOutlined } from '@material-ui/icons'
import { pink } from '@material-ui/core/colors';
import MaterialTable from 'material-table'
import React, { useState, useEffect } from 'react'
import Service from '../../../../services/Service'
import AlertMessage, { useAlertMessage } from '../../../AlertMessage'
import SideMenu from '../../main/SideMenu'
import { makeStyles } from '@material-ui/core/styles';
import history from '../../../../history';
import { RouteName } from '../../../../models/route_name';
import NewLogin from '../../../../services/NewLoginService';


export class DiscountType {
    static PERCENTAGE = "percentage";
    static ABSOLUTE = "absolute";
}

const useStyles = makeStyles((theme) => ({
    pink: {
        color: theme.palette.getContrastText(pink[500]),
        backgroundColor: pink[500],
        width: theme.spacing(5),
        height: theme.spacing(5)
    },

}));
export default function DiscountListPage() {
    const classes = useStyles();

    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const [loading, setLoading] = useState(false);
    const [discounts, setDiscounts] = useState([]);
    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };

    const token = localStorage.getItem('token');
    const service = new Service(token, { onError: handleError, onUnAuthorized: () => NewLogin() });

    useEffect(() => {
        const getDiscounts = async () => {
            setLoading(true);
            const discounts = await service.getDiscounts();
            console.log(discounts);


            setDiscounts(discounts);
            setLoading(false);
        };

        getDiscounts();
    }, [])


    const rowData = discounts.map(disc => {
        return { discount: disc, name: disc.code, value: disc.value, discountType: disc.type };
    })


    return (
        <div>
            <SideMenu>
                <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
                <Container maxWidth="md">
                    <MaterialTable
                        title="Simple Action Preview"
                        columns={[
                            { title: '', field: 'image', width: "5%", render: row => (<Avatar className={classes.pink}><LocalOfferOutlined /></Avatar>) },
                            { title: 'ชื่อส่วนลด', field: 'name' },
                            { title: 'จำนวนส่วนลด', field: 'value' },
                            {
                                title: 'ประเภทส่วนลด', field: 'discountType', align: 'right'
                                , render: (rowData => <Chip
                                    label={rowData.discountType === DiscountType.ABSOLUTE ? "จำนวนเงิน" : " เปอร์เซ็น"}
                                    size="medium"
                                    style={{
                                        paddingLeft: 5, paddingRight: 5,
                                        backgroundColor: rowData.discountType === DiscountType.ABSOLUTE ? 'rgba(243,187,21,0.2)' : 'rgba(181,123,255,0.2)',
                                        color: rowData.discountType === DiscountType.ABSOLUTE ? 'rgba(243,187,21,1)' : 'rgba(181,123,255,1)',
                                        border: rowData.discountType === DiscountType.ABSOLUTE ? '1px solid rgba(243,187,21,1)' : '1px solid rgba(181,123,255,1)'
                                    }}
                                ></Chip>)
                            },


                        ]}
                        data={rowData}
                        actions={[
                            {
                                icon: 'save',
                                tooltip: 'Save User',
                                isFreeAction: true,
                                onClick: (event, rowData) => alert("You saved " + rowData.name)
                            }
                        ]}

                        components={{
                            Action: props => (<Button variant="contained" size="medium" color="primary" startIcon={<Add />} onClick={() => history.push(RouteName.DISCOUNTS_DETAIL, { discount: null })}>เพิ่มส่วนลด</Button>)
                        }}
                        isLoading={loading}
                        onRowClick={(event, data) => history.push(RouteName.DISCOUNTS_DETAIL, { discount: data.discount })}
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
                </Container>
            </SideMenu>
        </div>
    )
}
