import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import Error from './Router/Error';
import Login from './Components/Auth/Login';
import SignUp from './Components/Auth/SignUp';
import Redirect from './Components/Utils/Redirect';
import Welcome from './Components/Welcome';
import AddSemester from './Components/Entities/Semester/AddSemester';
import AddSubject from './Components/Entities/Subject/AddSubject';
import EditSemester from './Components/Entities/Semester/EditSemester';
import SemesterList from './Components/Entities/Semester/SemesterList';
import StudentList from './Components/Entities/Student/StudentList';
import SubjectList from './Components/Entities/Subject/SubjectList';
import AttendanceList from './Components/Entities/Attendance/AttendanceList';
import InviteLink from './Components/Entities/Batch/BatchInviteLink';
import ForgotPassword from './Components/Auth/ForgotPassword';
import EditSubjectTeacher from './Components/Entities/Subject/EditSubjectTeacher';
import TeacherSubjectsList from './Components/Entities/Subject/TeacherSubjectsList';
import TakeAttendance from './Components/Entities/Attendance/TakeAttendance/TakeAttendance';
import RemoveSubject from './Components/Entities/Subject/RemoveSubject';
import DepartmentList from './Components/Entities/Department/DepartmentList';
import AddDepartment from './Components/Entities/Department/AddDepartment';
import TeacherList from './Components/Entities/Teacher/TeacherList';
import AddTeacher from './Components/Entities/Teacher/AddTeacher';
import StudentAttendance from './Components/Entities/Attendance/StudentAttendance/StudentAttendance';
import DepartmentInfo from './Components/Entities/Department/DepartmentInfo';
import DefaultSubjectList from './Components/Entities/DepartmentSubject/DefaultSubjectList';
import BatchList from './Components/Entities/Batch/BatchList';
import AddBatch from './Components/Entities/Batch/AddBatch';
import EditBatch from './Components/Entities/Batch/EditBatch';
import Error404 from './Components/Utils/Error404';
import EditSubject from './Components/Entities/Subject/EditSubject';
import Profile from './Components/Profiles/Profile';
import EditProfile from './Components/Profiles/EditProfile';
import EditPic from './Components/Profiles/EditPic';
import UpdatePassword from './Components/Profiles/UpdatePassword';
import AddDefaultSubject from './Components/Entities/DepartmentSubject/AddDefaultSubject';
import TeacherInfo from './Components/Entities/Teacher/TeacherInfo';
import EditTeacherInfo from './Components/Entities/Teacher/EditTeacherInfo';
import ConfirmAccount from './Components/Auth/ConfirmAccount';
import StudentInfo from './Components/Entities/Student/StudentInfo';
import EditStudentInfo from './Components/Entities/Student/EditStudentInfo';
import AdminMainView from './Components/Views/AdminMainView';
import SuperAdminDashboard from './Components/Dashboards/SuperAdminDashboard';
import ViewDepartment from './Components/Entities/Department/ViewDepartment';
import AdminDashboard from './Components/Dashboards/AdminDashboard';
import ViewStudent from './Components/Entities/Student/ViewStudent';
import ViewBatch from './Components/Entities/Batch/ViewBatch';
import ViewTeacher from './Components/Entities/Teacher/ViewTeacher';
import ViewSemester from './Components/Entities/Semester/ViewSemester';
import ViewSubject from './Components/Entities/Subject/ViewSubject';
import StudentDashboard from './Components/Dashboards/StudentDashboard';
import ViewProfile from './Components/Profiles/ViewProfile';
import TeacherDashboard from './Components/Dashboards/TeacherDashboard';
import ViewTeacherSubject from './Components/Entities/Subject/ViewTeacherSubject';
import StudentMainView from './Components/Views/StudentMainView';
import StudentAttendanceForSubject from './Components/Entities/Attendance/StudentAttendanceForSubject';
import CustomError from './Components/Utils/CustomError';
import ResetPassword from './Components/Auth/ResetPassword';
import SingleAttendance from './Components/Entities/Attendance/SingleAttendance';
import Search from './Components/Search/Search';
import ConfirmEmail from './Components/Auth/ConfirmEmail';
import RemoveEmail from './Components/Auth/RemoveEmail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: '',
        element: <Welcome />
      },
      {
        path: '404',
        element: <Error404 />
      },
      {
        path: 'error',
        element: <CustomError />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'signup',
        element: <SignUp />
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />
      },
      {
        path: 'confirm-account',
        element: <ConfirmAccount />
      },
      {
        path: 'confirm-email',
        element: <ConfirmEmail />
      },
      {
        path: 'remove-email',
        element: <RemoveEmail />
      },
      {
        path: 'reset-password',
        element: <ResetPassword />
      },
      {
        path: 'search',
        element: <Search />
      },
      {
        path: 'profile',
        element: <ViewProfile />,
        children: [
          {
            path: '',
            element: <Redirect to="view" />
          },
          {
            path: 'view',
            element: <Profile />
          },
          {
            path: 'edit-profile',
            element: <EditProfile />
          },
          {
            path: 'edit-photo',
            element: <EditPic />
          },
          {
            path: 'update-password',
            element: <UpdatePassword />
          }
        ]
      },

      // Paths for super admin
      {
        path: 'super-admin',
        element: <SuperAdminDashboard />,
        children: [
          {
            path: '',
            element: <DepartmentList />
          },
          {
            path: 'student/:studentId',
            element: <ViewStudent />,
            children: [
              {
                path: '',
                element: <Redirect to="info" />
              },
              {
                path: 'info',
                element: <StudentInfo />
              },
              {
                path: 'attendance',
                element: <StudentAttendance />
              },
              {
                path: 'edit',
                element: <EditStudentInfo />
              }
            ]
          },
          {
            path: 'add-department',
            element: <AddDepartment />
          },
          {
            path: 'department/:departmentId/add-batch',
            element: <AddBatch />
          },
          {
            path: 'batch/:batchId/add-semester',
            element: <AddSemester />
          },
          {
            path: 'department/:departmentId/add-subject',
            element: <AddDefaultSubject />
          },
          {
            path: 'semester/:semesterId/add-subject',
            element: <AddSubject />
          },
          {
            path: 'attendance/:attendanceId',
            element: <SingleAttendance />
          },
          {
            path: 'department/:departmentId/add-teacher',
            element: <AddTeacher />
          },
          {
            path: 'department/:departmentId',
            element: <ViewDepartment />,
            children: [
              {
                path: '',
                element: <Redirect to="info" />
              },
              {
                path: 'info',
                element: <DepartmentInfo />
              },

              {
                path: 'batches',
                element: <BatchList />
              },
              {
                path: 'teachers',
                element: <TeacherList />
              },
              {
                path: 'subjects',
                element: <DefaultSubjectList />
              }
            ]
          },

          {
            path: 'batch/:batchId',
            element: <ViewBatch />,
            children: [
              {
                path: 'semesters',
                element: <SemesterList />
              },
              {
                path: 'invite',
                element: <InviteLink />
              },
              {
                path: '',
                element: <Redirect to="semesters" />
              },
              {
                path: 'students',
                element: <StudentList />
              },
              {
                path: 'edit',
                element: <EditBatch />
              }
            ]
          },
          {
            path: 'semester/:semesterId',
            element: <ViewSemester />,
            children: [
              {
                path: '',
                element: <Redirect to="subjects" />
              },
              {
                path: 'subjects',
                element: <SubjectList />
              },
              {
                path: 'edit',
                element: <EditSemester />
              },
              {
                path: 'add-subject',
                element: <AddSubject />
              }
            ]
          },
          {
            path: 'subject/:subjectId',
            element: <ViewSubject />,
            children: [
              {
                path: '',
                element: <Redirect to="attendance" />
              },
              {
                path: 'attendance',
                element: <AttendanceList />
              },
              {
                path: 'teacher',
                element: <EditSubjectTeacher />
              },
              {
                path: 'edit',
                element: <EditSubject />
              }
            ]
          },
          {
            path: 'teacher/:teacherId',
            element: <ViewTeacher />,
            children: [
              {
                path: '',
                element: <Redirect to="info" />
              },
              {
                path: 'info',
                element: <TeacherInfo />
              },
              {
                path: 'subjects',
                element: <TeacherSubjectsList />
              },
              {
                path: 'edit',
                element: <EditTeacherInfo />
              }
            ]
          }
        ]
      },
      // Paths for Admin (Department Admin)
      {
        path: 'admin',
        element: <AdminDashboard />,
        children: [
          {
            path: '',
            element: <AdminMainView />,
            children: [
              {
                path: '',
                element: <Redirect to="/admin/batches" />
              },
              {
                path: 'batches',
                element: <BatchList />
              },
              {
                path: 'teachers',
                element: <TeacherList />
              }
            ]
          },

          {
            path: 'batch/:batchId/add-semester',
            element: <AddSemester />
          },
          {
            path: 'student/:studentId',
            element: <ViewStudent />,
            children: [
              {
                path: '',
                element: <Redirect to="info" />
              },
              {
                path: 'info',
                element: <StudentInfo />
              },
              {
                path: 'attendance',
                element: <StudentAttendance />
              },
              {
                path: 'edit',
                element: <EditStudentInfo />
              }
            ]
          },
          {
            path: 'semester/:semesterId/add-subject',
            element: <AddSubject />
          },
          {
            path: 'batch/:batchId',
            element: <ViewBatch />,
            children: [
              {
                path: 'semesters',
                element: <SemesterList />
              },
              {
                path: 'edit',
                element: <EditBatch />
              },
              {
                path: 'invite',
                element: <InviteLink />
              },
              {
                path: '',
                element: <Redirect to="semesters" />
              },
              {
                path: 'students',
                element: <StudentList />
              }
            ]
          },
          {
            path: 'teacher/:teacherId',
            element: <ViewTeacher />,
            children: [
              {
                path: '',
                element: <Redirect to="info" />
              },
              {
                path: 'info',
                element: <TeacherInfo />
              },
              {
                path: 'subjects',
                element: <TeacherSubjectsList />
              },
              {
                path: 'edit',
                element: <EditTeacherInfo />
              }
            ]
          },
          {
            path: 'add-batch',
            element: <AddBatch />
          },

          {
            path: 'add-teacher',
            element: <AddTeacher />
          },
          {
            path: 'attendance/:attendanceId',
            element: <SingleAttendance />
          },
          {
            path: 'semester/:semesterId',
            element: <ViewSemester />,
            children: [
              {
                path: '',
                element: <Redirect to="subjects" />
              },
              {
                path: 'subjects',
                element: <SubjectList />
              },
              {
                path: 'edit',
                element: <EditSemester />
              },
              {
                path: 'add-subject',
                element: <AddSubject />
              }
            ]
          },
          {
            path: 'subject/:subjectId',
            element: <ViewSubject />,
            children: [
              {
                path: '',
                element: <Redirect to="attendance" />
              },
              {
                path: 'attendance',
                element: <AttendanceList />
              },
              {
                path: 'teacher',
                element: <EditSubjectTeacher />
              },
              {
                path: 'edit',
                element: <EditSubject />
              }
            ]
          }
        ]
      },

      // Paths for Teacher
      {
        path: 'teacher',
        element: <TeacherDashboard />,
        children: [
          {
            path: '',
            element: <TeacherSubjectsList />
          },
          {
            path: 'subject/:subjectId',
            element: <ViewTeacherSubject />,
            children: [
              {
                path: '',
                element: <AttendanceList />
              },
              {
                path: 'attendance',
                element: <AttendanceList />
              },
              {
                path: 'take-attendance',
                element: <TakeAttendance />
              },
              {
                path: 'remove',
                element: <RemoveSubject />
              }
            ]
          }
        ]
      },

      {
        path: 'student',
        element: <StudentDashboard />,
        children: [
          {
            path: '',
            element: <StudentMainView />,
            children: [
              {
                path: '',
                element: <SemesterList />
              }
            ]
          },
          {
            path: 'semester/:semesterId',
            element: <ViewSemester />,
            children: [
              {
                path: '',
                element: <Redirect to="subjects" />
              },
              {
                path: 'subjects',
                element: <SubjectList />
              }
            ]
          },
          {
            path: 'subject/:subjectId',
            element: <ViewSubject />,
            children: [
              {
                path: '',
                element: <Redirect to="attendance" />
              },
              {
                path: 'attendance',
                element: <StudentAttendanceForSubject />
              }
            ]
          }
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
