import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link, useSearchParams } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import { useForm } from 'react-hook-form';
import Form, {
  FormControl,
  FormField,
  FormGroup,
  FormLabel,
  FormLabelAlt,
  FormSubmitBtn,
  FormTitle,
  FormWrapper
} from '../Utils/Form';
import Alert from '../Utils/Alert';
import { AlertModal } from '../Utils/Modal';

const Login = () => {
  const [btnState, setBtnState] = useState('');
  const [alert, setAlert] = useState({ show: false });

  const [showAlert, setShowAlert] = useState(false);

  const ctx = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  // REDIRECTING IF USER IS ALREADY LOGGED IN
  if (ctx.isLoggedIn === true) {
    ctx.navigate('/');
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const captcha = useRef();

  useEffect(() => {
    if (searchParams.get('profileCompleted') === 'true') setShowAlert(true);
  }, []);

  const submitForm = async (data) => {
    setBtnState('btn-loading');
    setAlert({ show: false });
    await axios
      .post(`${ctx.baseURL}/user/login?token=${captcha.current.getValue()}`, data, {
        credentials: 'include'
      })
      .then((response) => {
        setBtnState('');
        data = response.data;
        saveToken(`${data.token}`);
        window.location.assign('/');
      })
      .catch((error) => {
        setBtnState('');
        window.grecaptcha.reset();
        let errorMessage = ctx.computeError(error);
        setAlert(ctx.errorAlert(errorMessage));
      });
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const saveToken = (token) => {
    if (token !== '') {
      try {
        localStorage.setItem('ams-token', token);
        return true;
      } catch (err) {
        return false;
      }
    } else {
      return false;
    }
  };

  return (
    <>
      <FormWrapper>
        <Form onSubmit={handleSubmit(submitForm)}>
          <FormTitle>Login</FormTitle>

          <FormGroup>
            <FormField>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <input
                  className={`${ctx.inputClasses} ${errors.email && 'input-error'}`}
                  type="email"
                  placeholder="name@example.com"
                  {...register('email', {
                    required: {
                      value: true,
                      message: 'Please enter your email'
                    },
                    pattern: {
                      value: /^[\S-]+@([\S-]+\.)+\S{2,4}$/g,
                      message: 'Email is not valid'
                    }
                  })}
                />
              </FormControl>
              {errors.email && <FormLabelAlt>{errors.email.message}</FormLabelAlt>}
            </FormField>

            <FormField>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative w-full">
                  <input
                    className={`${ctx.inputClasses} ${errors.password && 'input-error'}`}
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: {
                        value: true,
                        message: 'Password is required'
                      }
                    })}
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 cursor-pointer">
                    {!showPassword && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                    {showPassword && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </FormControl>
              {errors.password && <FormLabelAlt>{errors.password.message}</FormLabelAlt>}
            </FormField>

            <FormField>
              <FormLabel>Captcha</FormLabel>
              <FormControl>
                <ReCAPTCHA
                  theme={ctx.theme === 'dark' ? 'dark' : 'light'}
                  sitekey={ctx.captchaKey}
                  required
                  ref={captcha}
                />
              </FormControl>
              <FormLabelAlt></FormLabelAlt>
            </FormField>

            <FormSubmitBtn className={btnState}>Login</FormSubmitBtn>
          </FormGroup>
        </Form>
        <Alert alert={alert} closeAlert={() => setAlert({ show: false })} />

        <div className="m-2 text-center font-regular">
          <span>Don&#39;t have an account?</span>&nbsp;
          <Link className="link link-primary decoration-transparent font-medium" to="/signup">
            Signup!
          </Link>
          <br />
          <Link
            className="link link-error decoration-transparent font-medium"
            to="/forgot-password">
            Forgot Password
          </Link>
        </div>
      </FormWrapper>
      {showAlert && (
        <AlertModal
          type="success"
          text="Profile updated! Please login with your new password"
          handler={() => setShowAlert(false)}
        />
      )}
    </>
  );
};

export default Login;
