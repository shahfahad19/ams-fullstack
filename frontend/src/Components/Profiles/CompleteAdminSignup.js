import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import AppContext from '../Context/AppContext';
import axios from 'axios';
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
import { ModalButton, ModalCloseBtn, ModalTitle, ModalWrapper } from '../Utils/Modal';
import Alert from '../Utils/Alert';
import { HideIcon, ShowIcon } from '../Utils/Icons';

const CompleteAdminSignup = () => {
    const ctx = useContext(AppContext);
    const [btnState, setBtnState] = useState('');
    const [showWelcomeModal, setShowWelcomeModal] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const welcomeModalHandler = () => setShowWelcomeModal(false);

    const [alert, setAlert] = useState({ show: false });

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const submitForm = (data) => {
        setBtnState('btn-loading');
        axios
            .post(`${ctx.baseURL}/user/completeProfile`, data, {
                credentials: 'include',
            })
            .then(() => {
                setBtnState('');
                ctx.logout();
                window.location.assign('/login?profileCompleted=true');
            })
            .catch((error) => {
                setBtnState('');
                if (error.response) ctx.showSwal(0, error.response.data.message);
                else ctx.showSwal(0, error.message);
            });
    };

    return (
        <>
            <FormWrapper>
                <Form onSubmit={handleSubmit(submitForm)}>
                    <FormTitle>Update Profile</FormTitle>
                    <FormGroup>
                        <FormField>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <input
                                    className={`${ctx.inputClasses} ${errors.name && 'input-error'}`}
                                    type='text'
                                    placeholder='Full Name'
                                    defaultValue={ctx.userData.name}
                                    {...register('name', {
                                        required: {
                                            value: true,
                                            message: 'Please provide your full name',
                                        },
                                        minLength: {
                                            value: 3,
                                            message: 'Minimum 3 characters required',
                                        },
                                        maxLength: {
                                            value: 20,
                                            message: 'Maximum length is exceeded (20)',
                                        },
                                    })}
                                />
                            </FormControl>
                            {errors.name && <FormLabelAlt>{errors.name.message}</FormLabelAlt>}
                        </FormField>

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
                            {errors.passwordConfirm && <FormLabelAlt>{errors.passwordConfirm.message}</FormLabelAlt>}
                        </FormField>
                        <FormSubmitBtn className={btnState}>Update</FormSubmitBtn>
                    </FormGroup>
                </Form>
                <Alert alert={alert} closeAlert={() => setAlert({ show: false })} />
            </FormWrapper>

            {showWelcomeModal && (
                <ModalWrapper>
                    <ModalCloseBtn handler={welcomeModalHandler} />
                    <ModalTitle>Hello</ModalTitle>
                    <span>Welcome to Attendance Management System</span>
                    <span>To use the website, update your details!</span>
                    <div className='flex justify-center'>
                        <ModalButton className='btn btn-primary' handler={welcomeModalHandler}>
                            OK
                        </ModalButton>
                    </div>
                </ModalWrapper>
            )}
        </>
    );
};

export default CompleteAdminSignup;
