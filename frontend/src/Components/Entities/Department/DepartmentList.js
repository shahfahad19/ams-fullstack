import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../Context/AppContext';
import Table from '../../Utils/Table';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const ctx = useContext(AppContext);

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/users/departments?sort=department`, {
                credentials: 'include',
            })
            .then((response) => {
                setErrorMessage('');
                isLoading(false);
                setDepartments(response.data.data.departments);
                if (response.data.data.departments.length === 0) {
                    setErrorMessage('No departments found');
                }
            })
            .catch((error) => {
                if (error.response) setErrorMessage(error.response.data.message);
                else setErrorMessage(error.message);
                isLoading(false);
            });
    }, []);

    const openDepartment = (departmentId) => {
        ctx.navigate(`/super-admin/department/${departmentId}`);
    };

    return (
        <div className='departments'>
            <BreadCrumbs>
                <BreadCrumb to='/'>Home</BreadCrumb>
                <BreadCrumb>Departments</BreadCrumb>
            </BreadCrumbs>
            <SubSectionHeader text='Department List' showBtn={true} btnText='Add Department' btnLink='add-department' />

            <Table loading={loading} error={errorMessage}>
                <thead>
                    <tr>
                        <th></th>
                        <th className='normal-case font-medium text-sm'>Department</th>
                        <th className='normal-case font-medium text-sm'>Admin</th>
                        <th className='normal-case font-medium text-sm'>Admin Photo</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.length > 0 &&
                        departments.map((department, index) => {
                            return (
                                <tr
                                    key={department._id}
                                    className='cursor-pointer'
                                    onClick={() => openDepartment(department._id)}
                                >
                                    <th>{index + 1}</th>
                                    <td>{department.department}</td>
                                    <td>{department.email}</td>
                                    <td>
                                        <div className='popover popover-hover'>
                                            <img
                                                className='w-10 popover-trigger rounded-full'
                                                src={department.photo}
                                                alt={department.name + '_pic'}
                                            />
                                            <div className='popover-content sm:popover-left'>
                                                <div className='popover-arrow'></div>
                                                <img src={department.photo} alt={department.name + '_pic'} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
};

export default DepartmentList;
