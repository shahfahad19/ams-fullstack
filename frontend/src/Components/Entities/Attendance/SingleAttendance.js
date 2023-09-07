import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../Context/AppContext';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Table from '../../Utils/Table';
import DepartmentName from '../Department/DepartmentName';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import AttendanceDeleteBtn from './AttendanceDeleteBtn';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';

const SingleAttendance = () => {
  const ctx = useContext(AppContext);
  const params = useParams();
  const [attendance, setAttendance] = useState();

  const [loading, isLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios
      .get(`${ctx.baseURL}/attendances/${params.attendanceId}`, {
        credentials: 'include'
      })
      .then((response) => {
        isLoading(false);
        setAttendance(response.data.data.attendance);
      })
      .catch((error) => {
        isLoading(false);
        setErrorMessage(ctx.computeError(error));
      });
  }, []);

  const viewTeacher = () => {
    if (attendance.marked_by) {
      ctx.navigate(`${ctx.userData.role}/teachers/${attendance.marked_by._id}`);
    }
  };
  return (
    <>
      {attendance && <DepartmentName name={attendance.subject.semester.batch.admin.department} />}
      <BreadCrumbs>
        <BreadCrumb to="/">Home</BreadCrumb>
        {ctx.userData.role === 'admin' && <BreadCrumb to="../batches">Batches</BreadCrumb>}
        {attendance && (
          <>
            {ctx.userData.role === 'super-admin' && (
              <>
                <BreadCrumb to="../">Departments</BreadCrumb>
                <BreadCrumb to={`../department/${attendance.subject.semester.batch.admin._id}`}>
                  {attendance.subject.semester.batch.admin.department}
                </BreadCrumb>
              </>
            )}
            <BreadCrumb to={'../batch/' + attendance.subject.semester.batch._id}>
              Batch {attendance.subject.semester.batch.name}
            </BreadCrumb>

            <BreadCrumb to={`../semester/${attendance.subject.semester.id}`}>
              Semester {attendance.subject.semester.name}
            </BreadCrumb>
            <BreadCrumb to={`../subject/${attendance.subject._id}`}>
              {attendance.subject.name}
            </BreadCrumb>

            <BreadCrumb>Attendance</BreadCrumb>
          </>
        )}
        {!attendance && <BreadCrumb>Loading...</BreadCrumb>}
      </BreadCrumbs>
      <SubSectionHeader text="Attendance Info" />
      {attendance && (
        <table className="table p-2">
          <tbody>
            <tr>
              <th>Attendance Time</th>
              <td>
                <span>
                  {new Date(attendance.date).toLocaleTimeString('en-PK', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
                <span className="ml-4">
                  {new Date(attendance.date).toLocaleDateString('en-PK', {
                    day: '2-digit',
                    month: 'short',
                    year: '2-digit'
                  })}
                </span>
              </td>
            </tr>
            <tr>
              <th>Subject</th>
              <td>{attendance.subject.name}</td>
            </tr>
            <tr onClick={viewTeacher}>
              <th>Marked By</th>
              <td>
                {attendance.marked_by
                  ? `${attendance.marked_by.name} (${attendance.marked_by.email})`
                  : 'Teacher not found'}
              </td>
            </tr>
            <tr>
              <th>Action</th>
              <td>
                <AttendanceDeleteBtn attendance={attendance} />
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <br />

      {attendance && <SubSectionHeader text="Attendance Status" />}
      <Table className="p-2" loading={loading} error={errorMessage}>
        <thead>
          <tr>
            <th>R. No</th>
            <th>Student</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance &&
            attendance.attendances.map((att, index) => {
              return (
                <tr key={index}>
                  <td>{att.student.rollNo}</td>
                  <td>
                    <Link className="underline" to={`../student/${att.student._id}`}>
                      {att.student.name}
                    </Link>
                  </td>
                  <td>
                    <span
                      className={`font-medium ${
                        att.status === 'present'
                          ? 'text-success'
                          : att.status === 'absent'
                          ? 'text-error'
                          : 'text-warning'
                      }`}>
                      {att.status[0].toUpperCase() + att.status.slice(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <div className="h-14"></div>
    </>
  );
};

export default SingleAttendance;
