import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../Context/AppContext';
import BackButton from '../../Utils/BackButton';
import DepartmentName from '../Department/DepartmentName';
import {
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
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

const AddTeacher = () => {
  const params = useParams();
  const [btnState, setBtnState] = useState('');
  const [departmentName, setDepartmentName] = useState();

  const ctx = useContext(AppContext);

  const [alert, setAlert] = useState({ show: false });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

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

  const submitForm = async (data) => {
    setBtnState('btn-loading');
    data.department = ctx.userData.department;

    setAlert({ show: false });

    await axios
      .post(`${ctx.baseURL}/users/teachers`, data, {
        credentials: 'include'
      })
      .then(() => {
        reset();
        setAlert({
          show: true,
          type: 'success',
          text: 'Teacher added successfully'
        });
      })
      .catch((error) => {
        let errorMessage = error.message;
        if (error.response) {
          if (error.response.data.error.code === 11000)
            errorMessage = 'This email is linked to another account';
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
      {ctx.userData.role === 'admin' && <DepartmentName name={ctx.userData.name} />}
      {ctx.userData.role === 'super-admin' && departmentName && (
        <DepartmentName name={departmentName} />
      )}

      <BreadCrumbs>
        <BreadCrumb to="/">Home</BreadCrumb>
        {departmentName && ctx.userData.role === 'super-admin' && (
          <>
            <BreadCrumb to="../">Departments</BreadCrumb>
            <BreadCrumb to="./../">{departmentName}</BreadCrumb>
          </>
        )}

        <BreadCrumb to="./../teachers">Teachers</BreadCrumb>
        <BreadCrumb>Add Teacher</BreadCrumb>
      </BreadCrumbs>

      <FormWrapper>
        <form className="font-medium w-full" onSubmit={handleSubmit(submitForm)}>
          <FormTitle>Add Teacher</FormTitle>
          <FormGroup>
            <FormField>
              <label className="form-label">
                <span className="form-label">Email</span>
                <span className="form-label-alt">(optional)</span>
              </label>
              <FormControl>
                <input
                  className={`${ctx.inputClasses}${errors.name ? ' input-error' : ''}`}
                  type="text"
                  placeholder="Enter Teacher's Name"
                  {...register('name', {
                    minLength: {
                      value: 3,
                      message: 'Minimum 3 characters required'
                    },
                    maxLength: {
                      value: 35,
                      message: 'Maximum length is exceeded (35)'
                    }
                  })}
                />
              </FormControl>
              {errors.name && <FormLabelAlt>{errors.name.message}</FormLabelAlt>}
            </FormField>

            <FormField>
              <FormLabel>Teacher Email</FormLabel>
              <FormControl>
                <input
                  className={`${ctx.inputClasses}${errors.email ? ' input-error' : ''}`}
                  type="email"
                  placeholder="Enter Teacher's Email"
                  {...register('email', {
                    required: {
                      value: true,
                      message: 'Email required'
                    },
                    pattern: {
                      value: /^[\S-]+@([\S-]+\.)+\S{2,4}$/g,
                      message: 'Email is not valid'
                    }
                  })}
                />
              </FormControl>
              {errors.email && <FormLabelAlt>{errors.email.message}</FormLabelAlt>}
            </FormField>

            <FormField>
              <FormLabel>Designation</FormLabel>
              <FormControl>
                <select
                  className={`${ctx.selectClasses}${errors.designation ? ' select-error' : ''}`}
                  {...register('designation', {
                    required: {
                      value: true,
                      message: 'Designation required'
                    }
                  })}>
                  <option value="">Select Designation</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Lecturer">Lecturer</option>
                </select>
              </FormControl>
              {errors.designation && <FormLabelAlt>{errors.designation.message}</FormLabelAlt>}
            </FormField>

            <FormField>
              <label className="form-label">
                <span className="form-label">Gender</span>
                <span className="form-label-alt">(optional)</span>
              </label>
              <FormControl>
                <select
                  className={`${ctx.selectClasses}${errors.gender ? ' select-error' : ''}`}
                  {...register('gender')}>
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </FormControl>
              {errors.gender && <FormLabelAlt>{errors.gender.message}</FormLabelAlt>}
            </FormField>

            <FormSubmitBtn className={btnState}>Add Teacher</FormSubmitBtn>
          </FormGroup>
        </form>
        <small>
          Teacher will be required to fill optional values when completing their profile
        </small>

        <Alert
          alert={alert}
          closeAlert={() => {
            setAlert({ show: false });
          }}
        />
        <br />
        <BackButton to="/admin/teachers" text="Teachers List" />
      </FormWrapper>

      <div className="h-14"></div>
    </>
  );
};

export default AddTeacher;
