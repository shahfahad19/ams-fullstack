import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';
import { CheckIcon, CrossIcon } from '../../Utils/Icons';

const BatchList = () => {
    const params = useParams();
    const [batches, setBatches] = useState([]);
    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const ctx = useContext(AppContext);

    useEffect(() => {
        let url = `${ctx.baseURL}/batches`;
        if (params.departmentId != undefined && ctx.userData.role === 'super-admin') {
            url = `${ctx.baseURL}/batches?dept=${params.departmentId}`;
        }
        axios
            .get(url, {
                credentials: 'include',
            })
            .then((response) => {
                setErrorMessage('');
                isLoading(false);
                setBatches(response.data.data.batches);
                if (response.data.data.batches.length === 0) {
                    setErrorMessage('No batches found');
                }
            })
            .catch((error) => {
                if (error.response) setErrorMessage(error.response.data.message);
                else setErrorMessage(error.message);
                isLoading(false);
            });
    }, []);

    const viewBatch = (batchId) => {
        ctx.navigate(`/${ctx.userData.role}/batch/${batchId}/semesters`);
    };

    return (
        <div>
            <SubSectionHeader text='Batch List' showBtn={true} btnText='Add Batch' btnLink='../add-batch' />

            <Table loading={loading} error={errorMessage}>
                <thead>
                    <tr>
                        <th></th>
                        <th className='normal-case font-medium text-sm'>Name</th>
                        <th className='normal-case font-medium text-sm'>Active</th>
                    </tr>
                </thead>
                <tbody>
                    {batches.length > 0 &&
                        batches.map((batch, index) => {
                            return (
                                <tr key={index} onClick={() => viewBatch(batch._id)} className='cursor-pointer'>
                                    <th>{index + 1}</th>
                                    <td>Batch {batch.name}</td>
                                    <td>
                                        {!batch.archived && <CheckIcon />}
                                        {batch.archived && <CrossIcon />}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
};

export default BatchList;
