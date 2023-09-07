import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AppContext from '../../../Context/AppContext';
import AttendanceInfoTable from './AttendanceInfoTable';
import AttendanceTable from './AttendanceTable';
import Form, { FormControl, FormField, FormGroup, FormLabel, FormWrapper } from '../../../Utils/Form';
import Spinner from '../../../Utils/Spinner';
import { useParams } from 'react-router-dom';
import SubSectionHeader from '../../../Utils/SubSectionHeader';

const StudentAttendance = () => {
    const ctx = useContext(AppContext);
    const params = useParams();
    const [data, setData] = useState([]);
    const [setAlert] = useState(false);
    const [loading, isLoading] = useState(true);
    const semesterRef = useRef('');
    const subjectRef = useRef('');
    const [subjects, setSubjects] = useState([]);
    const [subject, setSubject] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const url = ctx.userData.role === 'student' ? ctx.userData._id : params.studentId;
        axios
            .get(`${ctx.baseURL}/attendances/student/${url}`, {
                credentials: 'include',
            })
            .then((response) => {
                setData(response.data.attendances);

                if (response.data.attendances.length === 0) {
                    setErrorMessage('No attendances found');
                }
            })
            .catch((error) => {
                if (error.response) setErrorMessage(error.response.data.message);
                else setErrorMessage(error.message);
                setAlert(true);
            })
            .finally(() => {
                isLoading(false);
            });
    }, []);

    const semesterHandler = () => {
        let semesterIndex = semesterRef.current.value;

        if (semesterIndex === '') {
            setSubjects([]);
            setSubject(null);
        } else {
            setSubjects(data[semesterIndex].subjects);
        }
    };

    const subjectHandler = () => {
        let semesterIndex = semesterRef.current.value;
        let subjectIndex = subjectRef.current.value;

        if (subjectIndex === '') {
            setSubject(null);
        } else {
            let selectedSubject = data[semesterIndex].subjects[subjectIndex];
            setSubject(selectedSubject);
        }
    };

    return (
        <>
            {errorMessage !== '' && <p className='text-error text-center mt-14'>{errorMessage}</p>}
            {loading && (
                <div className='flex justify-center items-center mt-20'>
                    <Spinner />
                </div>
            )}
            {!loading && (
                <div className=''>
                    <FormWrapper>
                        <Form>
                            <FormGroup>
                                <FormField>
                                    <FormLabel>Semester</FormLabel>
                                    <FormControl>
                                        <select
                                            className={ctx.selectClasses}
                                            ref={semesterRef}
                                            onChange={semesterHandler}
                                        >
                                            <option value=''>Select Semester</option>

                                            {data.map((semester, index) => {
                                                return (
                                                    <option key={semester.semester._id} value={index}>
                                                        Semester {semester.semester.name}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </FormControl>
                                </FormField>
                                <FormField>
                                    <FormLabel>Subject</FormLabel>
                                    <FormControl>
                                        <select
                                            className={ctx.selectClasses}
                                            ref={subjectRef}
                                            onChange={subjectHandler}
                                            disabled={subjects.length === 0}
                                        >
                                            {subjects.length > 0 && (
                                                <>
                                                    <option value=''>Select Subject</option>
                                                    {subjects.length > 0 && (
                                                        <>
                                                            {subjects.map((subject, index) => {
                                                                return (
                                                                    <option key={subject.subject} value={index}>
                                                                        {subject.subjectName}
                                                                    </option>
                                                                );
                                                            })}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </select>
                                    </FormControl>
                                </FormField>
                            </FormGroup>
                        </Form>
                    </FormWrapper>

                    <div className='flex justify-center'>
                        <div className='m-3 w-full lg:w-2/3'>
                            {subject !== null && (
                                <>
                                    <SubSectionHeader text='Subject Info' />
                                    <AttendanceInfoTable subject={subject} />

                                    <br />
                                    <SubSectionHeader text='Attendance' />

                                    <div className='flex justify-center m-2'>
                                        <AttendanceTable subject={subject} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className='h-14'></div>
        </>
    );
};

export default StudentAttendance;
