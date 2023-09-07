import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { SpinnerWithText } from '../../Utils/Spinner';
import { FormWrapper } from '../../Utils/Form';

const TeacherInfo = () => {
  const [teacher] = useOutletContext();
  return (
    <>
      {teacher && (
        <FormWrapper>
          <table className="table font-medium">
            <tbody>
              <tr>
                <td>Name</td>
                <td>{teacher.name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{teacher.email}</td>
              </tr>
              <tr>
                <td>Photo</td>
                <td>
                  <div className="popover popover-hover">
                    <img
                      className="w-10 popover-trigger rounded-full"
                      src={teacher.photo}
                      alt="profile_pic"
                    />
                    <div className="popover-content sm:popover-right">
                      <div className="popover-arrow"></div>
                      <img src={teacher.photo} alt="profile_pic" />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Department</td>
                <td> {teacher.departmentId.department}</td>
              </tr>
              <tr>
                <td>Designation</td>
                <td>{teacher.designation}</td>
              </tr>
            </tbody>
          </table>
        </FormWrapper>
      )}

      {!teacher && <SpinnerWithText>Fetching teacher info...</SpinnerWithText>}
    </>
  );
};

export default TeacherInfo;
