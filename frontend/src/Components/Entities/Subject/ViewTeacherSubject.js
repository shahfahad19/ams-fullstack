import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../../Utils/Menu';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';
import { AlertModal } from '../../Utils/Modal';

const ViewTeacherSubject = () => {
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
            {error.show && <AlertModal type='error' text={error.text} handler={() => ctx.navigate(-1)} />}

            <BreadCrumbs>
                <BreadCrumb to='/'>Home</BreadCrumb>
                <BreadCrumb to='/teacher'>Subjects</BreadCrumb>
                {subject.name && (
                    <>
                        <BreadCrumb>{subject.name}</BreadCrumb>
                    </>
                )}
                {!subject.name && <BreadCrumb>Loading...</BreadCrumb>}
            </BreadCrumbs>
            <Menu>
                <MenuItems>
                    <MenuItem text='Attendances' tab='attendance' />
                    <MenuItem text='Take Attendance' tab='take-attendance' />
                    <MenuItem text='Remove Subject' tab='remove' />
                </MenuItems>
            </Menu>
            <Outlet context={[subject, setSubject]} />
        </>
    );
};

export default ViewTeacherSubject;
