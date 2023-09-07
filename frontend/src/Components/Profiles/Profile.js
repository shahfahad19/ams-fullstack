import React, { useContext } from 'react';
import AppContext from '../Context/AppContext';
import { FormWrapper } from '../Utils/Form';
import { SpinnerWithText } from '../Utils/Spinner';

const Profile = () => {
    const ctx = useContext(AppContext);
    return (
        <>
            {ctx.userData.name && (
                <FormWrapper>
                    <table className='table font-medium'>
                        <tbody>
                            <tr>
                                <td>Name</td>
                                <td>{ctx.userData.name}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{ctx.userData.email}</td>
                            </tr>
                            <tr>
                                <td>Photo</td>
                                <td>
                                    <div className='popover popover-hover'>
                                        <img
                                            className='w-10 popover-trigger rounded-full'
                                            src={ctx.userData.photo}
                                            alt='profile_pic'
                                        />
                                        <div className='popover-content sm:popover-right'>
                                            <div className='popover-arrow'></div>
                                            <img src={ctx.userData.photo} alt='profile_pic' />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            {ctx.userData.role === 'admin' && (
                                <tr>
                                    <td>Department</td>
                                    <td>{ctx.userData.department}</td>
                                </tr>
                            )}
                            {ctx.userData.role === 'teacher' && (
                                <>
                                    <tr>
                                        <td>Designation</td>
                                        <td>{ctx.userData.designation}</td>
                                    </tr>
                                    <tr>
                                        <td>Gender</td>
                                        <td>
                                            {ctx.userData.gender[0].toUpperCase()}
                                            {ctx.userData.gender.slice(1)}
                                        </td>
                                    </tr>
                                </>
                            )}
                            {ctx.userData.role === 'student' && (
                                <>
                                    <tr>
                                        <td>Roll No.</td>
                                        <td>{ctx.userData.rollNo}</td>
                                    </tr>
                                    <tr>
                                        <td>Registration no.</td>
                                        <td>{ctx.userData.registrationNo}</td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </FormWrapper>
            )}

            {!ctx.userData.name && <SpinnerWithText>Fetching info...</SpinnerWithText>}
        </>
    );
};

export default Profile;
