import axios from 'axios';
import React, { useContext, useState } from 'react';
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
import { SpinnerWithText } from '../Utils/Spinner';

const EditProfile = () => {
    const ctx = useContext(AppContext);
    const [btnState, setBtnState] = useState('');
    const [removeBtnState, setRemoveBtnState] = useState('');

    const [alert, setAlert] = useState({
        show: false,
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        setBtnState('btn-loading');
        axios
            .patch(`${ctx.baseURL}/user/updateProfile`, data, {
                credentials: 'include',
            })
            .then((response) => {
                setBtnState('');
                setAlert({
                    show: true,
                    type: 'success',
                    text: 'Profile updated successfully!',
                });
                ctx.setUserData(response.data.data.user);
            })
            .catch((error) => {
                setBtnState('');
                setAlert({
                    show: true,
                    type: 'error',
                    text: ctx.computeError(error),
                });
            });
    };

    const removeEmail = () => {
        setRemoveBtnState('btn-loading');
        axios
            .get(`${ctx.baseURL}/user/removeEmail/fromProfile`, {
                credentials: 'include',
            })
            .then(() => {
                setRemoveBtnState('');

                setAlert({
                    show: true,
                    type: 'success',
                    text: 'Email removed successfully',
                });
            })
            .catch((error) => {
                setRemoveBtnState('');

                setAlert({
                    show: true,
                    type: 'error',
                    text: ctx.computeError(error),
                });
            });
    };

    return (
        <>
            {ctx.userData.name && (
                <FormWrapper>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <FormTitle>Update Profile</FormTitle>
                        <FormGroup>
                            <FormField>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <input
                                        className={`${ctx.inputClasses} ${errors.name && 'input-error'}`}
                                        type='text'
                                        defaultValue={ctx.userData.name}
                                        placeholder='Full Name'
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <input
                                        className={`${ctx.inputClasses} ${errors.email && 'input-error'}`}
                                        type='email'
                                        defaultValue={ctx.userData.email}
                                        placeholder='name@example.com'
                                        {...register('email', {
                                            required: {
                                                value: true,
                                                message: 'Please enter your email',
                                            },
                                            pattern: {
                                                value: /^[\S-]+@([\S-]+\.)+\S{2,4}$/g,
                                                message: 'Email is not valid',
                                            },
                                        })}
                                    />
                                </FormControl>
                                {errors.email && <FormLabelAlt>{errors.email.message}</FormLabelAlt>}
                            </FormField>
                        </FormGroup>

                        <FormSubmitBtn className={btnState}>Update</FormSubmitBtn>
                    </Form>
                    <Alert alert={alert} closeAlert={() => setAlert({ show: false })} />

                    {ctx.userData.newEmail && (
                        <div className='alert rounded-xl p-4 mt-4'>
                            <div className='flex flex-col w-full'>
                                <div>Pending Email</div>
                                <div className='text-sm flex justify-between items-center'>
                                    <p>{ctx.userData.newEmail}</p>
                                    <button
                                        onClick={removeEmail}
                                        className={`btn btn-sm btn-solid-error ${removeBtnState}`}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </FormWrapper>
            )}

            {!ctx.userData.name && <SpinnerWithText>Fetching details...</SpinnerWithText>}
        </>
    );
};

export default EditProfile;
