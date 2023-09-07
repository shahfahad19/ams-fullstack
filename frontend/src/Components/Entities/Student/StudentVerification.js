import React, { useContext, useRef, useState } from 'react';
import { AlertModal, ModalButton, ModalCloseBtn, ModalTitle, ModalWrapper } from '../../Utils/Modal';
import ReCAPTCHA from 'react-google-recaptcha';
import AppContext from '../../Context/AppContext';
import axios from 'axios';

const StudentVerification = () => {
    const ctx = useContext(AppContext);
    const [showModal, setShowModal] = useState(false);
    const captcha = useRef();
    const [btnState, setBtnState] = useState('');
    const [alertModal, setAlertModal] = useState({ show: false });
    const modalHandler = () => setShowModal(!showModal);
    const alertModalHandler = () => setAlertModal({ show: false });

    const resendEmail = async () => {
        setBtnState('btn-loading');
        await axios
            .get(`${ctx.baseURL}/user/getConfirmationToken?token=${captcha.current.getValue()}`, {
                credentials: 'include',
            })
            .then(() => {
                setShowModal(false);

                // To reload the subjects list
                setAlertModal({
                    type: 'success',
                    show: true,
                    text: 'Email sent successfully.',
                });
            })
            .catch((error) => {
                setShowModal(false);

                setAlertModal({
                    type: 'error',
                    show: true,
                    text: ctx.computeError(error),
                });
            });
    };

    return (
        <>
            <div className='alert alert-warning mb-5'>
                <svg width='40' height='35' viewBox='0 0 40 35' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M4.94024 35.0004H35.0602C38.1402 35.0004 40.0602 31.6604 38.5202 29.0004L23.4602 2.98035C21.9202 0.320352 18.0802 0.320352 16.5402 2.98035L1.48024 29.0004C-0.0597576 31.6604 1.86024 35.0004 4.94024 35.0004ZM20.0002 21.0004C18.9002 21.0004 18.0002 20.1004 18.0002 19.0004V15.0004C18.0002 13.9004 18.9002 13.0004 20.0002 13.0004C21.1002 13.0004 22.0002 13.9004 22.0002 15.0004V19.0004C22.0002 20.1004 21.1002 21.0004 20.0002 21.0004ZM22.0002 29.0004H18.0002V25.0004H22.0002V29.0004Z'
                        fill='#F98600'
                    />
                </svg>
                <div className='flex flex-col md:justify-between w-full md:items-center md:flex-row'>
                    <div className='flex flex-col'>
                        <span>Confirm Account</span>
                        <span className='text-content2'>
                            Please confirm your account. If you haven&#39;t received confirmation email, check spam
                            folder.
                        </span>
                    </div>
                    <div>
                        <button onClick={modalHandler} className='btn btn-warning btn-sm'>
                            Resend email
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <ModalWrapper>
                    {btnState === '' && <ModalCloseBtn handler={modalHandler} />}
                    <ModalTitle>Resend email</ModalTitle>
                    <span>Complete the captcha to resend email!</span>
                    <ReCAPTCHA theme={ctx.theme === 'dark' ? 'dark' : 'light'} sitekey={ctx.captchaKey} ref={captcha} />
                    <div className='flex gap-3'>
                        <ModalButton className={`btn-primary ${btnState}`} handler={resendEmail}>
                            Send Email
                        </ModalButton>

                        {btnState === '' && <ModalButton handler={modalHandler}>Cancel</ModalButton>}
                    </div>
                </ModalWrapper>
            )}

            {alertModal.show && (
                <AlertModal text={alertModal.text} type={alertModal.type} handler={alertModalHandler} />
            )}
        </>
    );
};

export default StudentVerification;
