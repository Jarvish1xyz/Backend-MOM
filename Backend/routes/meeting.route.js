const express = require('express');
const MeetingRoute = express.Router();
const { addMeeting, getAllMeeting, getMyMeetings, getMeetingDetail } = require('../controllers/meeting.controller');
const authMiddleware = require('../middleware/auth.middleware');

MeetingRoute.use(express.json());

MeetingRoute.post("/add",authMiddleware, addMeeting);
MeetingRoute.get('/all', authMiddleware, getAllMeeting);
MeetingRoute.get('/mymeetings', authMiddleware, getMyMeetings);
MeetingRoute.get('/details/:id', authMiddleware, getMeetingDetail);

module.exports = MeetingRoute;