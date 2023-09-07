import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import BackButton from '../../Utils/BackButton';
import Alert from '../../Utils/Alert';
import Form, {
  FormControl,
  FormField,
  FormLabel,
  FormLabelAlt,
  FormSubmitBtn,
  FormTitle,
  FormWrapper
} from '../../Utils/Form';
import DepartmentName from '../Department/DepartmentName';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';

const AddSemester = () => {
  const [btnState, setBtnState] = useState('');
  const semester = useRef();
  const params = useParams();
  const ctx = useContext(AppContext);
  const [alert, setAlert] = useState({ show: false });
  const [batch, setBatch] = useState();
  const [semesterError, setSemesterError] = useState('');

  const semesterNameHandler = () => {
    if (semester.current.value === '') setSemesterError('Semester name required');
    else setSemesterError('');
  };

  useEffect(() => {
    axios
      .get(`${ctx.baseURL}/batches/${params.batchId}`, {
        credentials: 'include'
      })
      .then((response) => {
        setBatch(response.data.data.batch);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            ctx.navigate('/404', { replace: true });
          }
        }
      });
  }, []);

  const submitForm = async (event) => {
    event.preventDefault();

    if (semester.current.value === '') {
      setSemesterError('Semester name required');
      return;
    } else setSemesterError('');
    setBtnState('btn-loading');
    setAlert({ show: false });

    await axios
      .post(
        `${ctx.baseURL}/semesters?batch=${params.batchId}`,
        { name: semester.current.value },
        {
          credentials: 'include'
        }
      )
      .then(() => {
        semester.current.value = '';

        setAlert({
          show: true,
          type: 'success',
          text: 'Semester added successfully'
        });
      })
      .catch((error) => {
        let errorMessage = error.message;
        if (error.response) {
          if (error.response.data.error.code === 11000) errorMessage = 'Semester already exists';
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

      {ctx.userData.role === 'super-admin' && batch && (
        <DepartmentName name={batch.admin.department} className="mb-2" />
      )}

      <BreadCrumbs>
        <BreadCrumb to="/">Home</BreadCrumb>
        <BreadCrumb to="../batches">Batches</BreadCrumb>
        {batch && (
          <>
            <BreadCrumb to={'../batch/' + batch._id}>Batch {batch.name}</BreadCrumb>
            <BreadCrumb>Add Semester</BreadCrumb>
          </>
        )}
        {!batch && <BreadCrumb>Loading...</BreadCrumb>}
      </BreadCrumbs>

      <FormWrapper>
        <Form onSubmit={submitForm}>
          <FormTitle>Add Semester</FormTitle>
          <FormField>
            <FormLabel>Semester</FormLabel>
            <FormControl>
              <select
                className={`${ctx.selectClasses} ${semesterError === '' ? '' : 'select-error'}`}
                ref={semester}
                onChange={semesterNameHandler}>
                <option value="">Select Semester</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </FormControl>
            {semesterError !== '' && <FormLabelAlt>{semesterError}</FormLabelAlt>}
          </FormField>

          <FormSubmitBtn className={btnState}>Add Semester</FormSubmitBtn>
        </Form>
        <Alert
          alert={alert}
          closeAlert={() => {
            setAlert({ show: false });
          }}
        />

        <BackButton to={'../batch/' + params.batchId + '/semesters'} text="Semesters" />
      </FormWrapper>
    </>
  );
};

export default AddSemester;
