import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../../Context/AppContext';
import axios from 'axios';
import SubSectionHeader from '../../../Utils/SubSectionHeader';
import Spinner, { SpinnerWithText } from '../../../Utils/Spinner';
import { AlertModal, ModalTitle, ModalWrapper } from '../../../Utils/Modal';
import AttendanceSavedText from './AttendanceSavedText';
import StudentAttendanceControl from './StudentAttendanceControl';
import SavedAttendanceTable from './SavedAttendanceTable';

const TakeAttendance = () => {
    const params = useParams();
    const ctx = useContext(AppContext);

    const [subject, setSubject] = useState({});
    const [students, setStudents] = useState([]);
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const [attendanceList, setAttendanceList] = useState([]);
    const [isAttendanceComplete, setAttendanceComplete] = useState(false);
    const [editingEnabled, enableEditing] = useState(false);
    const [attendanceSaved, saveAttendance] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [keyboardAvailable, setKeyboardAvailable] = useState(false);

    const [alertModal, setAlertModal] = useState({ show: false });
    const [loadingModal, setLoadingModal] = useState({ show: false });

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/subjects/${params.subjectId}`, {
                credentials: 'include',
            })
            .then((subjectRes) => {
                setSubject(subjectRes.data.data.subject);
                axios
                    .get(
                        `${ctx.baseURL}/users/students?batch=${subjectRes.data.data.subject.semester.batch.id}&sort=rollNo&confirmed=true`,
                        {
                            credentials: 'include',
                        }
                    )
                    .then((studentsRes) => {
                        if (studentsRes.data.data.students.length === 0) {
                            setErrorMessage('No student have signed up for this batch yet');
                            return;
                        }
                        setKeyboardAvailable(isKeyboardAvailable);
                        setStudents(studentsRes.data.data.students);
                        setAttendanceList(
                            studentsRes.data.data.students.map((student) => ({
                                student: student._id,
                                status: '',
                            }))
                        );
                    })
                    .catch((error) => {
                        setErrorMessage(ctx.computeError(error));
                    });
            })
            .catch((error) => {
                setErrorMessage(ctx.computeError(error));
            });
    }, []);

    const handleAttendance = (studentId, status) => {
        const updatedAttendance = [...attendanceList];
        const existingAttendance = updatedAttendance.find((attendance) => attendance.student === studentId);
        if (existingAttendance) {
            existingAttendance.status = status;
        }
        setAttendanceList(updatedAttendance);

        if (currentStudentIndex === students.length - 1) {
            setAttendanceComplete(true);
        } else {
            setCurrentStudentIndex(currentStudentIndex + 1);
        }
    };

    const changeAttendance = (event, index) => {
        attendanceList[index].status = event.target.value;
    };

    const submitAttendance = async () => {
        const attendanceData = {
            subject: subject._id,
            attendance: attendanceList,
        };

        setLoadingModal({
            show: true,
            text: 'Saving attendance',
        });

        axios
            .post(`${ctx.baseURL}/attendances`, attendanceData, {
                credentials: 'include',
            })
            .then(() => {
                saveAttendance(true);
                setLoadingModal({ show: false });
            })
            .catch((error) => {
                setLoadingModal({ show: false });
                setAlertModal({ show: true, type: 'error', text: ctx.computeError(error) });
            });
    };

    const alertModalHandler = () => {
        setAlertModal({
            show: false,
        });
    };

    function isKeyboardAvailable() {
        if ('keyboard' in navigator) {
            if (!navigator.keyboard.automatic) {
                return true;
            }
        }
        return false;
    }

    const handleKeyPress = (event) => {
        if (event.key === 'P' || event.key === 'p') {
            handleAttendance(students[currentStudentIndex]._id, 'present');
        } else if (event.key === 'A' || event.key === 'a') {
            handleAttendance(students[currentStudentIndex]._id, 'absent');
        } else if (event.key === 'L' || event.key === 'l') {
            handleAttendance(students[currentStudentIndex]._id, 'leave');
        }
    };

    useEffect(() => {
        if (keyboardAvailable) {
            document.addEventListener('keydown', handleKeyPress);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentStudentIndex, students, keyboardAvailable]);

    return (
        <div className='flex-grow relative'>
            <SubSectionHeader text='Take Attendance' />

            {!errorMessage && students.length === 0 && <SpinnerWithText>Loading students...</SpinnerWithText>}

            {!attendanceSaved && !isAttendanceComplete && students.length > 0 && (
                <>
                    <StudentAttendanceControl
                        students={students}
                        currentStudentIndex={currentStudentIndex}
                        handleAttendance={handleAttendance}
                    />

                    {keyboardAvailable && (
                        <div className='text-center mt-10 hidden md:block'>
                            <p className='font-semibold mb-2'>Keyboard shortcuts: </p>
                            <kbd className='kbd kbd-lg'>P</kbd> - Present
                            <kbd className='kbd kbd-lg ml-5'>A</kbd> - Absent
                            <kbd className='kbd kbd-lg ml-5'>L</kbd> - Leave
                        </div>
                    )}
                </>
            )}

            {errorMessage && <div className='text-center mt-16 text-error text-xl'>{errorMessage}</div>}

            {!attendanceSaved && isAttendanceComplete && (
                <>
                    <h4 className='text-lg font-semibold mb-4 text-center p-2'>Attendance Complete</h4>
                    <SavedAttendanceTable
                        students={students}
                        attendanceList={attendanceList}
                        editingEnabled={editingEnabled}
                        changeAttendance={changeAttendance}
                    />

                    <div className='text-center m-5'>
                        {!editingEnabled && (
                            <>
                                <button className='btn m-4 btn-warning' onClick={() => enableEditing(true)}>
                                    Edit Attendance
                                </button>
                                <button className='btn m-4 btn-primary' onClick={submitAttendance}>
                                    Submit Attendance
                                </button>
                            </>
                        )}
                        {editingEnabled && (
                            <button className='btn mx-4 btn-primary' onClick={() => enableEditing(false)}>
                                Save Attendance
                            </button>
                        )}
                    </div>
                    <br />
                </>
            )}

            {attendanceSaved && <AttendanceSavedText />}

            {alertModal.show && (
                <AlertModal type={alertModal.type} text={alertModal.text} handler={alertModalHandler} />
            )}

            {loadingModal.show && (
                <ModalWrapper>
                    <ModalTitle>{loadingModal.text}</ModalTitle>
                    <div className='flex justify-center mb-2'>
                        <Spinner />
                    </div>
                </ModalWrapper>
            )}
            <div className='h-14'></div>
        </div>
    );
};

export default TakeAttendance;
