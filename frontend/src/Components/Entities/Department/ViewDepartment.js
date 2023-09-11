import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../../Utils/Menu';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';
import DepartmentName from './DepartmentName';
import { AlertModal } from '../../Utils/Modal';

const ViewDepartment = () => {
    const params = useParams();
    const ctx = useContext(AppContext);

    const [department, setDepartment] = useState({
        department: '',
    });

    const [error, setError] = useState();

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/users/department/${params.departmentId}`, {
                credentials: 'include',
            })
            .then((response) => {
                setDepartment(response.data.data.department);
            })
            .catch((error) => {
                setError(ctx.computeError(error));
            });
    }, []);

    return (
        <>
            {error.show && <AlertModal type='error' text={error.text} handler={() => ctx.navigate(-1)} />}

            {department.department && <DepartmentName name={department.department} />}
            <BreadCrumbs>
                <BreadCrumb to='/'>Home</BreadCrumb>
                <BreadCrumb to='../'>Departments</BreadCrumb>
                {department.department !== '' && <BreadCrumb>{department.department}</BreadCrumb>}
                {department.department === '' && <BreadCrumb>Loading...</BreadCrumb>}
            </BreadCrumbs>
            <Menu>
                <MenuItems>
                    <MenuItem text='Info' tab='info' />
                    <MenuItem text='Batches' tab='batches' />
                    <MenuItem text='Teachers' tab='teachers' />
                    <MenuItem text='Subjects' tab='subjects' />
                </MenuItems>
            </Menu>
            <Outlet context={[department, setDepartment]} />
        </>
    );
};

export default ViewDepartment;
