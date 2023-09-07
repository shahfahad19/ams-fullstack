import React, { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import DepartmentName from '../Entities/Department/DepartmentName';
import axios from 'axios';

const StudentMainView = () => {
    const ctx = useContext(AppContext);
    const [batch, setBatch] = useState();
    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/batches/${ctx.userData.batch}`, {
                credentials: 'include',
            })
            .then((response) => {
                setBatch(response.data.data.batch);
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 404) {
                        ctx.navigate('/404', { replace: true });
                    }
                }
            });
    }, []);

    return (
        <>
            {batch && <DepartmentName name={batch.admin.department} />}
            <Outlet />
        </>
    );
};

export default StudentMainView;
