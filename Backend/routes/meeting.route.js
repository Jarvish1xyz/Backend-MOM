const express = require('express');
const MeetingRoute = express.Router();
const { addMeeting, getAllMeeting, getMyMeetings, getMeetingDetail, updateStatus, getMyStarredMeetings, deleteMeeting, updateMeeting } = require('../controllers/meeting.controller');
const authMiddleware = require('../middleware/auth.middleware');

MeetingRoute.use(express.json());
MeetingRoute.post("/add",authMiddleware, addMeeting);
MeetingRoute.get('/all', authMiddleware, getAllMeeting);
MeetingRoute.patch('/update/:id', authMiddleware, updateMeeting);
MeetingRoute.get('/mymeetings', authMiddleware, getMyMeetings);
MeetingRoute.get('/mymeetings/starred', authMiddleware, getMyStarredMeetings);
// console.log("Meeting route loaded");
MeetingRoute.get('/details/:id', authMiddleware, getMeetingDetail);
MeetingRoute.patch('/update-status/:id', authMiddleware, updateStatus);
MeetingRoute.delete('/delete/:id', authMiddleware, deleteMeeting);


module.exports = MeetingRoute;