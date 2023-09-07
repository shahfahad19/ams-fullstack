import axios from 'axios';
import React, { useContext, useState } from 'react';
import { AlertModal, ModalButton, ModalCloseBtn, ModalTitle, ModalWrapper } from '../../Utils/Modal';
import AppContext from '../../Context/AppContext';

const StudentDeleteBtn = ({ student, className }) => {
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

    const deleteSubject = async (event) => {
        event.preventDefault();

        setBtnState('btn-loading');

        await axios
            .delete(`${ctx.baseURL}/users/students/${student._id}`, {
                credentials: 'include',
            })
            .then(() => {
                setShowConfirmationModal(false);

                // To reload the subjects list
                setAlertModal({
                    type: 'success',
                    show: true,
                    text: 'Student deleted successfully',
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
            <button className={`btn btn-error btn-block ${className} mt-3`} onClick={confirmationModalHandler}>
                Delete
            </button>

            {showConfimationModal && (
                <ModalWrapper>
                    {btnState === '' && <ModalCloseBtn handler={confirmationModalHandler} />}
                    <ModalTitle>Are you sure?</ModalTitle>
                    <span>This student will be deleted from the database!</span>
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

export default StudentDeleteBtn;
