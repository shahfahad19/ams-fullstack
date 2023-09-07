import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import DepartmentName from '../Department/DepartmentName';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';
import Menu, { MenuItem, MenuItems } from '../../Utils/Menu';

const ViewStudent = () => {
    const ctx = useContext(AppContext);
    const params = useParams();
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const getData = async () => {
            await axios
                .get(`${ctx.baseURL}/users/students/${params.studentId}`, {
                    credentials: 'include',
                })
                .then((response) => {
                    setStudent(response.data.data.student);
                })
                .catch((error) => {
                    ctx.handleError(error);
                });
        };

        getData();
    }, []);

    return (
        <>
            {ctx.userData.role === 'admin' && <DepartmentName name={ctx.userData.department} />}
            {ctx.userData.role === 'super-admin' && student && <DepartmentName name={student.batch.admin.department} />}

            <BreadCrumbs>
                <BreadCrumb to='/'>Home</BreadCrumb>
                <BreadCrumb to='../batches'>Batches</BreadCrumb>
                {student && (
                    <>
                        <BreadCrumb to={`../batch/${student.batch._id}`}>Batch {student.batch.name}</BreadCrumb>
                        <BreadCrumb to={`../batch/${student.batch._id}/students`}>Students</BreadCrumb>

                        <BreadCrumb>{student.name}</BreadCrumb>
                    </>
                )}
                {!student && <BreadCrumb>Loading...</BreadCrumb>}
            </BreadCrumbs>
            <Menu>
                <MenuItems>
                    <>
                        <MenuItem text='Info' tab='info' />
                        <MenuItem text='Attendances' tab='attendance' />
                        <MenuItem text='Edit Info' tab='edit' />
                    </>
                </MenuItems>
            </Menu>
            <Outlet context={[student, setStudent]} />
        </>
    );
};

export default ViewStudent;
