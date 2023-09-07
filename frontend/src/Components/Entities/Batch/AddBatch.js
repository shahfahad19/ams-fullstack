import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AppContext from '../../Context/AppContext';
import DepartmentName from '../Department/DepartmentName';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';
import Form, {
  FormControl,
  FormField,
  FormGroup,
  FormLabel,
  FormLabelAlt,
  FormSubmitBtn,
  FormTitle,
  FormWrapper
} from '../../Utils/Form';
import Alert from '../../Utils/Alert';
import BackButton from '../../Utils/BackButton';
import { useParams } from 'react-router-dom';
const AddBatch = () => {
  const [btnState, setBtnState] = useState('');
  const batch = useRef();
  const params = useParams();

  // will be used if super admin is logged in
  const [departmentName, setDepartmentName] = useState();

  const ctx = useContext(AppContext);
  const [formError, setFormError] = useState('');
  const dept = params.departmentId;
  const [alert, setAlert] = useState({ show: false });

  const batchNameHandler = () => {
    let batchName = batch.current.value;
    if (batchName === '') {
      setFormError('Batch no. required');
    } else if (batchName < 0 || batchName > 999) {
      setFormError('Batch name is invalid');
    } else {
      setFormError('');
    }
  };

  useEffect(() => {
    if (ctx.userData.role === 'super-admin') {
      axios
        .get(`${ctx.baseURL}/users/department/${params.departmentId}`, {
          credentials: 'include'
        })
        .then((response) => {
          setDepartmentName(response.data.data.department.department);
        })
        .catch((error) => {
          ctx.handleError(error);
        });
    }
  }, []);

  const submitForm = async (event) => {
    event.preventDefault();
    let batchName = batch.current.value;

    if (batchName === '') {
      setFormError('Batch no. required');
      return;
    } else if (batchName < 0 || batchName > 999) {
      setFormError('Batch name is invalid');
      return;
    } else {
      setFormError('');
    }
    setBtnState('btn-loading');
    setAlert({ show: false });
    await axios
      .post(
        `${ctx.baseURL}/batches${ctx.userData.role === 'admin' ? '' : '?department=' + dept}`,
        { name: batchName },
        {
          credentials: 'include'
        }
      )
      .then(() => {
        batch.current.value = '';
        setAlert({
          show: true,
          type: 'success',
          text: 'Batch added successfully'
        });
      })
      .catch((error) => {
        let errorMessage = error.message;
        if (error.response) {
          if (error.response.data.error.code === 11000) errorMessage = 'Batch already exists';
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
      {ctx.userData.role === 'admin' && <DepartmentName name={ctx.userData.department} />}
      {ctx.userData.role === 'super-admin' && departmentName && (
        <DepartmentName name={departmentName} />
      )}

      <BreadCrumbs>
        <BreadCrumb to="/">Home</BreadCrumb>
        {ctx.userData.role === 'super-admin' && (
          <>
            <BreadCrumb to="../">Departments</BreadCrumb>
            <BreadCrumb to="./../batches">Batches</BreadCrumb>
          </>
        )}
        {ctx.userData.role === 'admin' && <BreadCrumb to="../batches">Batches</BreadCrumb>}

        <BreadCrumb>Add Batch</BreadCrumb>
      </BreadCrumbs>
      <FormWrapper>
        <Form onSubmit={submitForm}>
          <FormTitle>Add Batch</FormTitle>
          <FormGroup>
            <FormField>
              <FormLabel>Batch No.</FormLabel>
              <FormControl>
                <input
                  className={`${ctx.inputClasses} ${formError === '' ? '' : 'input-error'}`}
                  type="number"
                  ref={batch}
                  onChange={batchNameHandler}
                  placeholder="eg. 1"
                  min="1"
                />
              </FormControl>
              {formError !== '' && <FormLabelAlt>{formError}</FormLabelAlt>}
            </FormField>
            <FormSubmitBtn className={btnState}>Add Batch</FormSubmitBtn>
          </FormGroup>
        </Form>
        <Alert alert={alert} closeAlert={() => setAlert({ show: false })} />

        <BackButton
          to={ctx.userData.role === 'admin' ? '../batches' : './../batches'}
          text="Batch List"
        />
      </FormWrapper>
    </>
  );
};

export default AddBatch;
