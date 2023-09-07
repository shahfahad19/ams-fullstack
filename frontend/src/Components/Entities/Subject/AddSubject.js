import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import BackButton from '../../Utils/BackButton';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';
import DepartmentName from '../Department/DepartmentName';
import { FormControl, FormField, FormLabel, FormTitle, FormWrapper } from '../../Utils/Form';
import Alert from '../../Utils/Alert';

const AddSubject = () => {
  const [btnState, setBtnState] = useState('');
  const subject = useRef();

  const [newSubject, setNewSubject] = useState();
  const [semester, setSemester] = useState();
  const params = useParams();
  const ctx = useContext(AppContext);
  const [alert, setAlert] = useState({ show: false });

  const [subjectList, setSubjectList] = useState({
    loaded: false,
    subjects: []
  });

  useEffect(() => {
    axios
      .get(`${ctx.baseURL}/semesters/${params.semesterId}`, {
        credentials: 'include'
      })
      .then((response) => {
        setSemester(response.data.data.semester);

        axios
          .get(
            `${ctx.baseURL}/subjects/defaultSubjects?department=${response.data.data.semester.batch.admin._id}&semester=${params.semesterId}&sort=name`,
            {
              credentials: 'include'
            }
          )
          .then((response) => {
            setSubjectList({
              loaded: true,
              subjects: response.data.data.subjects
            });
            setSemester(response.data.data.semester);
          })

          .catch((error) => {
            setAlert({
              show: true,
              type: 'error',
              text: ctx.computeError(error)
            });
          });
      })

      .catch((error) => {
        setAlert({
          show: true,
          type: 'error',
          text: ctx.computeError(error)
        });
      });
  }, [newSubject]);

  const submitForm = async (event) => {
    event.preventDefault();
    setBtnState('btn-loading');
    setAlert({ show: false });
    await axios
      .post(
        `${ctx.baseURL}/subjects?semester=${params.semesterId}`,
        {
          subject: subject.current.value
        },
        {
          credentials: 'include'
        }
      )
      .then((response) => {
        subject.current.value = '';
        setNewSubject(response.data.data.subject);
        setAlert({
          show: true,
          type: 'success',
          text: 'Subject added successfully'
        });
      })
      .catch((error) => {
        let errorMessage = error.message;
        if (error.response) {
          if (error.response.data.error.code === 11000) errorMessage = 'Subject already exists';
          else errorMessage = error.response.data.message;
        }
        setAlert({
          show: true,
          type: 'error',
          text: errorMessage
        });
      });
    setBtnState('');
  };

  return (
    <>
      {ctx.userData.role === 'admin' && (
        <DepartmentName name={ctx.userData.department} className="mb-2" />
      )}

      {ctx.userData.role === 'super-admin' && semester && (
        <DepartmentName name={semester.batch.admin.department} className="mb-2" />
      )}
      <BreadCrumbs>
        <BreadCrumb to="/">Home</BreadCrumb>
        {ctx.userData.role === 'admin' && <BreadCrumb to="../batches">Batches</BreadCrumb>}
        {semester && (
          <>
            {ctx.userData.role === 'super-admin' && (
              <>
                <BreadCrumb to="../">Departments</BreadCrumb>
                <BreadCrumb to={`../department/${semester.batch.admin._id}`}>
                  {semester.batch.admin.department}
                </BreadCrumb>
                <BreadCrumb to={`../department/${semester.batch.admin._id}/batches`}>
                  Batches
                </BreadCrumb>
              </>
            )}
            <BreadCrumb to={'../batch/' + semester.batch._id}>
              Batch {semester.batch.name}
            </BreadCrumb>

            <BreadCrumb to={`../batch/${semester.batch._id}/semesters`}>Semesters</BreadCrumb>
            <BreadCrumb to={`../semester/${semester.id}`}>Semester {semester.name}</BreadCrumb>

            <BreadCrumb>Add Subject</BreadCrumb>
          </>
        )}
        {!semester && <BreadCrumb>Loading...</BreadCrumb>}
      </BreadCrumbs>
      <FormWrapper>
        <form className="font-medium w-full" onSubmit={submitForm}>
          <FormTitle>Add Subject</FormTitle>
          <FormField>
            <FormLabel>Subject</FormLabel>
            <FormControl>
              <select
                className={ctx.selectClasses}
                ref={subject}
                required
                disabled={!subjectList.loaded}>
                {!subjectList.loaded && <option value="">Loading Subjects...</option>}
                {subjectList.loaded && <option value="">Select Subject</option>}
                {subjectList.loaded &&
                  subjectList.subjects.map((subject, index) => {
                    return (
                      <option key={index} value={subject._id}>
                        {subject.name} ({subject.creditHours} credit hrs)
                      </option>
                    );
                  })}
              </select>
            </FormControl>
          </FormField>

          <br />

          <div className="form-control flex items-center">
            <button className={`${ctx.btnClasses} ${btnState}`} type="submit">
              Add Subject
            </button>
          </div>
        </form>
        <Alert
          alert={alert}
          closeAlert={() => {
            setAlert({ show: false });
          }}
        />
        <BackButton to={'../semester/' + params.semesterId + '/subjects'} text="Subjects" />
      </FormWrapper>
    </>
  );
};

export default AddSubject;
