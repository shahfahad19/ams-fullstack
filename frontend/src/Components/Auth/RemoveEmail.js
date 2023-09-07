import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../Context/AppContext';
import { useSearchParams } from 'react-router-dom';
import { AlertModal, ModalTitle, ModalWrapper } from '../Utils/Modal';
import Spinner from '../Utils/Spinner';

const RemoveEmail = () => {
    const ctx = useContext(AppContext);
    const [searchParams] = useSearchParams();
    const [loading, isLoading] = useState(true);
    const [alertModal, setAlertModal] = useState({
        show: false,
    });
    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/user/removeEmail/${searchParams.get('token')}`, {
                credentials: 'include',
            })
            .then(() => {
                isLoading(false);
                setAlertModal({
                    show: true,
                    type: 'success',
                    text: 'Email removed successfully',
                });
            })
            .catch((error) => {
                isLoading(false);
                setAlertModal({
                    show: true,
                    type: 'error',
                    text: ctx.computeError(error),
                });
            });
    }, []);

    const alertModalHandler = () => window.location.replace('/profile/view', { replace: true });
    return (
        <>
            {loading && (
                <ModalWrapper>
                    <ModalTitle>Removing email</ModalTitle>
                    <div className='flex justify-center mb-2'>
                        <Spinner />
                    </div>
                </ModalWrapper>
            )}
            {alertModal.show && (
                <AlertModal type={alertModal.type} text={alertModal.text} handler={alertModalHandler} />
            )}
        </>
    );
};

export default RemoveEmail;
