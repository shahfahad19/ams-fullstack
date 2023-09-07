import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../../Utils/Menu';
import DepartmentName from '../Department/DepartmentName';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';

const ViewBatch = () => {
    const params = useParams();
    const ctx = useContext(AppContext);

    const [batch, setBatch] = useState();

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/batches/${params.batchId}`, {
                credentials: 'include',
            })
            .then((response) => {
                setBatch(response.data.data.batch);
            })
            .catch((error) => {
                ctx.handleError(error);
            });
    }, []);

    return (
        <>
            {batch && <DepartmentName name={batch.admin.department} />}
            <BreadCrumbs>
                <BreadCrumb to='/'>Home</BreadCrumb>
                {ctx.userData.role === 'admin' && <BreadCrumb to='/admin/batches'>Batches</BreadCrumb>}

                {batch && (
                    <>
                        {ctx.userData.role === 'super-admin' && (
                            <>
                                <BreadCrumb to='../'>Departments</BreadCrumb>
                                <BreadCrumb to={`../department/${batch.admin._id}`}>
                                    {batch.admin.department}
                                </BreadCrumb>
                                <BreadCrumb to={`../department/${batch.admin._id}/batches`}>Batches</BreadCrumb>
                            </>
                        )}
                        <BreadCrumb>Batch {batch.name}</BreadCrumb>
                    </>
                )}

                {!batch && <BreadCrumb>Loading...</BreadCrumb>}
            </BreadCrumbs>
            <Menu>
                <MenuItems>
                    <MenuItem text='Semesters' tab='semesters' />
                    <MenuItem text='Students' tab='students' />
                    <MenuItem text='Edit Batch' tab='edit' />
                    <MenuItem text='Invite Link' tab='invite' />
                </MenuItems>
            </Menu>
            <Outlet context={[batch, setBatch]} />
        </>
    );
};

export default ViewBatch;
