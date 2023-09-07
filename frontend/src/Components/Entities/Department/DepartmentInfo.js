import React, { useContext, useRef, useState } from 'react';
import AppContext from '../../Context/AppContext';
import { Form, useOutletContext, useParams } from 'react-router-dom';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'axios';
import DepartmentDeleteBtn from './DepartmentDeleteBtn';
import { SpinnerWithText } from '../../Utils/Spinner';
import { FormControl, FormField, FormGroup, FormLabel, FormLabelAlt, FormWrapper } from '../../Utils/Form';
import { ModalButton, ModalCloseBtn, ModalTitle, ModalWrapper } from '../../Utils/Modal';
import { AlertModal } from '../../Utils/Modal';

const DepartmentInfo = () => {
    const ctx = useContext(AppContext);
    const params = useParams();
    const [department, setDepartment] = useOutletContext();
    const emailRef = useRef();
    const [btnState, setBtnState] = useState('');
    const [emailError, setEmailError] = useState('');

    const MySwal = withReactContent(Swal);
    const [showEditAdminModal, setShowEditAdminModal] = useState();
    const [alertModal, setAlertModal] = useState({
        show: false,
    });

    const editAdminModalHandler = () => setShowEditAdminModal(!showEditAdminModal);

    const alertModalHandler = () => setAlertModal(false);

    const changeAdmin = async () => {
        const email = emailRef.current.value;

        if (email === '') {
            setEmailError('Email required');
            return;
        } else setEmailError('');

        setBtnState('btn-loading');
        await axios
            .patch(
                `${ctx.baseURL}/users/department/${params.departmentId}/updateEmail`,
                { email },
                {
                    credentials: 'include',
                }
            )
            .then((response) => {
                setDepartment(response.data.data.user);
                setShowEditAdminModal(false);
                setAlertModal({
                    show: true,
                    type: 'success',
                    text: 'Admin changed successfully',
                });
            })
            .catch((error) => {
                setShowEditAdminModal(false);
                let errorMessage = ctx.computeError(error);
                if (error.response && error.response.data.error.code === 11000) errorMessage = 'Email already in use';
                setAlertModal({
                    show: true,
                    type: 'success',
                    text: errorMessage,
                });
            });
        setBtnState('');
    };

    return (
        <>
            <SubSectionHeader text='Department Info' />
            {department.name && (
                <FormWrapper>
                    <table className='table'>
                        <tbody>
                            <tr>
                                <th className='font-medium'>Department</th>
                                <td>{department.department}</td>
                            </tr>
                            <tr>
                                <th className='font-medium'>Admin</th>
                                <td>
                                    <div className='flex space-x-4 items-center'>
                                        <div className='h-full'>{department.name}</div>

                                        <div>
                                            <div className='popover popover-hover'>
                                                <img
                                                    className='w-10 popover-trigger rounded-full'
                                                    src={department.photo}
                                                    alt={department.name + '_pic'}
                                                />
                                                <div className='popover-content sm:popover-right'>
                                                    <div className='popover-arrow'></div>
                                                    <img src={department.photo} alt={department.name + '_pic'} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th className='font-medium'>Email</th>
                                <td>{department.email}</td>
                            </tr>
                            <tr>
                                <th className='font-medium'>Approved</th>
                                <td>{department.approved.toString()}</td>
                            </tr>
                        </tbody>
                    </table>
                    <button className='btn btn-block btn-secondary mt-1' onClick={editAdminModalHandler}>
                        Change Admin
                    </button>
                    <DepartmentDeleteBtn department={department} params={params} ctx={ctx} MySwal={MySwal} />
                </FormWrapper>
            )}

            {!department.name && <SpinnerWithText>Fetching department info...</SpinnerWithText>}

            {showEditAdminModal && (
                <ModalWrapper>
                    {btnState === '' && <ModalCloseBtn handler={editAdminModalHandler} />}
                    <ModalTitle>Change Admin</ModalTitle>
                    <Form onSubmit={changeAdmin}>
                        <FormGroup>
                            <FormField>
                                <FormLabel>New Email</FormLabel>
                                <FormControl>
                                    <input
                                        className={ctx.inputClasses}
                                        type='text'
                                        placeholder='Enter new admin email'
                                        ref={emailRef}
                                    />
                                </FormControl>
                                {emailError !== '' && <FormLabelAlt>{emailError}</FormLabelAlt>}
                            </FormField>
                        </FormGroup>
                        <div className='flex gap-3 mt-3'>
                            <button type='submit' className={`btn btn-secondary btn-block ${btnState}`}>
                                Update
                            </button>
                            {btnState === '' && <ModalButton handler={editAdminModalHandler}>Cancel</ModalButton>}
                        </div>
                    </Form>
                </ModalWrapper>
            )}

            {alertModal.show && (
                <AlertModal type={alertModal.type} text={alertModal.text} handler={alertModalHandler} />
            )}

            <div className='h-14'></div>
        </>
    );
};

export default DepartmentInfo;
