import React from 'react';

const AttendanceTable = (props) => {
  const subject = props.subject;

  return (
    <table className="table table-compact w-full">
      <thead>
        <tr>
          <th></th>
          <th>Date</th>
          <th>Time</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {subject.attendances.map((attendance, index) => {
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                {new Date(subject.dates[index]).toLocaleDateString('en-PK', {
                  day: '2-digit',
                  month: 'short',
                  year: '2-digit'
                })}
              </td>
              <td>
                {new Date(subject.dates[index]).toLocaleTimeString('en-PK', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </td>
              <td>
                <span
                  className={`font-medium ${
                    attendance.status === 'present'
                      ? 'text-success'
                      : attendance.status === 'absent'
                      ? 'text-error'
                      : 'text-warning'
                  }`}>
                  {attendance.status[0].toUpperCase() + attendance.status.slice(1)}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
      {subject.totalClasses < subject.attendances.length && (
        <caption className="p-2 text-error table-caption text-sm">
          Note: Some attendances were not recorded due to late sign up
        </caption>
      )}
    </table>
  );
};

export default AttendanceTable;
