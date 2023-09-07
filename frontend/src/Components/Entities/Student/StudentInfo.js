import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { SpinnerWithText } from '../../Utils/Spinner';
import { FormWrapper } from '../../Utils/Form';

const StudentInfo = () => {
  const [student] = useOutletContext();

  return (
    <>
      {student && (
        <FormWrapper>
          <table className="table font-medium">
            <tbody>
              <tr>
                <td>Name</td>
                <td>{student.name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{student.email}</td>
              </tr>
              <tr>
                <td>Photo</td>
                <td>
                  <div className="popover popover-hover">
                    <img
                      className="w-10 popover-trigger rounded-full"
                      src={student.photo}
                      alt="profile_pic"
                    />
                    <div className="popover-content sm:popover-right">
                      <div className="popover-arrow"></div>
                      <img src={student.photo} alt="profile_pic" />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Roll No.</td>
                <td>{student.rollNo}</td>
              </tr>
              <tr>
                <td>Registration No.</td>
                <td>{student.registrationNo}</td>
              </tr>
            </tbody>
          </table>
        </FormWrapper>
      )}

      {!student && <SpinnerWithText>Fetching student info...</SpinnerWithText>}
    </>
  );
};

export default StudentInfo;
