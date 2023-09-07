import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Spinner from '../../Utils/Spinner';
import {
    FormControl,
    Form,
    FormField,
    FormGroup,
    FormLabel,
    FormLabelAlt,
    FormTitle,
    FormWrapper,
    FormSubmitBtn,
} from '../../Utils/Form';
import Alert from '../../Utils/Alert';
import DeleteTeacherBtn from './DeleteTeacherBtn';

const EditTeacherInfo = () => {
    const [teacher, setTeacher] = useOutletContext();
    const [submitBtnState, setSubmitBtnState] = useState();
    const [designationError, setDesignationError] = useState('');
    const [teacherId, setTeacherId] = useState();
    useEffect(() => {
        if (teacher) {
            setTeacherId(teacher._id);
        }
    }, [teacher]);

    const designationRef = useRef();
    const [alert, setAlert] = useState({ show: false });

    const ctx = useContext(AppContext);

    const designationHandler = () => {
        let designation = designationRef.current.value;
        if (designation === '') {
            setDesignationError('Teacher designation required');
        } else {
            setDesignationError('');
        }
    };

    const submitForm = async (event) => {
        event.preventDefault();
        let designation = designationRef.current.value;
        if (designation === '') {
            setDesignationError('Teacher designation required');
        } else {
            setDesignationError('');
        }

        if (teacher.designation === designation) return;

        setAlert({ show: false });
        setSubmitBtnState('btn-loading');

        await axios
            .patch(
                `${ctx.baseURL}/users/teachers/${teacherId}`,
                { designation: designationRef.current.value },
                {
                    credentials: 'include',
                }
            )
            .then((response) => {
                setTeacher(response.data.data.teacher);
                setAlert({
                    show: true,
                    type: 'success',
                    text: 'Teacher info successfully',
                });
            })
            .catch((error) => {
                let errorMessage = error.message;
                if (error.response) errorMessage = error.response.data.message;
                setAlert({
                    show: true,
                    type: 'error',
                    text: errorMessage,
                });
            });
        setSubmitBtnState('');
    };

    return (
        <>
            {teacher && (
                <FormWrapper>
                    <Form onSubmit={submitForm}>
                        <FormTitle>Edit Teacher Info</FormTitle>
                        <FormGroup>
                            <FormField>
                                <FormLabel>Teacher Name</FormLabel>
                                <FormGroup>
                                    <input
                                        className={ctx.inputClasses}
                                        defaultValue={teacher.name}
                                        type='text'
                                        disabled
                                        placeholder='Teacher name'
                                    />
                                </FormGroup>
                                <FormLabelAlt className=' '>This info can&#39; be changed</FormLabelAlt>
                            </FormField>

                            <FormField>
                                <FormLabel>Teacher Email</FormLabel>
                                <FormGroup>
                                    <input
                                        className={ctx.inputClasses}
                                        defaultValue={teacher.email}
                                        type='text'
                                        disabled
                                        placeholder='Teacher email'
                                    />
                                </FormGroup>
                                <FormLabelAlt className=' '>This info can&#39;t be changed</FormLabelAlt>
                            </FormField>

                            <FormField>
                                <FormLabel>Archived</FormLabel>
                                <FormControl>
                                    <select
                                        className={ctx.selectClasses}
                                        defaultValue={teacher.designation}
                                        ref={designationRef}
                                        onChange={designationHandler}
                                        required
                                    >
                                        <option value=''>Select Designation</option>
                                        <option value='Assistant Professor'>Assistant Professor</option>
                                        <option value='Associate Professor'>Associate Professor</option>
                                        <option value='Lecturer'>Lecturer</option>
                                    </select>
                                </FormControl>
                                {designationError !== '' && <FormLabelAlt>{designationError}</FormLabelAlt>}
                            </FormField>

                            <FormSubmitBtn className={submitBtnState}>Update</FormSubmitBtn>
                        </FormGroup>
                        <DeleteTeacherBtn teacher={teacher} />
                    </Form>
                    <Alert alert={alert} closeAlert={() => setAlert({ show: false })} />
                </FormWrapper>
            )}
            {!teacher && (
                <div className='flex justify-center items-center h-52'>
                    <Spinner className='spinner-sm' /> <span className='ml-2'>Fetching teacher info</span>
                </div>
            )}
            <div className='h-14'></div>
        </>
    );
};

export default EditTeacherInfo;
