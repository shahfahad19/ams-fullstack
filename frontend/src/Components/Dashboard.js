import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Error404 from './Utils/Error404';
import AppContext from './Context/AppContext';
import CustomError from './Utils/CustomError';
import StudentVerification from './Entities/Student/StudentVerification';
import CompleteTeacherSignup from './Profiles/CompleteTeacherSignup';
import CompleteAdminSignup from './Profiles/CompleteAdminSignup';

const Dashboard = (props) => {
  const ctx = useContext(AppContext);

  return (
    <>
      {ctx.isLoggedIn === 'wait' && (
        <div className="flex absolute flex-col items-center h-auto bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 justify-center">
          <p className="text-lg font-bold text-primary text-center p-3">Please wait</p>
          <svg className="spinner-ring" viewBox="25 25 50 50" strokeWidth="5">
            <circle cx="50" cy="50" r="20" />
          </svg>
        </div>
      )}

      {ctx.isLoggedIn === true && ctx.loggedInAs === props.role && (
        <>
          {/* If user is super admin, render outlet */}
          {ctx.userData.role === 'super-admin' && <Outlet />}

          {/* If user is admin, render outlet. If profile is not approved by user, open complete profile page */}
          {ctx.userData.role === 'admin' && (
            <>
              {ctx.userData.approved && <Outlet />}

              {!ctx.userData.approved && <CompleteAdminSignup ctx={ctx} />}
            </>
          )}

          {/* If user is teacher, render outlet. If profile is not approved by user, open complete profile page */}

          {ctx.userData.role === 'teacher' && (
            <>
              {ctx.userData.approved && <Outlet />}
              {!ctx.userData.approved && <CompleteTeacherSignup ctx={ctx} />}
            </>
          )}

          {/* If user is student, render outlet. If user has not confirm their email, show confirmation alert*/}
          {ctx.userData.role === 'student' && (
            <>
              {!ctx.userData.confirmed && <StudentVerification />}
              <Outlet />
            </>
          )}
        </>
      )}

      {ctx.isLoggedIn === true && ctx.loggedInAs !== props.role && (
        <Error404 link={`/${ctx.loggedInAs}`} />
      )}

      {ctx.error && <CustomError error={ctx.error} />}
    </>
  );
};

export default Dashboard;
