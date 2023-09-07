import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';
import SubjectDeleteBtn from './SubjectDeleteBtn';
import SubjectEditBtn from './SubjectEditBtn';
const DefaultSubjectList = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const ctx = useContext(AppContext);
    const [newSubject, setNewSubject] = useState();

    const params = useParams();
    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/subjects/defaultSubjects?department=${params.departmentId}&sort=name`, {
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
    }, [newSubject]);

    return (
        <>
            <SubSectionHeader text='Subject List' showBtn={true} btnText='Add Subject' btnLink='../add-subject' />

            <Table loading={loading} error={errorMessage}>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Credit Hours</th>
                        <th className='text-center'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.length > 0 &&
                        subjects.map((subject, index) => {
                            return (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>{subject.name}</td>
                                    <td>{subject.creditHours}</td>
                                    <td>
                                        <SubjectEditBtn subject={subject} subjectEdited={setNewSubject} />
                                        <SubjectDeleteBtn subject={subject} subjectDeleted={setNewSubject} />
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </>
    );
};

export default DefaultSubjectList;
