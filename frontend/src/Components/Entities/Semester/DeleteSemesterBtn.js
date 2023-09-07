import axios from 'axios';
import React, { useRef, useState } from 'react';
import Form, { FormControl, FormField, FormGroup, FormLabel, FormLabelAlt } from '../../Utils/Form';
import { AlertModal, ModalButton, ModalCloseBtn, ModalFormButton, ModalTitle, ModalWrapper } from '../../Utils/Modal';

const DeleteSemesterBtn = ({ ctx, semester, params, className }) => {
    const semesterName = useRef();
    const [semesterNameError, setSemesterNameError] = useState('');
    const [btnState, setBtnState] = useState('');

    const [showConfimationModal, setShowConfirmationModal] = useState(false);
    const [showPostConfimationModal, setShowPostConfirmationModal] = useState(false);
    const [alertModal, setAlertModal] = useState({
        show: false,
        text: '',
    });

    const confirmationModalHandler = () => {
        setShowConfirmationModal(showConfimationModal !== true);
    };

    const postConfirmationModalHandler = () => {
        setShowConfirmationModal(false);
        setShowPostConfirmationModal(showPostConfimationModal !== true);
    };

    const successModalHandler = () => {
        ctx.navigate(-1, { replace: true });
    };

    const errorModalHandler = () => {
        setAlertModal({ show: false });
    };

    const deleteSemester = async (event) => {
        event.preventDefault();
        if (semesterName.current.value === '') {
            setSemesterNameError('Enter semester name');
            return;
        } else if (semesterName.current.value !== 'Semester ' + semester.name) {
            setSemesterNameError('Semester name does not match');
            return;
        } else setSemesterNameError('');

        setBtnState('btn-loading');
        await axios
            .delete(`${ctx.baseURL}/semesters/${params.semesterId}`, {
                credentials: 'include',
            })
            .then(() => {
                setShowPostConfirmationModal(false);
                setAlertModal({
                    type: 'success',
                    show: true,
                    text: 'Semester deleted successfully',
                });
            })
            .catch((error) => {
                setShowPostConfirmationModal(false);

                const errorMessage = ctx.computeError(error);
                setAlertModal({
                    type: 'error',
                    show: true,
                    text: errorMessage,
                });
            });
        setBtnState('');
    };

    return (
        <>
            <button className={`${ctx.btnClasses} btn-error ${className} mt-2`} onClick={confirmationModalHandler}>
                Delete Semester
            </button>

            {showConfimationModal && (
                <>
                    <ModalWrapper>
                        <ModalCloseBtn handler={confirmationModalHandler} />
                        <ModalTitle>Are you sure?</ModalTitle>
                        <span>This semester will be deleted permanently from database!</span>
                        <div className='flex gap-3'>
                            <ModalButton className='btn-error' handler={postConfirmationModalHandler}>
                                Delete
                            </ModalButton>

                            <ModalButton handler={confirmationModalHandler}>Cancel</ModalButton>
                        </div>
                    </ModalWrapper>
                </>
            )}

            {showPostConfimationModal && (
                <ModalWrapper>
                    {btnState === '' && <ModalCloseBtn handler={postConfirmationModalHandler} />}
                    <ModalTitle>Confirm Semester Name</ModalTitle>
                    <Form onSubmit={deleteSemester}>
                        <FormGroup>
                            <FormField>
                                <FormLabel>Enter complete name of the semester to confirm</FormLabel>
                                <FormControl>
                                    <input
                                        className={ctx.inputClasses}
                                        type='text'
                                        placeholder='Semester Name'
                                        ref={semesterName}
                                    />
                                </FormControl>
                                {semesterNameError !== '' && <FormLabelAlt>{semesterNameError}</FormLabelAlt>}
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

export default DeleteSemesterBtn;
