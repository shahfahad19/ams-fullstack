import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';

const SubjectList = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const ctx = useContext(AppContext);

    const params = useParams();
    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/subjects?semester=${params.semesterId}&sort=archived,name`, {
                credentials: 'include',
            })
            .then((response) => {
                setErrorMessage('');
                isLoading(false);
                setSubjects(response.data.data.subjects);
                if (response.data.data.subjects.length === 0) setErrorMessage('No subjects found');
            })
            .catch((error) => {
                if (error.response) setErrorMessage(error.response.data.message);
                else setErrorMessage(error.message);
                isLoading(false);
            });
    }, []);

    const viewSubject = (subjectId) => {
        ctx.navigate(`/${ctx.userData.role}/subject/${subjectId}`);
    };
    return (
        <div>
            <SubSectionHeader text='Subject List' showBtn={true} btnLink='../add-subject' btnText='Add Subject' />

            <Table loading={loading} error={errorMessage}>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Credit Hours</th>
                        <th>Teacher</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.length > 0 &&
                        subjects.map((subject, index) => {
                            return (
                                <tr key={index} className='cursor-pointer' onClick={() => viewSubject(subject._id)}>
                                    <th>{index + 1}</th>
                                    <td>{subject.name}</td>
                                    <td>{subject.creditHours}</td>
                                    <td>{subject.teacher ? subject.teacher.name : 'Not Assigned'}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
};

export default SubjectList;
