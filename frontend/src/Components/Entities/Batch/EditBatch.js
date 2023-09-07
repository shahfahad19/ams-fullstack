import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import DeleteBatchBtn from './DeleteBatchBtn';
import Spinner from '../../Utils/Spinner';
import {
    FormControl,
    Form,
    FormField,
    FormGroup,
    FormLabel,
    FormLabelAlt,
    FormTitle,
    FormWrapper,
    FormSubmitBtn,
} from '../../Utils/Form';
import Alert from '../../Utils/Alert';

const EditBatch = () => {
    const [batchData, setBatchData] = useOutletContext();
    const [submitBtnState, setSubmitBtnState] = useState();
    const [regenerateBtnState, setRegenerateBtnState] = useState();
    const [batchErrorMsg, setBatchErrorMsg] = useState('');

    const params = useParams();
    const batchName = useRef();
    const archived = useRef();
    const [alert, setAlert] = useState({ show: false });

    const ctx = useContext(AppContext);

    const batchNameHandler = () => {
        let batch = batchName.current.value;
        if (batch === '') {
            setBatchErrorMsg('Batch no. required');
        } else if (batch < 0 || batch > 999) {
            setBatchErrorMsg('Batch name is invalid');
        } else {
            setBatchErrorMsg('');
        }
    };

    const submitForm = async (event) => {
        event.preventDefault();
        let batch = batchName.current.value;
        if (batch === '') {
            setBatchErrorMsg('Batch no. required');
            return;
        } else if (batch < 0 || batch > 999) {
            setBatchErrorMsg('Batch name is invalid');
            return;
        } else {
            setBatchErrorMsg('');
        }
        setAlert({ show: false });
        setSubmitBtnState('btn-loading');
        const batchData = {
            name: batchName.current.value,
            archived: archived.current.value === 'True',
        };
        await axios
            .patch(`${ctx.baseURL}/batches/${params.batchId}`, batchData, {
                credentials: 'include',
            })
            .then((response) => {
                setBatchData(response.data.data.batch);
                setAlert({
                    show: true,
                    type: 'success',
                    text: 'Batch updated successfully',
                });
            })
            .catch((error) => {
                let errorMessage = error.message;
                if (error.response) errorMessage = error.response.data.message;
                setAlert({
                    show: true,
                    type: 'error',
                    text: errorMessage,
                });
            });
        setSubmitBtnState('');
    };

    const generateCode = async () => {
        setRegenerateBtnState('btn-loading');
        setAlert({ show: false });
        await axios
            .get(`${ctx.baseURL}/batches/${params.batchId}/updatecode`, {
                credentials: 'include',
            })
            .then((response) => {
                setAlert({
                    show: true,
                    type: 'success',
                    text: 'Batch code updated',
                });
                setBatchData({ ...batchData, batchCode: response.data.data.batch.batchCode });
            })
            .catch((error) => {
                let errorMessage = error.message;
                if (error.response) errorMessage = error.response.data.message;

                setAlert({
                    show: true,
                    type: 'error',
                    text: errorMessage,
                });
            });
        setRegenerateBtnState('');
    };

    return (
        <>
            {batchData && (
                <FormWrapper>
                    <Form onSubmit={submitForm}>
                        <FormTitle>Edit Batch</FormTitle>
                        <FormGroup>
                            <FormField>
                                <FormLabel>Batch Name</FormLabel>
                                <FormGroup>
                                    <input
                                        className={`${ctx.inputClasses} ${batchErrorMsg === '' ? '' : 'input-error'}`}
                                        defaultValue={batchData.name}
                                        ref={batchName}
                                        type='number'
                                        onChange={batchNameHandler}
                                        placeholder='Enter batch no.'
                                        min='1'
                                    />
                                </FormGroup>
                                {batchErrorMsg !== '' && <FormLabelAlt>{batchErrorMsg}</FormLabelAlt>}
                            </FormField>

                            <FormField>
                                <FormLabel>Batch Code</FormLabel>
                                <FormControl>
                                    <div className='bg-backgroundPrimary border-2 dark:border-gray-6 w-full rounded-xl flex justify-between items-center'>
                                        <p className='text-primary pl-4'>{batchData.batchCode || '...'}</p>
                                        <p onClick={generateCode} className={`btn btn-secondary ${regenerateBtnState}`}>
                                            Regenerate
                                        </p>
                                    </div>
                                </FormControl>
                            </FormField>

                            <FormField>
                                <FormLabel>Archived</FormLabel>
                                <FormControl>
                                    <select
                                        className={ctx.selectClasses}
                                        defaultValue={batchData.archived ? 'True' : 'False'}
                                        ref={archived}
                                        required
                                    >
                                        <option>True</option>
                                        <option>False</option>
                                    </select>
                                </FormControl>
                            </FormField>

                            <FormSubmitBtn className={submitBtnState}>Update</FormSubmitBtn>
                        </FormGroup>
                    </Form>
                    <DeleteBatchBtn ctx={ctx} params={params} batchData={batchData} />
                    <Alert alert={alert} closeAlert={() => setAlert({ show: false })} />
                </FormWrapper>
            )}
            {!batchData && (
                <div className='flex justify-center items-center h-52'>
                    <Spinner className='spinner-sm' /> <span className='ml-2'>Fetching batch info</span>
                </div>
            )}
            <div className='h-14'></div>
        </>
    );
};

export default EditBatch;
