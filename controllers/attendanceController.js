const Attendance = require('./../models/attendanceModel');
const Subject = require('./../models/subjectModel');
const APIFeatures = require('./../utils/apiFeatures');

const mongoose = require('mongoose');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// Get Attendance of a date
exports.getAttendance = catchAsync(async (req, res) => {
    const attendance = await Attendance.findById(req.params.id)
        .populate({
            path: 'subject',
            populate: {
                path: 'teacher',
            },
        })
        .populate({
            path: 'subject',
            populate: {
                path: 'semester',
                populate: {
                    path: 'batch',
                    populate: 'admin',
                },
            },
        })
        .populate({
            path: 'marked_by',
        })
        .populate({
            path: 'attendances',
            populate: {
                path: 'student',
            },
        });

    res.status(200).json({
        status: 'success',
        data: {
            attendance,
        },
    });
});

// Delete attendance

exports.deleteAttendance = catchAsync(async (req, res) => {
    await Attendance.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

// Get Attendance of a subject

exports.getSubjectAttendance = catchAsync(async (req, res) => {
    if (!req.query.subject) {
        res.status(400).json({
            status: 'error',
            error: 'Subject Id should be provided',
        });
    }

    const subject = mongoose.Types.ObjectId(req.query.subject);

    const dates = [];
    const ids = [];

    const features = new APIFeatures(Attendance.find(), { subject }).filter().sort('date').limit().paginate();
    const attendanceCount = await features.query.populate({
        path: 'subject',
        populate: {
            path: 'semester',
            populate: {
                path: 'batch',
            },
        },
    });

    attendanceCount.map((attendance, index) => {
        dates[index] = attendance.date;
        ids[index] = attendance._id;
    });

    const attendances = await Attendance.aggregate([
        {
            $match: {
                subject: subject,
            },
        },
        {
            $sort: {
                date: 1,
            },
        },
        {
            $unwind: '$attendances',
        },
        {
            $lookup: {
                from: 'users',
                localField: 'attendances.student',
                foreignField: '_id',
                as: 'student',
            },
        },
        {
            $group: {
                _id: '$student._id',
                name: { $first: '$student.name' },
                rollNo: { $first: '$student.rollNo' },
                dates: { $push: '$date' },
                attendance: { $push: '$attendances' },
            },
        },
        {
            $unwind: '$_id',
        },
        {
            $unwind: '$name',
        },
        {
            $unwind: '$rollNo',
        },
        {
            $sort: {
                rollNo: 1,
            },
        },
        {
            $unset: 'attendance.student',
        },
        {
            $unset: 'attendance._id',
        },
        {
            $project: {
                rollNo: '$rollNo',
                name: '$name',
                dates: '$dates',
                percentage: {
                    $cond: {
                        if: {
                            $eq: [
                                {
                                    $subtract: [
                                        attendanceCount.length,
                                        {
                                            $size: {
                                                $filter: {
                                                    input: '$attendance',
                                                    cond: {
                                                        $eq: ['$$this.status', 'leave'],
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                                0,
                            ],
                        },
                        then: 'N/A', // Handle the division by zero scenario
                        else: {
                            $concat: [
                                {
                                    $convert: {
                                        input: {
                                            $multiply: [
                                                {
                                                    $divide: [
                                                        {
                                                            $size: {
                                                                $filter: {
                                                                    input: '$attendance',
                                                                    cond: {
                                                                        $eq: ['$$this.status', 'present'],
                                                                    },
                                                                },
                                                            },
                                                        },
                                                        {
                                                            $subtract: [
                                                                attendanceCount.length,
                                                                {
                                                                    $size: {
                                                                        $filter: {
                                                                            input: '$attendance',
                                                                            cond: {
                                                                                $eq: ['$$this.status', 'leave'],
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                                100,
                                            ],
                                        },
                                        to: 'string',
                                    },
                                },
                                '%',
                            ],
                        },
                    },
                },

                attendance: '$attendance',
            },
        },
    ]);

    res.status(200).json({
        status: 'success',
        results: attendances.length,
        data: {
            count: attendanceCount.length,
            ids,
            dates,
            attendances,
            subject: attendanceCount[0].subject,
        },
    });
});

exports.getStudentAttendance = catchAsync(async (req, res) => {
    const student = mongoose.Types.ObjectId(req.params.id);
    const stdatt = await Attendance.aggregate([
        {
            $match: {
                'attendances.student': student,
            },
        },
        {
            $unwind: '$attendances',
        },
        {
            $match: {
                'attendances.student': student,
            },
        },
        {
            $group: {
                _id: '$subject',

                attendances: {
                    $push: '$attendances',
                },
                dates: {
                    $push: '$date',
                },
            },
        },
        {
            $lookup: {
                from: 'subjects',
                localField: '_id',
                foreignField: '_id',
                as: 'subject',
            },
        },

        {
            $lookup: {
                from: 'semesters',
                localField: 'subject.semester',
                foreignField: '_id',
                as: 'semester',
            },
        },

        {
            $unwind: '$subject',
        },
        {
            $lookup: {
                from: 'attendances',
                localField: 'subject._id',
                foreignField: 'subject',
                as: 'attendancesList',
            },
        },
        {
            $unwind: '$semester',
        },

        {
            $project: {
                subject: '$_id',
                subjectName: '$subject.name',
                teacher: '$subject.teacher',
                semester: '$semester._id',
                totalClass: {
                    $size: '$attendancesList',
                },
                present: {
                    $size: {
                        $filter: {
                            input: '$attendances',
                            cond: {
                                $eq: ['$$this.status', 'present'],
                            },
                        },
                    },
                },
                absent: {
                    $size: {
                        $filter: {
                            input: '$attendances',
                            cond: {
                                $eq: ['$$this.status', 'absent'],
                            },
                        },
                    },
                },
                leave: {
                    $size: {
                        $filter: {
                            input: '$attendances',
                            cond: {
                                $eq: ['$$this.status', 'leave'],
                            },
                        },
                    },
                },
                percentage: {
                    $cond: {
                        if: {
                            $eq: [
                                {
                                    $subtract: [
                                        { $size: '$attendancesList' }, // Total count
                                        {
                                            $size: {
                                                $filter: {
                                                    input: '$attendances',
                                                    cond: {
                                                        $eq: ['$$this.status', 'leave'],
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                                0,
                            ],
                        },
                        then: 'N/A', // Handle the division by zero scenario
                        else: {
                            $concat: [
                                {
                                    $convert: {
                                        input: {
                                            $multiply: [
                                                {
                                                    $divide: [
                                                        {
                                                            $size: {
                                                                $filter: {
                                                                    input: '$attendances',
                                                                    cond: {
                                                                        $eq: ['$$this.status', 'present'],
                                                                    },
                                                                },
                                                            },
                                                        },
                                                        {
                                                            $subtract: [
                                                                { $size: '$attendancesList' },
                                                                {
                                                                    $size: {
                                                                        $filter: {
                                                                            input: '$attendances',
                                                                            cond: {
                                                                                $eq: ['$$this.status', 'leave'],
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                                100,
                                            ],
                                        },
                                        to: 'string',
                                    },
                                },
                                '%',
                            ],
                        },
                    },
                },

                attendances: '$attendances',
                dates: '$dates',
            },
        },
        {
            $unset: '_id',
        },
        {
            $unset: 'attendances.student',
        },
        {
            $unset: 'attendances._id',
        },
        {
            $group: {
                _id: '$semester',
                attendances: { $push: '$$ROOT' },
            },
        },
        {
            $unset: 'attendances.semester',
        },
        {
            $lookup: {
                from: 'semesters', // Assuming you have a "semesters" collection
                localField: '_id',
                foreignField: '_id',
                as: 'semester',
            },
        },
        {
            $unwind: '$semester',
        },
        {
            $project: {
                semester: '$semester',
                semesterName: '$semseter.name',
                subjects: '$attendances',
                student: student,
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'student',
                foreignField: '_id',
                as: 'studentData',
            },
        },
        {
            $unwind: '$studentData',
        },
        {
            $unset: 'studentData.password',
        },
        {
            $unset: 'studentData.confirmationToken',
        },
    ]);
    res.send({
        status: 'success',
        results: stdatt.length,
        attendances: stdatt,
    });
});

exports.getStudentAttendanceForSubject = catchAsync(async (req, res) => {
    const student = mongoose.Types.ObjectId(req.params.id);
    const subjectId = mongoose.Types.ObjectId(req.params.subjectId);

    const stdatt = await Attendance.aggregate([
        {
            $match: {
                'attendances.student': student,
                subject: subjectId, // Match specific subject
            },
        },
        {
            $unwind: '$attendances',
        },
        {
            $match: {
                'attendances.student': student,
            },
        },
        {
            $group: {
                _id: '$subject',

                attendances: {
                    $push: '$attendances',
                },
                dates: {
                    $push: '$date',
                },
            },
        },
        {
            $lookup: {
                from: 'subjects',
                localField: '_id',
                foreignField: '_id',
                as: 'subject',
            },
        },

        {
            $unwind: '$subject',
        },
        {
            $lookup: {
                from: 'attendances',
                localField: 'subject._id',
                foreignField: 'subject',
                as: 'attendancesList',
            },
        },

        {
            $project: {
                subject: '$_id',
                subjectName: '$subject.name',
                teacher: '$subject.teacher',
                semester: '$semester._id',
                totalClasses: {
                    $size: '$attendancesList',
                },
                present: {
                    $size: {
                        $filter: {
                            input: '$attendances',
                            cond: {
                                $eq: ['$$this.status', 'present'],
                            },
                        },
                    },
                },
                absent: {
                    $size: {
                        $filter: {
                            input: '$attendances',
                            cond: {
                                $eq: ['$$this.status', 'absent'],
                            },
                        },
                    },
                },
                leave: {
                    $size: {
                        $filter: {
                            input: '$attendances',
                            cond: {
                                $eq: ['$$this.status', 'leave'],
                            },
                        },
                    },
                },
                percentage: {
                    $cond: {
                        if: {
                            $eq: [
                                {
                                    $subtract: [
                                        { $size: '$attendancesList' }, // Total count
                                        {
                                            $size: {
                                                $filter: {
                                                    input: '$attendances',
                                                    cond: {
                                                        $eq: ['$$this.status', 'leave'],
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                                0,
                            ],
                        },
                        then: 'N/A', // Handle the division by zero scenario
                        else: {
                            $concat: [
                                {
                                    $convert: {
                                        input: {
                                            $multiply: [
                                                {
                                                    $divide: [
                                                        {
                                                            $size: {
                                                                $filter: {
                                                                    input: '$attendances',
                                                                    cond: {
                                                                        $eq: ['$$this.status', 'present'],
                                                                    },
                                                                },
                                                            },
                                                        },
                                                        {
                                                            $subtract: [
                                                                { $size: '$attendancesList' },
                                                                {
                                                                    $size: {
                                                                        $filter: {
                                                                            input: '$attendances',
                                                                            cond: {
                                                                                $eq: ['$$this.status', 'leave'],
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                                100,
                                            ],
                                        },
                                        to: 'string',
                                    },
                                },
                                '%',
                            ],
                        },
                    },
                },

                attendances: '$attendances',
                dates: '$dates',
            },
        },
        {
            $unset: '_id',
        },
        {
            $unset: 'attendances.student',
        },
        {
            $unset: 'attendances._id',
        },
    ]);

    res.send({
        status: 'success',
        results: stdatt.length,
        attendances: stdatt,
    });
});

exports.createAttendance = catchAsync(async (req, res, next) => {
    const subject = req.body.subject;

    // Get the current date and time
    const currentDate = new Date();

    // Calculate the start and end dates of the current day
    // const firstDayOfCurrentWeek = new Date(
    //     currentDate.getFullYear(),
    //     currentDate.getMonth(),
    //     currentDate.getDate() - currentDate.getDay()
    // );
    //const lastDayOfCurrentWeek = new Date(firstDayOfCurrentWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

    // Find the attendance records for the current date and subject
    const existingAttendancesToday = await Attendance.find({
        date: {
            $gte: new Date(currentDate.setHours(0, 0, 0, 0)),
            $lt: new Date(currentDate.setHours(23, 59, 59, 999)),
        },
        subject: subject,
    });

    // Find the attendance records for the current week and subject
    // const existingAttendancesThisWeek = await Attendance.find({
    //     date: {
    //         $gte: firstDayOfCurrentWeek,
    //         $lte: lastDayOfCurrentWeek,
    //     },
    //     subject: subject,
    // });

    // // Get the subject's creditHours
    // const subjectData = await Subject.findById(subject);

    // const creditHours = subjectData.creditHours;

    // // Check if the attendance limits have been reached
    // if (existingAttendancesThisWeek.length >= creditHours) {
    //     return next(
    //         new AppError(
    //             `Attendance limit reached for this week. Only ${creditHours} attendances are allowed for this subject per week.`
    //         ),
    //         400
    //     );
    // }

    // TODO: Remove this later
    // if (existingAttendancesToday.length >= 3) {
    //     return next(new AppError(`Attendance limit reached for today..`), 400);
    // }

    let date = new Date();
    let offset = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
    date.setTime(date.getTime() + offset);

    let formattedDate = date.toISOString().replace('Z', '+05:00');

    // Create the attendance record
    const attendance = {
        date: formattedDate,
        subject: subject,
        attendances: req.body.attendance,
        marked_by: req.user.id,
    };
    const newAttendance = await Attendance.create(attendance);

    res.status(201).json({
        status: 'success',
        data: {
            Attendance: newAttendance,
        },
    });
});
