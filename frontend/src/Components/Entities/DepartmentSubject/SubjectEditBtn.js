import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import Form, { FormControl, FormField, FormGroup, FormLabel, FormLabelAlt } from '../../Utils/Form';
import { AlertModal, ModalButton, ModalCloseBtn, ModalFormButton, ModalTitle, ModalWrapper } from '../../Utils/Modal';
import AppContext from '../../Context/AppContext';

const SubjectEditBtn = ({ subject, className, subjectEdited }) => {
    const [btnState, setBtnState] = useState('');
    const ctx = useContext(AppContext);

    const subjectNameRef = useRef();
    const subjectHoursRef = useRef();
    const [errors, showErrors] = useState(false);

    const [showConfimationModal, setShowConfirmationModal] = useState(false);
    const [alertModal, setAlertModal] = useState({
        show: false,
        text: '',
    });

    const confirmationModalHandler = () => {
        setShowConfirmationModal(!showConfimationModal);
    };

    const successModalHandler = () => {
        subjectEdited(Math.random());
        setAlertModal({ show: false });
    };

    const errorModalHandler = () => {
        setAlertModal({ show: false });
    };

    const updateSubject = async (event) => {
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
            .patch(
                `${ctx.baseURL}/subjects/defaultSubjects/${subject._id}`,
                {
                    name: subjectName,
                    creditHours: subjectHours,
                },
                {
                    credentials: 'include',
                }
            )
            .then(() => {
                subjectNameRef.current.value = '';
                subjectHoursRef.current.value = '';
                setShowConfirmationModal(false);
                setAlertModal({
                    show: true,
                    type: 'success',
                    text: 'Subject edited successfully!',
                });
            })
            .catch((error) => {
                setShowConfirmationModal(false);
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
                setAlertModal({
                    show: true,
                    type: 'error',
                    text: errorMessage,
                });
            });
        setBtnState('');
    };

    return (
        <>
            <button className={`btn btn-sm btn-solid-primary ${className} mr-2`} onClick={confirmationModalHandler}>
                Edit
            </button>

            {showConfimationModal && (
                <ModalWrapper>
                    {btnState === '' && <ModalCloseBtn handler={confirmationModalHandler} />}
                    <ModalTitle>Edit Subject</ModalTitle>
                    <Form onSubmit={updateSubject}>
                        <FormGroup>
                            <FormField>
                                <FormLabel>Subject Name</FormLabel>
                                <FormControl>
                                    <input
                                        className={ctx.inputClasses + ' input-sm'}
                                        type='text'
                                        placeholder='Subject Name'
                                        ref={subjectNameRef}
                                        defaultValue={subject.name}
                                    />
                                </FormControl>
                                {errors && subjectNameRef && subjectNameRef.current.value === '' && (
                                    <FormLabelAlt>Subject name required</FormLabelAlt>
                                )}
                            </FormField>

                            <FormField>
                                <FormLabel>Credit Hours</FormLabel>
                                <FormControl>
                                    <select
                                        className={ctx.selectClasses + ' select-sm'}
                                        ref={subjectHoursRef}
                                        defaultValue={subject.creditHours}
                                    >
                                        <option value=''>Select credit hours</option>
                                        <option value='3'>3 Hours</option>
                                        <option value='4'>4 Hours</option>
                                    </select>
                                </FormControl>
                                {errors && subjectHoursRef && subjectHoursRef.current.value === '' && (
                                    <FormLabelAlt>Subject credit hours required</FormLabelAlt>
                                )}
                            </FormField>
                        </FormGroup>

                        <div className='flex gap-3 mt-3'>
                            <ModalFormButton className={btnState + ' btn-solid-primary'}>Update</ModalFormButton>

                            {btnState === '' && <ModalButton handler={confirmationModalHandler}>Cancel</ModalButton>}
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

export default SubjectEditBtn;
