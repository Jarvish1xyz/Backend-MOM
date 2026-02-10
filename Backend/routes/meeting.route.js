const express = require('express');
const MeetingRoute = express.Router();
const { addMeeting, getAllMeeting, getMyMeetings, getMeetingDetail, updateStatus, getMyStarredMeetings, deleteMeeting } = require('../controllers/meeting.controller');
const authMiddleware = require('../middleware/auth.middleware');

MeetingRoute.use(express.json());

MeetingRoute.post("/add",authMiddleware, addMeeting);
MeetingRoute.get('/all', authMiddleware, getAllMeeting);
MeetingRoute.get('/mymeetings', authMiddleware, getMyMeetings);
MeetingRoute.get('/mymeetings/starred', authMiddleware, getMyStarredMeetings);
MeetingRoute.get('/details/:id', authMiddleware, getMeetingDetail);
MeetingRoute.put('/update-status/:id', authMiddleware, updateStatus);
MeetingRoute.delete('/delete/:id', authMiddleware, deleteMeeting);


module.exports = MeetingRoute;