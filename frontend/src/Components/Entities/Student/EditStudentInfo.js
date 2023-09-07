import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import Form, {
    FormControl,
    FormField,
    FormGroup,
    FormLabel,
    FormLabelAlt,
    FormSubmitBtn,
    FormTitle,
    FormWrapper,
} from '../../Utils/Form';
import Alert from '../../Utils/Alert';
import { useOutletContext } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import { SpinnerWithText } from '../../Utils/Spinner';
import StudentDeleteBtn from './StudentDeleteBtn';

const EditStudentInfo = () => {
    const ctx = useContext(AppContext);
    const [student, setStudent] = useOutletContext();

    const [btnState, setBtnState] = useState('');
    const [alert, setAlert] = useState({
        show: false,
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        setBtnState('btn-loading');
        axios
            .patch(`${ctx.baseURL}/users/students/${student._id}`, data, {
                credentials: 'include',
            })
            .then((response) => {
                setBtnState('');
                setStudent(response.data.data.student);
                setAlert({
                    show: true,
                    type: 'success',
                    text: 'Student updated successfully!',
                });
            })
            .catch((error) => {
                setBtnState('');
                setAlert({
                    show: true,
                    type: 'error',
                    text: ctx.computeError(error),
                });
            });
    };

    return (
        <>
            {student && (
                <FormWrapper>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <FormTitle>Update Student Info</FormTitle>
                        <FormGroup>
                            <FormControl>
                                <input
                                    className={`${ctx.inputClasses} ${errors.name && 'input-error'}`}
                                    type='text'
                                    placeholder='Student Name'
                                    defaultValue={student.name}
                                    {...register('name', {
                                        required: {
                                            value: true,
                                            message: 'Please provide student full name',
                                        },
                                        minLength: {
                                            value: 3,
                                            message: 'Minimum 3 characters required',
                                        },
                                        maxLength: {
                                            value: 35,
                                            message: 'Maximum length is exceeded (35)',
                                        },
                                    })}
                                />
                            </FormControl>

                            <FormField>
                                <FormLabel>Roll No</FormLabel>
                                <FormControl>
                                    <input
                                        className={`${ctx.inputClasses} ${errors.rollNo && 'input-error'}`}
                                        type='number'
                                        placeholder='Class Roll No.'
                                        defaultValue={student.rollNo}
                                        {...register('rollNo', {
                                            required: {
                                                value: true,
                                                message: 'Please enter your roll no.',
                                            },
                                            maxLength: {
                                                value: 3,
                                                message: 'Maximum length is exceeded (3)',
                                            },
                                        })}
                                    />
                                </FormControl>
                                {errors.rollNo && <FormLabelAlt>{errors.rollNo.message}</FormLabelAlt>}
                            </FormField>

                            <FormField>
                                <FormLabel>Registration No.</FormLabel>
                                <FormControl>
                                    <input
                                        className={`${ctx.inputClasses} ${errors.registrationNo && 'input-error'}`}
                                        type='text'
                                        defaultValue={student.registrationNo}
                                        placeholder='University Registration No.'
                                        {...register('registrationNo', {
                                            required: {
                                                value: true,
                                                message: 'Please enter your registration no.',
                                            },
                                            pattern: {
                                                value: /^\d{2}-\d{5}-\d{5}$/,
                                                message: 'Invalid registration no. Format is 12-12345-12345',
                                            },
                                        })}
                                    />
                                </FormControl>
                                {errors.registrationNo && <FormLabelAlt>{errors.registrationNo.message}</FormLabelAlt>}
                            </FormField>
                        </FormGroup>

                        <FormSubmitBtn className={btnState}>Update</FormSubmitBtn>
                    </Form>
                    <StudentDeleteBtn student={student} />
                    <Alert alert={alert} closeAlert={() => setAlert({ show: false })} />
                </FormWrapper>
            )}

            {!student && <SpinnerWithText>Fetching student details...</SpinnerWithText>}

            <div className='h-14'></div>
        </>
    );
};

export default EditStudentInfo;
