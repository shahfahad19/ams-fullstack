import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../Context/AppContext';
import { useParams } from 'react-router-dom';
import Table from '../../Utils/Table';
import SubSectionHeader from '../../Utils/SubSectionHeader';

const StudentAttendanceForSubject = () => {
    const ctx = useContext(AppContext);
    const params = useParams();
    const [attendance, setAttendance] = useState();
    const [loading, isLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/attendances/student/${ctx.userData._id}/subject/${params.subjectId}`, {
                credentials: 'include',
            })
            .then((response) => {
                if (response.data.attendances.length === 0) {
                    setErrorMessage('No attendances found');
                } else {
                    setAttendance(response.data.attendances[0]);
                }
            })
            .catch((error) => {
                if (error.response) setErrorMessage(error.response.data.message);
                else setErrorMessage(error.message);
            })
            .finally(() => {
                isLoading(false);
            });
    }, []);

    return (
        <>
            <SubSectionHeader text='Attendance' />
            {attendance && (
                <>
                    {/* Table for mobile */}
                    <table className='table table-compact md:hidden'>
                        <tbody>
                            <tr>
                                <th>Total Classes</th>
                                <td className='border-r'>{attendance.totalClasses}</td>

                                <th>Present</th>
                                <td>{attendance.present}</td>
                            </tr>
                            <tr>
                                <th>Absent</th>
                                <td className='border-r'>{attendance.absent}</td>

                                <th>Leave</th>
                                <td>{attendance.leave}</td>
                            </tr>
                            <tr>
                                <th colSpan={2}>Percentage</th>
                                <td colSpan={2}>
                                    {attendance.percentage === 'N/A' && <span>N/A</span>}
                                    {attendance.percentage !== 'N/A' && (
                                        <span
                                            className={
                                                parseFloat(attendance.percentage) < 75.0 ? 'text-error' : 'text-success'
                                            }
                                        >
                                            {attendance.percentage === 'N/A'
                                                ? attendance.percentage
                                                : parseFloat(attendance.percentage).toFixed(2) + '%'}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Table for Desktop */}
                    <table className='table table-compact hidden md:table'>
                        <tbody>
                            <tr>
                                <th className='border-r'>
                                    <span className='mr-5'>Total classes:</span> {attendance.totalClasses}
                                </th>

                                <th className='border-r'>
                                    <span className='mr-5'>Present:</span> {attendance.present}
                                </th>

                                <th className='border-r'>
                                    <span className='mr-5'>Absent:</span> {attendance.absent}
                                </th>

                                <th className='border-r'>
                                    <span className='mr-5'>Leave:</span> {attendance.leave}
                                </th>
                                <th>
                                    <span className='mr-5'>Percentage</span>
                                    {attendance.percentage === 'N/A' && <span>N/A</span>}
                                    {attendance.percentage !== 'N/A' && (
                                        <span
                                            className={
                                                parseFloat(attendance.percentage) < 75.0 ? 'text-error' : 'text-success'
                                            }
                                        >
                                            {attendance.percentage === 'N/A'
                                                ? attendance.percentage
                                                : parseFloat(attendance.percentage).toFixed(2) + '%'}
                                        </span>
                                    )}
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}
            <Table loading={loading} error={errorMessage}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {attendance &&
                        attendance.attendances.map((att, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {new Date(attendance.dates[index]).toLocaleDateString('en-PK', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: '2-digit',
                                        })}
                                    </td>
                                    <td>
                                        {new Date(attendance.dates[index]).toLocaleTimeString('en-PK', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}
                                    </td>
                                    <td>
                                        <span
                                            className={`font-medium ${
                                                att.status === 'present'
                                                    ? 'text-success'
                                                    : att.status === 'absent'
                                                    ? 'text-error'
                                                    : 'text-warning'
                                            }`}
                                        >
                                            {att.status[0].toUpperCase() + att.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>

            {attendance && attendance.totalClasses > attendance.attendances.length && (
                <p className='p-2 text-error text-sm my-2'>
                    * Your attendance was not recorded in {attendance.totalClasses - attendance.attendances.length}{' '}
                    class
                    {attendance.totalClasses - attendance.attendances.length === 1 ? '' : 'es'}.
                </p>
            )}

            <div className='h-14'></div>
        </>
    );
};

export default StudentAttendanceForSubject;
