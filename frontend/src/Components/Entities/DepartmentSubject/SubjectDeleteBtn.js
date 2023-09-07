import axios from 'axios';
import React, { useContext, useState } from 'react';
import { AlertModal, ModalButton, ModalCloseBtn, ModalTitle, ModalWrapper } from '../../Utils/Modal';
import AppContext from '../../Context/AppContext';

const SubjectDeleteBtn = ({ subject, className, subjectDeleted }) => {
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
        subjectDeleted(Math.random());
        setAlertModal({ show: false });
    };

    const errorModalHandler = () => {
        setAlertModal({ show: false });
    };

    const deleteSubject = async (event) => {
        event.preventDefault();

        setBtnState('btn-loading');

        await axios
            .delete(`${ctx.baseURL}/subjects/defaultSubjects/${subject._id}`, {
                credentials: 'include',
            })
            .then(() => {
                setShowConfirmationModal(false);

                // To reload the subjects list
                setAlertModal({
                    type: 'success',
                    show: true,
                    text: 'Subject deleted successfully',
                });
            })
            .catch((error) => {
                setShowConfirmationModal(false);

                setAlertModal({
                    type: 'error',
                    show: true,
                    text: ctx.computeError(error),
                });
            });
        setBtnState('');
    };

    return (
        <>
            <button className={`btn btn-solid-error btn-sm ${className} mr-2`} onClick={confirmationModalHandler}>
                Delete
            </button>

            {showConfimationModal && (
                <ModalWrapper>
                    {btnState === '' && <ModalCloseBtn handler={confirmationModalHandler} />}
                    <ModalTitle>Are you sure?</ModalTitle>
                    <span>This subject will be deleted!</span>
                    <div className='flex gap-3'>
                        <ModalButton className={`btn-error ${btnState}`} handler={deleteSubject}>
                            Delete
                        </ModalButton>

                        {btnState === '' && <ModalButton handler={confirmationModalHandler}>Cancel</ModalButton>}
                    </div>
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

export default SubjectDeleteBtn;
