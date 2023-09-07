import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../Utils/Menu';
import DepartmentName from '../Entities/Department/DepartmentName';
import { BreadCrumb, BreadCrumbs } from '../Utils/BreadCrumbs';

const AdminMainView = () => {
    const ctx = useContext(AppContext);

    return (
        <>
            <DepartmentName name={ctx.userData.department} />
            <BreadCrumbs>
                <BreadCrumb to='/'>Home</BreadCrumb>
                <BreadCrumb>Dashboard</BreadCrumb>
            </BreadCrumbs>

            <Menu>
                <MenuItems>
                    <MenuItem text='Batches' tab='batches' />
                    <MenuItem text='Teachers' tab='teachers' />
                </MenuItems>
            </Menu>
            <Outlet />
        </>
    );
};

export default AdminMainView;
