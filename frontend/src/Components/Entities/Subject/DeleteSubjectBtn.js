import axios from 'axios';
import React, { useRef, useState } from 'react';
import Form, { FormControl, FormField, FormGroup, FormLabel, FormLabelAlt } from '../../Utils/Form';
import { AlertModal, ModalButton, ModalCloseBtn, ModalFormButton, ModalTitle, ModalWrapper } from '../../Utils/Modal';

const DeleteSubjectBtn = ({ ctx, subject, params, className }) => {
    const subjectName = useRef();
    const [subjectNameError, setSubjectNameError] = useState('');
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

    const deleteSubject = async (event) => {
        event.preventDefault();
        if (subjectName.current.value === '') {
            setSubjectNameError('Enter subject name');
            return;
        } else if (subjectName.current.value !== subject.name) {
            setSubjectNameError('Subject name does not match');
            return;
        } else setSubjectNameError('');

        setBtnState('btn-loading');
        await axios
            .delete(`${ctx.baseURL}/subjects/${params.subjectId}`, {
                credentials: 'include',
            })
            .then(() => {
                setShowPostConfirmationModal(false);
                setAlertModal({
                    type: 'success',
                    show: true,
                    text: 'Subject deleted successfully',
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
                Delete Subject
            </button>

            {showConfimationModal && (
                <>
                    <ModalWrapper>
                        <ModalCloseBtn handler={confirmationModalHandler} />
                        <ModalTitle>Are you sure?</ModalTitle>
                        <span>This subject will be deleted permanently from database!</span>
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
                    <ModalTitle>Confirm Subject Name</ModalTitle>
                    <Form onSubmit={deleteSubject}>
                        <FormGroup>
                            <FormField>
                                <FormLabel>Enter complete name of the subject to confirm</FormLabel>
                                <FormControl>
                                    <input
                                        className={ctx.inputClasses}
                                        type='text'
                                        placeholder='Subject Name'
                                        ref={subjectName}
                                    />
                                </FormControl>
                                {subjectNameError !== '' && <FormLabelAlt>{subjectNameError}</FormLabelAlt>}
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

export default DeleteSubjectBtn;
