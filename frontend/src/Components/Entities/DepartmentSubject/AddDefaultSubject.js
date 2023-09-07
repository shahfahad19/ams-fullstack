import React, { useContext, useEffect, useRef, useState } from 'react';
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
import AppContext from '../../Context/AppContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Alert from '../../Utils/Alert';
import BackButton from '../../Utils/BackButton';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';

const AddDefaultSubject = () => {
    const ctx = useContext(AppContext);
    const params = useParams();
    const subjectNameRef = useRef();
    const subjectHoursRef = useRef();
    const [errors, showErrors] = useState(false);
    const [btnState, setBtnState] = useState('');
    const [alert, setAlert] = useState({ show: false });

    const [department, setDepartment] = useState();

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/users/department/${params.departmentId}`, {
                credentials: 'include',
            })
            .then((response) => {
                setDepartment(response.data.data.department);
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 404) {
                        ctx.navigate('/404', { replace: true });
                    }
                }
            });
    }, []);

    const addSubject = async (event) => {
        event.preventDefault();
        showErrors(false);

        const subjectName = subjectNameRef.current.value;
        const subjectHours = subjectHoursRef.current.value;

        if (subjectName === '' || subjectHours === '') {
            showErrors(true);
            return;
        }

        setBtnState('btn-loading');
        await axios
            .post(
                `${ctx.baseURL}/subjects/defaultSubjects`,
                {
                    name: subjectName,
                    creditHours: subjectHours,
                    department: params.departmentId,
                },
                {
                    credentials: 'include',
                }
            )
            .then(() => {
                subjectNameRef.current.value = '';
                subjectHoursRef.current.value = '';
                setAlert({
                    show: true,
                    type: 'success',
                    text: 'Subject added successfully!',
                });
            })
            .catch((error) => {
                let errorMessage = '';
                if (!error.response) {
                    errorMessage = error.message;
                } else {
                    if (error.response.data.error.code === 11000) {
                        errorMessage = 'This subject already exists in this department';
                    } else {
                        errorMessage = error.response.data.message;
                    }
                }
                setAlert({
                    show: true,
                    type: 'error',
                    text: errorMessage,
                });
            });
        setBtnState('');
    };

    return (
        <>
            <BreadCrumbs>
                <BreadCrumb to='/'>Home</BreadCrumb>
                <BreadCrumb to='../'>Departments</BreadCrumb>
                {department && (
                    <>
                        <BreadCrumb to={`../department/${department._id}`}>{department.department}</BreadCrumb>
                        <BreadCrumb to={`../department/${department._id}/subjects`}>Subjects</BreadCrumb>

                        <BreadCrumb>Add Subject</BreadCrumb>
                    </>
                )}
                {!department && <BreadCrumb>Loading...</BreadCrumb>}
            </BreadCrumbs>
            <FormWrapper>
                <Form onSubmit={addSubject}>
                    <FormTitle>Add Subject</FormTitle>
                    <FormGroup>
                        <FormField>
                            <FormLabel>Subject Name</FormLabel>
                            <FormControl>
                                <input
                                    className={ctx.inputClasses}
                                    type='text'
                                    placeholder='Subject Name'
                                    ref={subjectNameRef}
                                />
                            </FormControl>
                            {errors && subjectNameRef && subjectNameRef.current.value === '' && (
                                <FormLabelAlt>Subject name required</FormLabelAlt>
                            )}
                        </FormField>

                        <FormField>
                            <FormLabel>Credit Hours</FormLabel>
                            <FormControl>
                                <select className={ctx.selectClasses} ref={subjectHoursRef}>
                                    <option value=''>Select credit hours</option>
                                    <option value='3'>3 Hours</option>
                                    <option value='4'>4 Hours</option>
                                </select>
                            </FormControl>
                            {errors && subjectHoursRef && subjectHoursRef.current.value === '' && (
                                <FormLabelAlt>Subject credit hours required</FormLabelAlt>
                            )}
                        </FormField>
                        <FormSubmitBtn className={btnState}>Add</FormSubmitBtn>
                    </FormGroup>
                </Form>
                <Alert alert={alert} closeAlert={() => setAlert({ show: false })} />

                <BackButton to={`/super-admin/department/${params.departmentId}/subjects`} text='Subjects List' />
            </FormWrapper>
        </>
    );
};

export default AddDefaultSubject;
