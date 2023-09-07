import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AppContext from '../Context/AppContext';
import Form, {
    FormControl,
    FormField,
    FormGroup,
    FormLabel,
    FormLabelAlt,
    FormSubmitBtn,
    FormTitle,
    FormWrapper,
} from '../Utils/Form';
import Alert from '../Utils/Alert';
import { AlertModal } from '../Utils/Modal';
import { HideIcon, ShowIcon } from '../Utils/Icons';
import { useSearchParams } from 'react-router-dom';
import { SpinnerWithText } from '../Utils/Spinner';

const ResetPassword = () => {
    const ctx = useContext(AppContext);
    const [searchParams] = useSearchParams();
    const [btnState, setBtnState] = useState('');
    const [isLinkValid, setIsLinkValid] = useState();
    const [alert, setAlert] = useState({
        show: false,
    });
    const [alertModal, setAlertModal] = useState({
        show: false,
        text: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/user/checkResetToken/${searchParams.get('token')}`)
            .then(() => {
                setIsLinkValid(true);
            })
            .catch((error) => {
                setIsLinkValid(false);
                setAlert(ctx.errorAlert(error));
            });
    }, []);

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const submitForm = (data) => {
        setAlert({
            show: false,
        });
        setBtnState('btn-loading');
        axios
            .patch(`${ctx.baseURL}/user/resetPassword/${searchParams.get('token')}`, data, {
                credentials: 'include',
            })
            .then(() => {
                setBtnState('');
                setAlertModal({
                    show: true,
                    text: 'Password has been updated! Please login with your new password',
                });
                ctx.logout();
            })
            .catch((error) => {
                setBtnState('');
                setAlert({
                    show: true,
                    type: 'error',
                    title: 'Update failed',
                    text: ctx.computeError(error),
                });
            });
    };

    const successModalHandler = () => {
        window.location.assign('/login');
    };

    return (
        <>
            <FormWrapper>
                {isLinkValid === undefined && <SpinnerWithText>Please wait</SpinnerWithText>}

                {isLinkValid === true && (
                    <Form onSubmit={handleSubmit(submitForm)}>
                        <FormTitle>Reset Password</FormTitle>
                        <FormGroup>
                            <FormField>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className='relative w-full'>
                                        <input
                                            className={`${ctx.inputClasses} ${errors.password && 'input-error'}`}
                                            type={showPassword ? 'text' : 'password'}
                                            {...register('password', {
                                                required: {
                                                    value: true,
                                                    message: 'Password is required',
                                                },
                                                minLength: {
                                                    value: 8,
                                                    message: 'Password should at least be be 8 characters',
                                                },
                                                maxLength: {
                                                    value: 25,
                                                    message: 'Maximum length of password exceeded (25)',
                                                },
                                            })}
                                        />
                                        <button
                                            type='button'
                                            onClick={toggleShowPassword}
                                            className='absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 cursor-pointer'
                                        >
                                            {!showPassword && <ShowIcon />}
                                            {showPassword && <HideIcon />}
                                        </button>
                                    </div>
                                </FormControl>
                                {errors.password && <FormLabelAlt>{errors.password.message}</FormLabelAlt>}
                            </FormField>

                            <FormField>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <div className='relative w-full'>
                                        <input
                                            className={`${ctx.inputClasses} ${errors.passwordConfirm && 'input-error'}`}
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            {...register('passwordConfirm', {
                                                required: {
                                                    value: true,
                                                    message: 'Enter password again',
                                                },
                                                validate: (val) => {
                                                    if (watch('password') !== val) {
                                                        return 'Passwords do no match';
                                                    }
                                                },
                                            })}
                                        />
                                        <button
                                            type='button'
                                            onClick={toggleShowConfirmPassword}
                                            className='absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 cursor-pointer'
                                        >
                                            {!showConfirmPassword && <ShowIcon />}
                                            {showConfirmPassword && <HideIcon />}
                                        </button>
                                    </div>
                                </FormControl>
                                {errors.passwordConfirm && (
                                    <FormLabelAlt>{errors.passwordConfirm.message}</FormLabelAlt>
                                )}
                            </FormField>
                            <FormSubmitBtn className={btnState}>Update</FormSubmitBtn>
                        </FormGroup>
                    </Form>
                )}

                {isLinkValid === false && (
                    <div className='mt-14 text-center text-error'>Token is invalid or expired</div>
                )}
                <Alert alert={alert} closeAlert={() => setAlert({ show: false })} />
            </FormWrapper>
            {alertModal.show && <AlertModal type='success' text={alertModal.text} handler={successModalHandler} />}
        </>
    );
};

export default ResetPassword;
