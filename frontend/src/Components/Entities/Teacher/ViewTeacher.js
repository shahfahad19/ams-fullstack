import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../../Utils/Menu';
import DepartmentName from '../Department/DepartmentName';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';
import { AlertModal } from '../../Utils/Modal';

const ViewTeacher = () => {
    const params = useParams();
    const ctx = useContext(AppContext);

    const [teacher, setTeacher] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/users/teachers/${params.teacherId}`, {
                credentials: 'include',
            })
            .then((response) => {
                setTeacher(response.data.data.teacher);
            })
            .catch((error) => {
                setError(ctx.computeError(error));
            });
    }, []);

    return (
        <>
            {error && <AlertModal type='error' text={error} handler={() => ctx.navigate(-1)} />}

            {ctx.userData.role === 'admin' && <DepartmentName name={ctx.userData.department} />}
            {ctx.userData.role === 'super-admin' && teacher && (
                <DepartmentName name={teacher.departmentId.department} />
            )}

            <BreadCrumbs>
                <BreadCrumb to='/'>Home</BreadCrumb>
                {ctx.userData.role === 'super-admin' && teacher && (
                    <>
                        <BreadCrumb to='../'>Departments</BreadCrumb>
                        <BreadCrumb to={`../department/${teacher.departmentId._id}`}>
                            {teacher.departmentId.department}
                        </BreadCrumb>
                        <BreadCrumb to={`../department/${teacher.departmentId._id}/teachers`}>Teachers</BreadCrumb>
                    </>
                )}

                {ctx.userData.role === 'admin' && <BreadCrumb to='../teachers'>Teachers</BreadCrumb>}
                {!teacher && <BreadCrumb>Loading...</BreadCrumb>}
                {teacher && <BreadCrumb>{teacher.name}</BreadCrumb>}
            </BreadCrumbs>
            <Menu>
                <MenuItems>
                    <>
                        <MenuItem text='Info' tab='info' />
                        <MenuItem text='Subjects' tab='subjects' />
                        <MenuItem text='Edit' tab='edit' />
                    </>
                </MenuItems>
            </Menu>
            <Outlet context={[teacher, setTeacher]} />
        </>
    );
};

export default ViewTeacher;
