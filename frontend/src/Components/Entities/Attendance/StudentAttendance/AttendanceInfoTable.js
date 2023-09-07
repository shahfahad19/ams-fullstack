import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../../Context/AppContext';

const AttendanceInfoTable = (props) => {
    const subject = props.subject;
    const ctx = useContext(AppContext);
    const [teacher, setTeacher] = useState({
        email: '',
        name: '',
    });

    useEffect(() => {
        setTeacher({
            name: 'Loading...',
            email: '',
        });
        if (subject.teacher !== null) {
            axios
                .get(`${ctx.baseURL}/users/teachers/${subject.teacher}`, {
                    credentials: 'include',
                })
                .then((response) => {
                    setTeacher(response.data.data.teacher);
                })
                .catch(() => {
                    //TODO: Handle error if teacher fails to load
                });
        } else {
            setTeacher({
                name: 'Not Assigned',
                email: '',
            });
        }
    }, [subject]);
    return (
        <table className='table table-compact border'>
            <tbody>
                <tr>
                    <th colSpan={2}>Subject Name</th>
                    <td colSpan={2}>{subject.subjectName}</td>
                </tr>

                <tr>
                    <th colSpan={2}>Teacher</th>
                    <td colSpan={2}>{teacher.name}</td>
                </tr>
                <tr>
                    <th colSpan={2}>Teacher Email</th>
                    <td colSpan={2}>{teacher.email}</td>
                </tr>

                <tr className='border'>
                    <th>Total Classes</th>
                    <td className='border-r'>{subject.totalClass}</td>
                    <th>Present</th>
                    <td>{subject.present}</td>
                </tr>
                <tr className='border'>
                    <th>Absent</th>
                    <td className='border-r'>{subject.absent}</td>
                    <th>Leave</th>
                    <td>{subject.leave}</td>
                </tr>
                <tr className='border'>
                    <th colSpan={2}>Percentage</th>
                    <th colSpan={2}>
                        {subject.percentage === 'N/A' && <span>N/A</span>}
                        {subject.percentage !== 'N/A' && (
                            <span className={parseFloat(subject.percentage) < 75.0 ? 'text-error' : 'text-success'}>
                                {subject.percentage === 'N/A'
                                    ? subject.percentage
                                    : parseFloat(subject.percentage).toFixed(2) + '%'}
                            </span>
                        )}
                    </th>
                </tr>
            </tbody>
        </table>
    );
};

export default AttendanceInfoTable;
