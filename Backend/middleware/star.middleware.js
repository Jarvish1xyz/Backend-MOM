module.exports = async (req, res, next) => {
  try {
    console.log((req.body.isStarred));
    const meeting = await Meeting.findOneAndUpdate({ meetingid: req.body.meetingid }, {isStarred:req.body.isStarred}, {new:true});
    res.json(meeting);
    next();
  } catch (err) {
    res.status(500).json({ err: "Failed to update meeting" });
  }
}
