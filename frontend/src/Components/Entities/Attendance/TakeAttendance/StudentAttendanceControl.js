import React from 'react';

const StudentAttendanceControl = ({ students, currentStudentIndex, handleAttendance }) => {
  return (
    <div className="flex flex-col md:space-x-10 mt-4 space-y-4 md:space-y-5 items-center justify-center">
      <div className="flex flex-col items-center">
        <img
          src={students[currentStudentIndex].photo}
          alt="student_photo"
          className="h-20 w-20 rounded-lg mb-2"
        />
        <p className="text-lg md:text-xl font-semibold mb-4 text-center">
          Roll no.{students[currentStudentIndex].rollNo}
        </p>
        <p className="textxl md:text-2xl font-semibold mb-4 text-center">
          Student Name: {students[currentStudentIndex].name}
        </p>
      </div>
      <div className="flex items-center align-middle justify-center">
        <button
          className="btn btn-success mx-2"
          onClick={() => handleAttendance(students[currentStudentIndex]._id, 'present')}>
          Present
        </button>

        <button
          className="btn btn-error mx-2"
          onClick={() => handleAttendance(students[currentStudentIndex]._id, 'absent')}>
          Absent
        </button>
        <button
          className="btn btn-warning mx-2"
          onClick={() => handleAttendance(students[currentStudentIndex]._id, 'leave')}>
          Leave
        </button>
      </div>
    </div>
  );
};

export default StudentAttendanceControl;
