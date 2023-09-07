import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import AppContext from '../../Context/AppContext';
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
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';

const AddDepartment = () => {
  const [btnState, setBtnState] = useState('');
  const [alert, setAlert] = useState({
    show: false
  });
  const [error, setError] = useState({});
  const ctx = useContext(AppContext);

  const emailRef = useRef();
  const departmentRef = useRef();

  const submitForm = async (event) => {
    event.preventDefault();
    if (emailRef.current.value === '') {
      setError({
        email: 'Email required'
      });
      return;
    } else if (departmentRef.current.value === '') {
      setError({
        department: 'Department required'
      });
      return;
    } else setError({});

    setBtnState('btn-loading');
    setAlert({ show: false });

    const reqBody = {
      department: departmentRef.current.value,
      email: emailRef.current.value
    };
    await axios
      .post(`${ctx.baseURL}/users/departments`, reqBody, {
        credentials: 'include'
      })
      .then(() => {
        departmentRef.current.value = '';
        emailRef.current.value = '';
        setAlert({
          show: true,
          type: 'success',
          text: 'Department created successfully',
          showBtn: true
        });
        setTimeout(() => {
          setAlert({ show: false });
        }, 3000);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data.message.includes('department'))
            setAlert({
              show: true,
              type: 'error',
              text: reqBody.department + ' department already exists',
              showBtn: true
            });
          else if (error.response.data.message.includes('email'))
            setAlert({
              show: true,
              type: 'error',
              text: reqBody.email + ' already has an account',
              showBtn: true
            });
          else
            setAlert({
              show: true,
              type: 'error',
              text: error.response.data.message,
              showBtn: true
            });
        } else
          setAlert({
            show: true,
            type: 'error',
            text: error.message,
            showBtn: true
          });
      });
    setBtnState('');
  };

  return (
    <>
      <BreadCrumbs>
        <BreadCrumb to="/">Home</BreadCrumb>
        <BreadCrumb to="../">Departments</BreadCrumb>
        <BreadCrumb>Add Department</BreadCrumb>
      </BreadCrumbs>
      <FormWrapper>
        <Form onSubmit={submitForm}>
          <FormTitle>Add Department</FormTitle>
          <FormGroup>
            <FormField>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <input
                  className={ctx.inputClasses}
                  type="email"
                  ref={emailRef}
                  placeholder="Department Admin Email"
                />
              </FormControl>
              {error.email && <FormLabelAlt>{error.email}</FormLabelAlt>}
            </FormField>
            <FormField>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <select className={ctx.selectClasses} type="number" ref={departmentRef}>
                  <option value="">Select Department</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Economics">Economics</option>
                  <option value="English">English</option>
                  <option value="Geology">Geology</option>
                  <option value="Management Sciences">Management Sciences</option>
                  <option value="Microbiology">Microbiology</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Sociology">Sociology</option>
                  <option value="Zoology">Zoology</option>
                  <option value="PCRS">PCRS</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="Botany">Botany</option>
                  <option value="Biotechnology">Biotechnology</option>
                  <option value="Law">Law</option>
                  <option value="Education">Education</option>
                  <option value="Environmental Sciences">Environmental Sciences</option>
                  <option value="Geography">Geography</option>
                  <option value="Journalism & Mass Communication">
                    Journalism & Mass Communication
                  </option>
                  <option value="Library & Information Sciences">
                    Library & Information Sciences
                  </option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Pashto">Pashto</option>
                  <option value="Political Science">Political Science</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Tourism & Hotel Management">Tourism & Hotel Management</option>
                  <option value="Urdu">Urdu</option>
                  <option value="Islamic & Arabic Studies">Islamic & Arabic Studies</option>
                </select>
              </FormControl>
              {error.department && <FormLabelAlt>{error.department}</FormLabelAlt>}
            </FormField>
          </FormGroup>
          <FormSubmitBtn className={btnState}>Add Department</FormSubmitBtn>
        </Form>
        <Alert
          alert={alert}
          closeAlert={() => {
            setAlert({ show: false });
          }}
        />
      </FormWrapper>
    </>
  );
};

export default AddDepartment;
