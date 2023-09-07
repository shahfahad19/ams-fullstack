import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import { SpinnerWithText } from '../../Utils/Spinner';
import { FormWrapper } from '../../Utils/Form';
import { AlertModal, ModalButton, ModalCloseBtn, ModalTitle, ModalWrapper } from '../../Utils/Modal';

const RemoveSubject = () => {
    const [subject] = useOutletContext();

    const ctx = useContext(AppContext);

    const [btnState, setBtnState] = useState('');

    const [showConfimationModal, setShowConfirmationModal] = useState(false);
    const [alertModal, setAlertModal] = useState({
        show: false,
        text: '',
    });

    const confirmationModalHandler = () => {
        setShowConfirmationModal(!showConfimationModal);
    };

    const successModalHandler = () => {
        ctx.navigate(-1, { replace: true });
    };

    const errorModalHandler = () => {
        setAlertModal({ show: false });
    };

    const removeSubject = async () => {
        setBtnState('btn-loading');
        await axios
            .patch(
                `${ctx.baseURL}/subjects/remove/teacher-subjects/${subject._id}`,
                {
                    subject: subject.Id,
                },
                {
                    credentials: 'include',
                }
            )
            .then(() => {
                setShowConfirmationModal(false);

                setAlertModal({
                    show: true,
                    type: 'success',
                    text: 'Teacher removed successfully',
                });
            })
            .catch((error) => {
                setShowConfirmationModal(false);

                setAlertModal({
                    show: true,
                    type: 'error',
                    text: ctx.computeError(error),
                });
            });
        setBtnState('');
    };

    return (
        <>
            <SubSectionHeader text='Remove Subject' />
            <FormWrapper>
                {subject.name && (
                    <div className='p-5'>
                        <p className='text-xl'>Click following button to remove this subject from your list.</p>
                        <p className='text-error py-5'>Note: You cannot reverse this action.</p>
                        <div className='text-center'>
                            <button className='btn btn-error' onClick={confirmationModalHandler}>
                                Remove
                            </button>
                        </div>
                    </div>
                )}
                {!subject.name && <SpinnerWithText>Please wait...</SpinnerWithText>}
            </FormWrapper>

            {showConfimationModal && (
                <>
                    <ModalWrapper>
                        {btnState === '' && <ModalCloseBtn handler={confirmationModalHandler} />}
                        <ModalTitle>Are you sure?</ModalTitle>
                        <span>This subject will be removed from your list!</span>
                        <div className='flex gap-3'>
                            <ModalButton className={`btn-error ${btnState}`} handler={removeSubject}>
                                Delete
                            </ModalButton>

                            {btnState === '' && <ModalButton handler={confirmationModalHandler}>Cancel</ModalButton>}
                        </div>
                    </ModalWrapper>
                </>
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

export default RemoveSubject;
