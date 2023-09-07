import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';
import { AlertModal, ModalButton, ModalCloseBtn, ModalTitle, ModalWrapper } from '../../Utils/Modal';
import Spinner from '../../Utils/Spinner';

const EditSubjectTeacher = () => {
    const [teachers, setTeachers] = useState([]);
    const [data, setData] = useState([]);

    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [subject, setSubject] = useOutletContext();
    const params = useParams();
    const department = useRef();
    const [assignLoadingModal, setAssignLoadingModal] = useState(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const [showDeletingModal, setShowDeletingModal] = useState();

    const [alertModal, setAlertModal] = useState({
        show: false,
        text: '',
    });

    const [teacher, setTeacher] = useState({
        show: false,
    });
    const ctx = useContext(AppContext);

    useEffect(() => {
        if (subject.teacher === undefined || subject.teacher === null) {
            axios
                .get(`${ctx.baseURL}/users/teachersByDepartments`, {
                    credentials: 'include',
                })
                .then((response) => {
                    changeTeachers(0);
                    isLoading(false);
                    setData(response.data.data.teachers);
                })
                .catch((error) => {
                    if (error.response) setErrorMessage(error.response.data.message);
                    else setErrorMessage(error.message);
                    isLoading(false);
                })
                .finally(() => {});
        } else {
            setTeacher({
                show: true,
                search: false,
                data: subject.teacher,
            });
        }
    }, [subject]);

    const assignTeacher = async (teacherId) => {
        setAssignLoadingModal(true);
        axios
            .patch(
                `${ctx.baseURL}/subjects/${params.subjectId}`,
                {
                    teacher: teacherId,
                },
                {
                    credentials: 'include',
                }
            )
            .then((response) => {
                setAssignLoadingModal(false);
                setSubject(response.data.data.subject);
                setAlertModal({
                    type: 'success',
                    show: true,
                    text: 'Teacher assigned successfully',
                });
                setTeacher({
                    show: true,
                    search: false,
                    data: response.data.data.subject.teacher,
                });
            })
            .catch((error) => {
                setAssignLoadingModal(false);
                setAlertModal({
                    type: 'error',
                    show: true,
                    text: ctx.computeError(error),
                });
            });
    };

    const removeTeacher = async () => {
        deletionModalHanlder();

        setShowDeletingModal(true);
        axios
            .patch(
                `${ctx.baseURL}/subjects/${params.subjectId}`,
                {
                    teacher: null,
                },
                {
                    credentials: 'include',
                }
            )
            .then((response) => {
                setShowDeletingModal(false);

                setSubject(response.data.data.subject);
                setTeacher({
                    show: false,
                });

                setAlertModal({
                    type: 'success',
                    show: true,
                    text: 'Teacher removed successfully',
                });
            })
            .catch((error) => {
                setShowDeletingModal(false);
                setAlertModal({
                    type: 'error',
                    show: true,
                    text: ctx.computeError(error),
                });
            });
    };

    const changeTeachers = (event) => {
        setErrorMessage('');

        let dataIndex = '';
        try {
            dataIndex = event.target.value;
        } catch (error) {
            dataIndex = '';
        }
        if (dataIndex === '') {
            setTeachers([]);
            setErrorMessage('Select a department to view its teachers');
            return;
        }
        setTeachers(data[dataIndex].teachers);
    };

    const deletionModalHanlder = () => {
        setShowDeleteConfirmationModal(!showDeleteConfirmationModal);
    };

    const alertModalHandler = () => {
        setAlertModal({ show: false });
    };

    return (
        <>
            <SubSectionHeader text='Teacher' />
            {!subject.name && (
                <div className='mt-12 flex items-center justify-center space-x-4'>
                    <Spinner className='spinner-sm' /> <span>Getting subject info</span>
                </div>
            )}
            {subject.name && subject.teacher == (undefined || null) && (
                <div className='p-2'>
                    <div className='p-2 font-semibold text-center text-xl'>Assign a teacher from the list</div>
                    <select ref={department} className={ctx.selectClasses + ' mb-2'} onChange={changeTeachers}>
                        <option value=''>Select department</option>
                        {data.map((teacher, index) => {
                            return (
                                <option value={index} key={index}>
                                    {teacher.departmentName}
                                </option>
                            );
                        })}
                    </select>

                    <Table loading={loading} error={errorMessage} className='table-compact'>
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th className='normal-case font-medium text-sm'>Name</th>
                                <th className='normal-case font-medium text-sm'>Gender</th>
                                <th className='normal-case font-medium text-sm'>Designation</th>
                                <th className='normal-case font-medium text-sm'>Assign</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.length > 0 &&
                                teachers.map((teacher, index) => {
                                    return (
                                        <tr key={index} className=''>
                                            <th>{index + 1}</th>
                                            <td>
                                                <label tabIndex={0} className='rounded-full avatar'>
                                                    <div className='w-10 rounded-full'>
                                                        <img src={teacher.photo} alt='profile_pic' />
                                                    </div>
                                                </label>
                                            </td>
                                            <td>{teacher.name}</td>
                                            <td>{teacher.gender}</td>
                                            <td>{teacher.designation}</td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        assignTeacher(teacher._id);
                                                    }}
                                                    className='btn btn-sm btn-secondary rounded-full'
                                                >
                                                    Assign
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </Table>
                </div>
            )}
            {teacher.show && (
                <div className='flex justify-center'>
                    <div className='rounded p-3 w-11/12 md:w-8/12 lg:w-3/5 border border-base'>
                        <table className='table font-medium'>
                            <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td>{teacher.data.name}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>{teacher.data.email}</td>
                                </tr>
                                <tr>
                                    <td>Photo</td>
                                    <td>
                                        <div className='popover popover-hover'>
                                            <img
                                                className='w-10 popover-trigger rounded-full'
                                                src={teacher.data.photo}
                                                alt='profile_pic'
                                            />
                                            <div className='popover-content sm:popover-right'>
                                                <div className='popover-arrow'></div>
                                                <img src={teacher.data.photo} alt='profile_pic' />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Department</td>
                                    <td> {teacher.data.departmentId.department}</td>
                                </tr>
                                <tr>
                                    <td>Designation</td>
                                    <td>{teacher.data.designation}</td>
                                </tr>
                            </tbody>
                        </table>
                        <button onClick={deletionModalHanlder} className={`mt-3 ${ctx.btnClasses}`}>
                            Remove
                        </button>
                    </div>
                </div>
            )}

            {assignLoadingModal && (
                <ModalWrapper>
                    <ModalTitle>Assigning subject</ModalTitle>
                    <div className='flex justify-center mb-2'>
                        <Spinner />
                    </div>
                </ModalWrapper>
            )}

            {showDeleteConfirmationModal && (
                <ModalWrapper>
                    <ModalCloseBtn handler={deletionModalHanlder} />
                    <ModalTitle>Are you sure?</ModalTitle>
                    <span>This subject will be removed from teacher&#39;s list</span>
                    <div className='flex gap-3'>
                        <ModalButton className='btn-error' handler={removeTeacher}>
                            Remove
                        </ModalButton>

                        <ModalButton handler={deletionModalHanlder}>Cancel</ModalButton>
                    </div>
                </ModalWrapper>
            )}

            {showDeletingModal && (
                <ModalWrapper>
                    <ModalTitle>Removing Teacher</ModalTitle>
                    <div className='flex justify-center mb-2'>
                        <Spinner />
                    </div>
                </ModalWrapper>
            )}

            {alertModal.show && (
                <AlertModal type={alertModal.type} text={alertModal.text} handler={alertModalHandler} />
            )}

            <div className='h-14'></div>
        </>
    );
};

export default EditSubjectTeacher;
