import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AppContext = React.createContext({
    header: '',
    isLoggedIn: false,
    loggedInAs: '',
    userData: {},
    theme: '',
    baseURL: '',
    captchaKey: '',
    inputClasses: '',
    btnClasses: '',
    selectClasses: '',
    logout: () => {},
    login: () => {},
    changeTheme: () => {},
    navigate: () => {},
    computeError: () => {},
    successAlert: () => {},
    errorAlert: () => {},
    setUserData: () => {},
});

export const AppContextProvider = (props) => {
    const [isLoggedIn, setLoggedIn] = useState('wait');
    const [loggedInAs, setLoggedInAs] = useState();
    const navigate = useNavigate();

    const [theme, setTheme] = useState('light');

    const [userData, setUserData] = useState({
        confirmed: true,
        photo: 'https://res.cloudinary.com/dbph73rvi/image/upload/v1675170781/mdqcinla4xkogsatvbr3.jpg',
    });

    useEffect(() => {
        // Getting theme
        let savedTheme = '';
        try {
            savedTheme = localStorage.getItem('theme') !== null ? localStorage.getItem('theme') : 'light';
        } catch (err) {
            savedTheme = 'light';
        }

        // Setting theme
        document.body.setAttribute('data-theme', savedTheme);
        setTheme(savedTheme);

        axios
            .get('/api/user', {
                credentials: 'include',
            })
            .then((response) => {
                setLoggedInAs(response.data.data.user.role);
                setUserData(response.data.data.user);
                setLoggedIn(true);
            })
            .catch(() => {
                setLoggedIn(false);
            });
    }, []);

    const loginHandler = () => {
        setLoggedIn('wait');

        axios
            .get(`/api/user`, {
                credentials: 'include',
            })
            .then(() => {})
            .catch(() => {
                setLoggedIn(false);
                setLoggedInAs('none');
            });
    };

    const logoutHandler = () => {
        setLoggedIn(false);
        setLoggedInAs('');
        setUserData({});
        axios
            .get(`/api/user/logout`, {
                credentials: 'include',
            })
            .then(() => {})
            .catch(() => {});
    };

    const computeError = (error) => {
        let errorMessage = error.message;
        if (error.response) errorMessage = error.response.data.message;
        return errorMessage;
    };

    const successAlert = (text) => {
        return {
            show: true,
            type: 'success',
            text: text,
        };
    };

    const errorAlert = (text) => {
        return {
            show: true,
            type: 'error',
            text: text,
        };
    };

    const changeTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.body.setAttribute('data-theme', newTheme);
        try {
            localStorage.setItem('theme', newTheme);
        } catch {
            /* empty */
        }
    };

    return (
        <AppContext.Provider
            value={{
                isLoggedIn: isLoggedIn,
                loggedInAs: loggedInAs,
                userData: userData,
                login: loginHandler,
                logout: logoutHandler,
                theme: theme,
                baseURL: '/api',
                captchaKey: '6Lc3CBYkAAAAAJU9k9WPIqo5l9lWT4K4J8jhjFip',
                setUserData,
                btnClasses: 'btn btn-primary btn-block',
                inputClasses: 'input w-full input-block input-lg',
                selectClasses: 'select select-block select-lg',
                navigate: navigate,
                computeError: computeError,
                successAlert: successAlert,
                errorAlert: errorAlert,
                changeTheme: changeTheme,
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};
export default AppContext;
