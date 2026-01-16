const express = require('express');
const MeetingRoute = express.Router();
const { addMeeting, getAllMeeting, getMyMeetings } = require('../controllers/meeting.controller');
const authMiddleware = require('../middleware/auth.middleware');

MeetingRoute.use(express.json());

MeetingRoute.post("/add",authMiddleware, addMeeting);
MeetingRoute.get('/all', authMiddleware, getAllMeeting);
MeetingRoute.get('/mymeetings', authMiddleware, getMyMeetings);

module.exports = MeetingRoute;