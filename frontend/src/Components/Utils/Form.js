import React from 'react';

export const FormGroup = (props) => {
    return <div className='form-group'>{props.children}</div>;
};

export const FormField = (props) => {
    return <div className='form-field'>{props.children}</div>;
};

export const FormLabel = (props) => {
    return <label className='form-label'>{props.children}</label>;
};

export const FormLabelAlt = (props) => {
    return (
        <label className='form-label'>
            <span className={`form-label-alt ${props.className ? props.className : 'text-error'}`}>
                {props.children}
            </span>
        </label>
    );
};

export const FormControl = (props) => {
    return <div className='form-control'>{props.children}</div>;
};

export const FormSubmitBtn = (props) => {
    return (
        <div className='form-field pt-3'>
            <div className='form-control'>
                <button type='submit' className={'btn btn-primary btn-block ' + props.className}>
                    {props.children}
                </button>
            </div>
        </div>
    );
};

export const FormWrapper = (props) => {
    return (
        <div className='mt-4 flex justify-center'>
            <div className='rounded shadow-md bg-backgroundSecondary p-3 w-11/12 md:w-8/12 lg:w-1/2'>
                {props.children}
            </div>
        </div>
    );
};

export const FormTitle = (props) => {
    return (
        <div className='flex flex-col items-center mb-3'>
            <h1 className='text-xl md:text-2xl font-semibold'>{props.children}</h1>
        </div>
    );
};

export const Form = (props) => {
    return (
        <form className='font-medium w-full' onSubmit={props.onSubmit}>
            {props.children}
        </form>
    );
};

export default Form;
