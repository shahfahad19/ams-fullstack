import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';

const TeacherSubjectsList = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const ctx = useContext(AppContext);

    const params = useParams();
    useEffect(() => {
        let url = '';
        if (ctx.userData.role === 'teacher') {
            url = `${ctx.baseURL}/subjects/get/teacher-subjects?sort=archived,name`;
        } else if (ctx.userData.role === 'admin' || ctx.userData.role === 'super-admin') {
            url = `${ctx.baseURL}/subjects/get/teacher-subjects/${params.teacherId}?sort=archived,name`;
        }
        axios
            .get(url, {
                credentials: 'include',
            })
            .then((response) => {
                setErrorMessage('');
                isLoading(false);
                setSubjects(response.data.data.subjects);
                if (response.data.data.subjects.length === 0)
                    setErrorMessage(
                        ctx.userData.role === 'teacher'
                            ? 'No subjects are assigned to you yet!'
                            : 'No subjects assigned to this teacher'
                    );
            })
            .catch((error) => {
                setErrorMessage(error.response.data.message || error.message);
                isLoading(false);
            });
    }, []);

    const openSubject = (id) => {
        if (ctx.userData.role === 'teacher') ctx.navigate(`/teacher/subject/${id}/attendance`);
        if (ctx.userData.role === 'super-admin') ctx.navigate(`/super-admin/subject/${id}/attendance`);
    };
    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Subject List' />

            <Table loading={loading} error={errorMessage}>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Credit Hours</th>
                        <th>Batch</th>
                        <th>Semester</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.length > 0 &&
                        subjects.map((subject, index) => {
                            return (
                                <tr key={index} onClick={() => openSubject(subject._id)} className='cursor-pointer'>
                                    <th>{index + 1}</th>

                                    <td>{subject.name}</td>
                                    <td>{subject.department}</td>
                                    <td>{subject.creditHours} Hrs</td>

                                    <td>Batch {subject.batchName}</td>
                                    <td>Semester {subject.semesterName}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
};

export default TeacherSubjectsList;
