import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../../Utils/Menu';
import DepartmentName from '../Department/DepartmentName';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';
import { AlertModal } from '../../Utils/Modal';

const ViewSubject = () => {
    const params = useParams();
    const ctx = useContext(AppContext);
    const [error, setError] = useState();

    const [subject, setSubject] = useState([]);

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/subjects/${params.subjectId}`, {
                credentials: 'include',
            })
            .then((response) => {
                setSubject(response.data.data.subject);
            })
            .catch((error) => {
                setError(ctx.computeError(error));
            });
    }, []);

    return (
        <>
            {error && <AlertModal type='error' text={error} handler={() => ctx.navigate(-1)} />}

            {subject.name && <DepartmentName name={subject.semester.batch.admin.department} />}
            <BreadCrumbs>
                <BreadCrumb to='/'>Home</BreadCrumb>
                {ctx.userData.role === 'admin' && <BreadCrumb to='../batches'>Batches</BreadCrumb>}
                {subject.name && ctx.userData.role !== 'student' && (
                    <>
                        {ctx.userData.role === 'super-admin' && (
                            <>
                                <BreadCrumb to='../'>Departments</BreadCrumb>
                                <BreadCrumb to={`../department/${subject.semester.batch.admin._id}`}>
                                    {subject.semester.batch.admin.department}
                                </BreadCrumb>
                                <BreadCrumb to={`../department/${subject.semester.batch.admin._id}/batches`}>
                                    Batches
                                </BreadCrumb>
                            </>
                        )}
                        <BreadCrumb to={`./../../batch/${subject.semester.batch._id}`}>
                            Batch {subject.semester.batch.name}
                        </BreadCrumb>
                        <BreadCrumb to={`./../../semester/${subject.semester._id}`}>
                            Semester {subject.semester.name}
                        </BreadCrumb>
                        <BreadCrumb>{subject.name}</BreadCrumb>
                    </>
                )}

                {subject.name && ctx.userData.role === 'student' && (
                    <>
                        <BreadCrumb to='/student'>Semesters</BreadCrumb>
                        <BreadCrumb to={`/${ctx.userData.role}/semester/${subject.semester._id}`}>
                            Semester {subject.semester.name}
                        </BreadCrumb>
                        <BreadCrumb to={`/${ctx.userData.role}/semester/${subject.semester._id}/subjects`}>
                            Subjects
                        </BreadCrumb>
                        <BreadCrumb>{subject.name}</BreadCrumb>
                    </>
                )}
                {!subject.name && <BreadCrumb>Loading...</BreadCrumb>}
            </BreadCrumbs>

            {ctx.userData.role !== 'student' && (
                <Menu>
                    <MenuItems>
                        <>
                            <MenuItem text='Attendance' tab='attendance' />
                            <MenuItem text='Teacher' tab='teacher' />
                            <MenuItem text='Edit Subject' tab='edit' />
                        </>
                    </MenuItems>
                </Menu>
            )}

            <Outlet context={[subject, setSubject]} />
        </>
    );
};

export default ViewSubject;
