/* eslint-disable no-console */
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';

const SubjectAttendanceList = () => {
    const [attendances, setAttendances] = useState([]);
    const [loading, isLoading] = useState(true);
    const [dates, setDates] = useState([]);
    const [attendanceIds, setAttendanceIds] = useState([]);

    const [errorMessage, setErrorMessage] = useState('');
    const ctx = useContext(AppContext);

    const params = useParams();
    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/attendances?subject=${params.subjectId}`, {
                credentials: 'include',
            })
            .then((response) => {
                setAttendances(response.data.data.attendances);
                setDates(response.data.data.dates);
                setAttendanceIds(response.data.data.ids);
                if (response.data.data.attendances.length === 0) setErrorMessage('No Attendances found');
                isLoading(false);
            })
            .catch((error) => {
                setErrorMessage(ctx.computeError(error));
                isLoading(false);
            });
    }, []);

    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Attendance List' />

            <Table error={errorMessage} loading={loading}>
                <thead>
                    <tr>
                        <th>R.no</th>
                        <th>Name</th>
                        {attendances.length > 0 &&
                            attendances[0].dates.map((date, index) => (
                                <th key={date}>
                                    <Link
                                        className={ctx.userData.role === 'teacher' ? '' : 'underline'}
                                        to={
                                            ctx.userData.role !== 'teacher'
                                                ? `/${ctx.userData.role}/attendance/${attendanceIds[index]}`
                                                : ''
                                        }
                                    >
                                        <p className='text-xs text-center border-none'>
                                            {new Date(date).toLocaleDateString('en-PK', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: '2-digit',
                                            })}
                                        </p>
                                        <p className='text-center text-xs border-none'>
                                            {new Date(date).toLocaleTimeString('en-PK', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}
                                        </p>
                                    </Link>
                                </th>
                            ))}
                        <th>
                            <p className='no-border text-center'>Percentage</p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {attendances.length > 0 &&
                        attendances.map((attendance) => (
                            <tr key={attendance._id}>
                                <td>{attendance.rollNo}</td>
                                <td className='text-bold'>
                                    <Link className='underline' to={`./../../../student/${attendance._id}`}>
                                        {attendance.name}
                                    </Link>
                                </td>

                                {dates.map((date, index) => (
                                    <React.Fragment key={index}>
                                        {attendance.dates.indexOf(date) === -1 && (
                                            <td>
                                                <p className='text-center font-medium text-neutral'>X</p>
                                            </td>
                                        )}
                                        {attendance.dates.indexOf(date) > -1 && (
                                            <td key={index}>
                                                <p
                                                    className={`${
                                                        attendance.attendance[attendance.dates.indexOf(date)]
                                                            .status[0] === 'p'
                                                            ? 'text-success'
                                                            : attendance.attendance[attendance.dates.indexOf(date)]
                                                                  .status[0] === 'a'
                                                            ? 'text-error'
                                                            : 'text-warning'
                                                    } text-center font-medium `}
                                                >
                                                    {attendance.attendance[
                                                        attendance.dates.indexOf(date)
                                                    ].status[0].toUpperCase()}
                                                </p>
                                            </td>
                                        )}
                                    </React.Fragment>
                                ))}

                                <td>
                                    {attendance.percentage === 'N/A' && (
                                        <p className='text-center font-semibold'>N/A</p>
                                    )}
                                    {attendance.percentage !== 'N/A' && (
                                        <p
                                            className={`${
                                                parseFloat(attendance.percentage) < 75.0 ? 'text-error' : 'text-success'
                                            } text-center font-semibold`}
                                        >
                                            {attendance.percentage === '100%'
                                                ? attendance.percentage
                                                : parseFloat(attendance.percentage).toFixed(2) + '%'}
                                        </p>
                                    )}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>

            {attendances.length > 0 && (
                <div className='flex justify-evenly text-sm p-4'>
                    <p>
                        <span className='text-success font-bold'>P</span> - Present
                    </p>
                    <p>
                        <span className='text-error font-bold'>A</span> - Absent
                    </p>
                    <p>
                        <span className='text-warning font-bold'>L</span> - Leave
                    </p>
                    <p>
                        <span className='text-neutral font-bold'>X</span> - Not Marked
                    </p>
                </div>
            )}

            <div className='h-14'></div>
        </div>
    );
};

export default SubjectAttendanceList;
