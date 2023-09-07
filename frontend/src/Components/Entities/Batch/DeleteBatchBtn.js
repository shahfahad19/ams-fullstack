import axios from 'axios';
import React, { useRef, useState } from 'react';
import Form, { FormControl, FormField, FormGroup, FormLabel, FormLabelAlt } from '../../Utils/Form';
import { AlertModal, ModalButton, ModalCloseBtn, ModalFormButton, ModalTitle, ModalWrapper } from '../../Utils/Modal';

const DeleteBatchBtn = ({ ctx, batchData, params, className }) => {
    const batchName = useRef();
    const [batchNameError, setBatchNameError] = useState('');
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

    const deleteBatch = async (event) => {
        event.preventDefault();
        if (batchName.current.value === '') {
            setBatchNameError('Enter batch name');
            return;
        } else if (batchName.current.value !== 'Batch ' + batchData.name) {
            setBatchNameError('Batch name does not match');
            return;
        } else setBatchNameError('');

        setBtnState('btn-loading');
        await axios
            .delete(`${ctx.baseURL}/batches/${params.batchId}`, {
                credentials: 'include',
            })
            .then(() => {
                setShowPostConfirmationModal(false);
                setAlertModal({
                    type: 'success',
                    show: true,
                    text: 'Batch deleted successfully',
                });
            })
            .catch((error) => {
                setShowPostConfirmationModal(false);

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
            <button className={`${ctx.btnClasses} btn-error ${className} mt-2`} onClick={confirmationModalHandler}>
                Delete Batch
            </button>

            {showConfimationModal && (
                <ModalWrapper>
                    <ModalCloseBtn handler={confirmationModalHandler} />
                    <ModalTitle>Are you sure?</ModalTitle>
                    <span>This batch will be deleted permanently from database!</span>
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
                    <ModalTitle>Confirm Batch Name</ModalTitle>
                    <Form onSubmit={deleteBatch}>
                        <FormGroup>
                            <FormField>
                                <FormLabel>Enter complete name of the batch to confirm</FormLabel>
                                <FormControl>
                                    <input
                                        className={ctx.inputClasses}
                                        type='text'
                                        placeholder='Batch Name'
                                        ref={batchName}
                                    />
                                </FormControl>
                                {batchNameError !== '' && <FormLabelAlt>{batchNameError}</FormLabelAlt>}
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

export default DeleteBatchBtn;
