import React, { useContext, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import axios from 'axios';
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
import { HideIcon, ShowIcon } from '../Utils/Icons';

const SignUp = () => {
  const ctx = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  let code = searchParams.get('code');
  if (code === null || code === undefined) code = '';
  else {
    if (code.length !== 4) code = '';
    else code = code.toUpperCase();
  }
  // REDIRECTING IF USER IS ALREADY LOGGED IN
  if (ctx.isLoggedIn === true) {
    ctx.navigate('/');
  }

  const [btnState, setBtnState] = useState('');
  const [alert, setAlert] = useState({ show: false });
  const captcha = useRef();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const submitForm = (data) => {
    data.role = 'student';
    setBtnState('btn-loading');
    setAlert({ show: false });
    axios
      .post(`${ctx.baseURL}/user/signup?token=${captcha.current.getValue()}`, data)
      .then((response) => {
        setBtnState('');
        data = response.data;

        const signedup = saveToken(`${data.token}`);
        if (signedup) {
          window.location.assign('/');
        }
      })
      .catch((error) => {
        setBtnState('');
        let errorMessage = ctx.computeError(error);
        setAlert(ctx.errorAlert(errorMessage));
        window.grecaptcha.reset();
      });
  };

  const saveToken = (token) => {
    if (token !== '') {
      try {
        localStorage.setItem('ams-token', token);
        return true;
      } catch (err) {
        localStorage.setItem('ams-token', '');
        return false;
      }
    } else {
      return false;
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <FormWrapper>
      <Form onSubmit={handleSubmit(submitForm)}>
        <FormTitle>Sign Up</FormTitle>
        <FormGroup>
          <FormField>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <input
                className={`${ctx.inputClasses} ${errors.name && 'input-error'}`}
                type="text"
                placeholder="Full Name"
                {...register('name', {
                  required: {
                    value: true,
                    message: 'Please provide your full name'
                  },
                  minLength: {
                    value: 3,
                    message: 'Minimum 3 characters required'
                  },
                  maxLength: {
                    value: 35,
                    message: 'Maximum length is exceeded (35)'
                  }
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
            <FormLabel>Registration No.</FormLabel>
            <FormControl>
              <input
                className={`${ctx.inputClasses} ${errors.registrationNo && 'input-error'}`}
                type="text"
                placeholder="University Registration No."
                {...register('registrationNo', {
                  required: {
                    value: true,
                    message: 'Please enter your registration no.'
                  },
                  pattern: {
                    value: /^\d{2}-\d{5}-\d{5}$/,
                    message: 'Invalid registration no. Format is 12-12345-12345'
                  }
                })}
              />
            </FormControl>
            {errors.registrationNo && <FormLabelAlt>{errors.registrationNo.message}</FormLabelAlt>}
          </FormField>
          <FormField>
            <FormLabel>Roll No</FormLabel>
            <FormControl>
              <input
                className={`${ctx.inputClasses} ${errors.rollNo && 'input-error'}`}
                type="number"
                placeholder="Class Roll No."
                {...register('rollNo', {
                  required: {
                    value: true,
                    message: 'Please enter your roll no.'
                  },
                  maxLength: {
                    value: 3,
                    message: 'Maximum length is exceeded (3)'
                  }
                })}
              />
            </FormControl>
            {errors.rollNo && <FormLabelAlt>{errors.rollNo.message}</FormLabelAlt>}
          </FormField>
          <FormField>
            <FormLabel>Batch Code</FormLabel>
            <FormControl>
              <input
                className={`${ctx.inputClasses} ${errors.batchCode && 'input-error'}`}
                type="text"
                placeholder="Enter Batch Code provided by department"
                defaultValue={code}
                {...register('batchCode', {
                  required: {
                    value: true,
                    message: 'Batch code is required'
                  },
                  minLength: {
                    value: 4,
                    message: 'Batch code should be 4 characters'
                  },
                  maxLength: {
                    value: 15,
                    message: 'Batch code should be 4 characters'
                  }
                  // pattern: {
                  //   value: /[0-9A-Fa-f]{4}/g,
                  //   message: 'Batch code is invalid'
                  // }
                })}
              />
            </FormControl>
            {errors.batchCode && <FormLabelAlt>{errors.batchCode.message}</FormLabelAlt>}
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
                    },
                    minLength: {
                      value: 8,
                      message: 'Password should at least be be 8 characters'
                    },
                    maxLength: {
                      value: 25,
                      message: 'Maximum length of password exceeded (25)'
                    }
                  })}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 cursor-pointer">
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
              <div className="relative w-full">
                <input
                  className={`${ctx.inputClasses} ${errors.passwordConfirm && 'input-error'}`}
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('passwordConfirm', {
                    required: {
                      value: true,
                      message: 'Enter password again'
                    },
                    validate: (val) => {
                      if (watch('password') !== val) {
                        return 'Passwords do no match';
                      }
                    }
                  })}
                />
                <button
                  type="button"
                  onClick={toggleShowConfirmPassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 cursor-pointer">
                  {!showConfirmPassword && <ShowIcon />}
                  {showConfirmPassword && <HideIcon />}
                </button>
              </div>
            </FormControl>
            {errors.passwordConfirm && (
              <FormLabelAlt>{errors.passwordConfirm.message}</FormLabelAlt>
            )}
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

          <FormSubmitBtn className={btnState}>Create Account</FormSubmitBtn>
        </FormGroup>
      </Form>
      <Alert alert={alert} closeAlert={() => setAlert({ show: false })} />

      <div className="p-3 text-center font-regular">
        Already have an account?&nbsp;
        <Link className="link link-primary" to="/login">
          Login!
        </Link>
      </div>
      <div className="h-14"></div>
    </FormWrapper>
  );
};

export default SignUp;
