import React, { useEffect, useState } from 'react';
import {
    Button,
    CircularProgress,
    Grid,

} from '@material-ui/core';
import SideMenu from '../main/SideMenu';
import Service from '../../../services/Service';
import UserService from '../../../services/UserService';
import AlertMessage, { useAlertMessage } from '../../AlertMessage';
import history from '../../../history';
import LoginService from '../../../services/LoginService';
import jwt from 'jwt-decode';
import MaterialTable from 'material-table'
import { PersonAdd } from '@material-ui/icons';
import DialogResetPassword from './DialogResetPassword';
import DialogDeleteUser from './DialogDeleteUser';
import NewLogin from '../../../services/NewLoginService';
import { RouteName } from '../../../models/route_name';



export default function UsersManagementPage() {
    const [messageAlert, closeMessage, showMessage] = useAlertMessage();
    const [loading, setLoading] = useState(false);

    const handleError = (e) => {
        const errorMessage = e.response ? e.response.data.error : e.message;
        showMessage(errorMessage, 'error');
    };

    const Authorized = () => {
        NewLogin();
    };

    const token = localStorage.getItem('token');
    const service = new Service(token, { onError: handleError, onUnAuthorized: Authorized });
    const userService = new UserService(token, { onError: handleError, onUnAuthorized: Authorized });
    const [listUsers, setListUsers] = useState([]);
    const [user, setUser] = useState({});

    const [open, setOpen] = React.useState(false);
    const [licenseExpired, setLicenseExpired] = useState(false);



    const lodeUser = async (id) => {
        if (id) {
            const res = await userService.getUser(id);
            setUser(res);
            setDialog(true);
        }
    };
    const [roles, setRoles] = useState([]);

    const createUser = async (data) => {
        const res = await userService.createUser(data);
        if (!res) {
            return;
        }
        dialogClose();
        window.location.href = '/users';
    };
    const updateUser = async (id, data) => {
        const res = await userService.updateUser(id, data);
        if (!res) {
            return;
        }
        dialogClose();
        window.location.href = '/users';
    };
    const deleteUser = async (id) => {
        const res = await userService.deleteUser(id);
        if (!res) {
            return;
        }
        window.location.href = '/users';
    };
    const resetPassword = async (dataResetPassword) => {
        const res = await userService.resetPassword(dataResetPassword);
        if (!res) {
            return;
        }
        window.location.href = '/users';
    };

    const [dialog, setDialog] = useState(false);
    const dialogClose = () => {
        setDialogResetPassword(false);
        setDialog(false);
    };
    const onSubmit = (userId, firstName, lastName, email, password, role) => {

        if (!password && userId) {
            updateUser(userId, { email, firstName, lastName, role });
        }
        if (!userId && password) {
            createUser({ email, firstName, lastName, password, role });
        }
        if (password && userId) {
            resetPassword({ password, userId });
        }
    };

    const getRoleDisplayTxt = (userRole) => {
        return roles.filter((role) => userRole === role.value).map((role) => role.display);
    };

    const [dialogResetPassword, setDialogResetPassword] = useState(false);
    const openModelResetPassword = (id) => {
        if (id) {
            lodeUser(id);
            setDialog(true);
            setDialogResetPassword(true);
        }
    };

    useEffect(() => {
        const user = jwt(token);
        setLicenseExpired(user.licenseExpired);

        (async () => {
            setLoading(true);
            const loadRoles = async () => {
                const res = await service.getRoles();
                if (!res) {
                    return;
                }
                setRoles(res);
            };
            const loadUsers = async () => {
                const res = await userService.getUsers();
                if (!res) {
                    return;
                }
                setListUsers(res);
            };
            await loadRoles();
            await loadUsers();
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const rowData = listUsers.map(row => {
        return {
            userId: row.id,
            fullName: `${row.firstName + ' ' + row.lastName}`,
            email: row.email,
            role: getRoleDisplayTxt(row.role),
        }
    });
    return (
        <SideMenu title='จัดการพนักงาน' license={licenseExpired} loading={false}>
            <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
            <Grid container justify="flex-end" spacing={2}>
                <Grid item sm={12} xs={12}>
                    <MaterialTable

                        columns={[
                            { title: 'รหัสพนักงาน', field: 'userId', align: 'left' },
                            { title: 'ชื่อพนักงาน', field: 'fullName' },
                            { title: 'ชื่อผู้ใช้', field: 'email' },
                            { title: 'ตำแหน่ง', field: 'role' }
                        ]}
                        data={rowData}
                        title="พนักงานทั้งหมด"
                        actions={[
                            {
                                icon: 'person_add',
                                isFreeAction: true,
                                tooltip: 'เพิ่มผู้ใช้',

                            },
                            {
                                icon: 'more_vert',
                                tooltip: 'เปลี่ยนรหัสผ่าน',
                                onClick: (e, row) => openModelResetPassword(row.userId)
                            },
                            {
                                icon: 'delete',
                                tooltip: 'ลบ',
                                iconProps: { color: "secondary" }
                            },

                        ]}
                        options={{
                            showTitle: false,
                            search: true,
                            searchFieldVariant: 'outlined',
                            searchFieldStyle: { height: 40 },
                            actionsColumnIndex: -1,
                            pageSize: 10,
                            headerStyle: {
                                position: 'sticky',
                                top: 0,
                                fontWeight: 700
                            },
                            toolbarButtonAlignment: 'left',
                        }}
                        localization={{
                            body: {
                                emptyDataSourceMessage: loading ? (<CircularProgress />) : 'ไม่มีข้อมูล'
                            },
                            toolbar: {
                                searchPlaceholder: 'ค้นหา'
                            },
                            header: {
                                actions: 'ตัวเลือก',
                            }
                        }}

                        components={{

                            Action: props => {
                                if (props.action.icon == "delete") {
                                    return <DialogDeleteUser userId={props.data.userId} email={props.data.email} onSubmit={(userId) => deleteUser(userId)} />
                                } else if (props.action.icon == "person_add") {
                                    return <Button variant="contained" size="large" color="primary" startIcon={<PersonAdd />} onClick={() => history.push(RouteName.USERS_DETAIL)}>เพิ่มพนักงานใหม่</Button>
                                }
                                else {
                                    return <DialogResetPassword
                                        userId={props.data.userId}
                                        onSubmit={(password, userId) => onSubmit(userId, '', '', '', password, '')}
                                    />
                                }

                            },


                        }}
                    />

                    <AlertMessage messageAlert={messageAlert} onClose={closeMessage} />
                </Grid>
            </Grid>

        </SideMenu>
    );
}

