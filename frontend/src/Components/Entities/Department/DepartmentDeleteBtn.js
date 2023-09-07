import axios from 'axios';
import React, { useRef, useState } from 'react';
import { AlertModal, ModalButton, ModalCloseBtn, ModalFormButton, ModalTitle, ModalWrapper } from '../../Utils/Modal';
import Form, { FormControl, FormField, FormGroup, FormLabel, FormLabelAlt } from '../../Utils/Form';

const DepartmentDeleteBtn = ({ department, params, ctx, className }) => {
    const departmentName = useRef();
    const [departmentNameError, setDepartmentNameError] = useState('');
    const [btnState, setBtnState] = useState('');

    const [showConfimationModal, setShowConfirmationModal] = useState(false);
    const [showPostConfimationModal, setShowPostConfirmationModal] = useState(false);
    const [alertModal, setAlertModal] = useState({
        show: false,
        text: '',
    });

    const confirmationModalHandler = () => {
        setShowConfirmationModal(!showConfimationModal);
    };

    const postConfirmationModalHandler = () => {
        setShowConfirmationModal(false);

        setShowPostConfirmationModal(!showPostConfimationModal);
    };

    const successModalHandler = () => {
        ctx.navigate(-1, { replace: true });
    };

    const errorModalHandler = () => {
        setAlertModal({ show: false });
    };

    const deleteDepartment = async (event) => {
        event.preventDefault();
        if (departmentName.current.value === '') {
            setDepartmentNameError('Enter department name');
            return;
        } else if (departmentName.current.value !== department.department) {
            setDepartmentNameError('Department name does not match');
            return;
        } else {
            setDepartmentNameError('');
        }
        setBtnState('btn-loading');

        axios
            .delete(`${ctx.baseURL}/users/department/${params.departmentId}`, {
                credentials: 'include',
            })
            .then(() => {
                setBtnState('');

                setShowPostConfirmationModal(false);
                setAlertModal({
                    type: 'success',
                    show: true,
                    text: 'Department deleted successfully',
                });
            })
            .catch((error) => {
                setShowPostConfirmationModal(false);
                setBtnState('');

                setAlertModal({
                    type: 'error',
                    show: true,
                    text: ctx.computeError(error),
                });
            });
    };

    return (
        <>
            <button className={`${ctx.btnClasses} btn-error ${className} mt-2`} onClick={confirmationModalHandler}>
                Delete Department
            </button>

            {showConfimationModal && (
                <ModalWrapper>
                    <ModalCloseBtn handler={confirmationModalHandler} />
                    <ModalTitle>Are you sure?</ModalTitle>
                    <span>This department will be deleted permanently from database!</span>
                    <div className='flex gap-3'>
                        <ModalButton className='btn-error' handler={postConfirmationModalHandler}>
                            Delete
                        </ModalButton>

                        <ModalButton handler={confirmationModalHandler}>Cancel</ModalButton>
                    </div>
                </ModalWrapper>
            )}

            {showPostConfimationModal && (
                <ModalWrapper>
                    {btnState === '' && <ModalCloseBtn handler={postConfirmationModalHandler} />}
                    <ModalTitle>Confirm Department Name</ModalTitle>
                    <Form onSubmit={deleteDepartment}>
                        <FormGroup>
                            <FormField>
                                <FormLabel>Enter complete name of the department to confirm</FormLabel>
                                <FormControl>
                                    <input
                                        className={ctx.inputClasses}
                                        type='text'
                                        placeholder='Department Name'
                                        ref={departmentName}
                                    />
                                </FormControl>
                                {departmentNameError !== '' && <FormLabelAlt>{departmentNameError}</FormLabelAlt>}
                            </FormField>
                        </FormGroup>
                        <div className='flex gap-3 mt-3'>
                            <ModalFormButton className={btnState}>Delete</ModalFormButton>

                            {btnState === '' && (
                                <ModalButton handler={postConfirmationModalHandler}>Cancel</ModalButton>
                            )}
                        </div>
                    </Form>
                </ModalWrapper>
            )}

            {alertModal.show && (
                <AlertModal
                    type={alertModal.type}
                    text={alertModal.text}
                    handler={alertModal.type === 'success' ? successModalHandler : errorModalHandler}
                />
            )}
        </>
    );
};

export default DepartmentDeleteBtn;
