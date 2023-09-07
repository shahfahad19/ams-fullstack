import React from 'react';
import Table from '../../../Utils/Table';

const SavedAttendanceTable = ({ editingEnabled, attendanceList, students, changeAttendance }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>R.No</th>
          <th>Name</th>
          <th>Attendance</th>
          {editingEnabled && <th>Edit</th>}
        </tr>
      </thead>
      <tbody>
        {attendanceList.map((attendance, index) => (
          <tr key={index}>
            <td>{students[index].rollNo}</td>
            <td>{students[index].name}</td>
            <td>{attendance.status[0].toUpperCase() + attendance.status.slice(1)}</td>
            {editingEnabled && (
              <td>
                <select
                  className="select w-32 select-sm"
                  defaultValue={attendance.status}
                  onChange={(event) => changeAttendance(event, index)}>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="leave">Leave</option>
                </select>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default SavedAttendanceTable;
