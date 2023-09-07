import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Table from '../../Utils/Table';

import SubSectionHeader from '../../Utils/SubSectionHeader';
import { CheckIcon, CrossIcon } from '../../Utils/Icons';

const TeacherList = () => {
    const params = useParams();
    const [teachers, setTeachers] = useState([]);
    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const ctx = useContext(AppContext);

    useEffect(() => {
        const url =
            ctx.userData.role === 'super-admin'
                ? `${ctx.baseURL}/users/teachers?dept=${params.departmentId}&sort=name`
                : `${ctx.baseURL}/users/teachers?sort=name`;
        axios
            .get(url, {
                credentials: 'include',
            })
            .then((response) => {
                setErrorMessage('');
                isLoading(false);
                setTeachers(response.data.data.teachers);
                if (response.data.data.teachers.length === 0) {
                    setErrorMessage('No teachers found');
                }
            })
            .catch((error) => {
                if (error.response) setErrorMessage(error.response.data.message);
                else setErrorMessage(error.message);
                isLoading(false);
            });
    }, []);

    const viewTeacher = (teacherId) => {
        ctx.navigate(ctx.userData.role + '/teacher/' + teacherId);
    };
    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Teachers' showBtn={true} btnLink='../add-teacher' btnText='Add Teacher' />
            <Table loading={loading} error={errorMessage}>
                <thead>
                    <tr>
                        <th></th>
                        <th className='normal-case font-medium text-sm'>Photo</th>
                        <th className='normal-case font-medium text-sm'>Name</th>
                        <th className='normal-case font-medium text-sm'>Email</th>

                        <th className='normal-case font-medium text-sm'>Gender</th>
                        <th className='normal-case font-medium text-sm'>Designation</th>
                        <th className='normal-case font-medium text-sm'>
                            Approved
                            <span
                                className='tooltip tooltip-left no-border'
                                data-tooltip=' It indicates wether the teacher has completed their profile or not'
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='w-5 h-5 ml-1 -mt-0.5 inline no-border'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z'
                                    />
                                </svg>
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.length > 0 &&
                        teachers.map((teacher, index) => {
                            return (
                                <tr
                                    className='cursor-pointer'
                                    key={index}
                                    onClick={() => {
                                        viewTeacher(teacher._id);
                                    }}
                                >
                                    <th>{index + 1}</th>
                                    <td>
                                        <div className='popover popover-hover'>
                                            <img
                                                className='w-10 popover-trigger rounded-full'
                                                src={teacher.photo}
                                                alt={teacher.name + '_pic'}
                                            />
                                            <div className='popover-content sm:popover-right'>
                                                <div className='popover-arrow'></div>
                                                <img src={teacher.photo} alt={teacher.name + '_pic'} />
                                            </div>
                                        </div>
                                    </td>
                                    <td>{teacher.name}</td>
                                    <td>{teacher.email}</td>
                                    <td>{teacher.gender === 'male' ? 'Male' : 'Female'}</td>
                                    <td>{teacher.designation}</td>
                                    <td>
                                        {teacher.approved && <CheckIcon />}
                                        {!teacher.approved && <CrossIcon />}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
};

export default TeacherList;
