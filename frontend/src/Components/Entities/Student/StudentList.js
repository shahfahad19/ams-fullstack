import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';
import { CheckIcon, CrossIcon } from '../../Utils/Icons';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const ctx = useContext(AppContext);

    const params = useParams();

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/users/students?batch=${params.batchId}&sort=-confirmed,rollNo`, {
                credentials: 'include',
            })
            .then((response) => {
                setErrorMessage('');
                isLoading(false);
                setStudents(response.data.data.students);
                if (response.data.data.students.length === 0)
                    setErrorMessage('No student has signed up for this batch yet');
            })
            .catch((error) => {
                if (error.response) setErrorMessage(error.response.data.message);
                else setErrorMessage(error.message);
                isLoading(false);
            });
    }, []);

    const openStudentInfo = (student_id) => {
        ctx.navigate(`/${ctx.userData.role}/student/${student_id}`);
    };
    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Student List' />

            <Table loading={loading} error={errorMessage}>
                <thead>
                    <tr>
                        <th>Roll No.</th>
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Reg. No</th>
                        <th>Email</th>
                        <th>Account Confirmed</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 &&
                        students.map((student, index) => {
                            return (
                                <tr key={index} onClick={() => openStudentInfo(student._id)} className='cursor-pointer'>
                                    <th>{student.rollNo}</th>

                                    <td>
                                        <div className='popover popover-hover'>
                                            <img
                                                className='w-10 popover-trigger rounded-full'
                                                src={student.photo}
                                                alt={student.name + '_pic'}
                                            />
                                            <div className='popover-content sm:popover-right'>
                                                <div className='popover-arrow'></div>
                                                <img src={student.photo} alt={student.name + '_pic'} />
                                            </div>
                                        </div>
                                    </td>

                                    <td>{student.name}</td>
                                    <td>{student.registrationNo}</td>
                                    <td>{student.email}</td>
                                    <td>
                                        {student.confirmed && <CheckIcon />}
                                        {!student.confirmed && <CrossIcon />}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
};

export default StudentList;
