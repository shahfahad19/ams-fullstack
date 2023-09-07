import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from './Context/AppContext';

const Welcome = () => {
    const ctx = useContext(AppContext);
    return (
        <div className='w-full mt-32 flex flex-col items-center justify-center'>
            <div className='text-3xl font-medium text-primary align-middle text-center px-2 sm:text-4xl md:text-5xl'>
                Attendance Management System
            </div>
            <div className='text-md font-regular text-center my-3 px-2 md:text-2xl'>
                {!ctx.isLoggedIn && (
                    <>
                        <br />
                        Create an account or Login to continue!
                    </>
                )}
            </div>
            <div className='p-3 flex flex-col justify-center items-center md:flex-row'>
                {ctx.isLoggedIn === 'wait' && (
                    <div className='flex items-center flex-col'>
                        <p className='text-lg font-medium text-neutral text-center p-3'>Please wait</p>
                        <svg className='spinner-ring' viewBox='25 25 50 50' strokeWidth='5'>
                            <circle cx='50' cy='50' r='20' />
                        </svg>
                    </div>
                )}
                {!ctx.isLoggedIn && (
                    <>
                        <Link className='btn btn-primary rounded-full m-2 w-32 md:w-48' to='/login'>
                            Login
                        </Link>
                        <Link className='btn btn-primary rounded-full m-2 w-32 md:w-48' to='/signup'>
                            Sign Up
                        </Link>
                    </>
                )}
                {ctx.isLoggedIn === true && (
                    <>
                        <Link className='btn btn-primary rounded-full m-2 w-52' to={'/' + ctx.loggedInAs}>
                            Go to Dashboard
                        </Link>
                        <br />
                        <Link
                            className='btn btn-error rounded-full m-2 '
                            onClick={() => {
                                ctx.logout();
                            }}
                        >
                            Logout
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Welcome;
