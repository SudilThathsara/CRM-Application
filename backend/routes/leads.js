const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// @route   GET api/leads
// @desc    Get all leads with optional filtering and search
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { search, status, leadSource, assignedSalesperson } = req.query;
    
    let query = {};
    
    // Search by name, company, or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filters
    if (status) query.status = status;
    if (leadSource) query.leadSource = leadSource;
    if (assignedSalesperson) query.assignedSalesperson = assignedSalesperson;

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/leads
// @desc    Create a new lead
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    const lead = await newLead.save();
    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/leads/:id
// @desc    Get a single lead by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ msg: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Lead not found' });
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/leads/:id
// @desc    Update a lead
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!lead) return res.status(404).json({ msg: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/leads/:id
// @desc    Delete a lead
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ msg: 'Lead not found' });
    
    await lead.deleteOne();
    // Also delete associated notes
    await Note.deleteMany({ leadId: req.params.id });
    
    res.json({ msg: 'Lead removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Lead not found' });
    res.status(500).send('Server Error');
  }
});



// @route   GET api/leads/:id/notes
// @desc    Get notes for a lead
// @access  Private
router.get('/:id/notes', auth, async (req, res) => {
  try {
    const notes = await Note.find({ leadId: req.params.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/leads/:id/notes
// @desc    Add a note to a lead
// @access  Private
router.post('/:id/notes', auth, async (req, res) => {
  try {
    const newNote = new Note({
      leadId: req.params.id,
      content: req.body.content,
      createdBy: req.body.createdBy || 'Unknown User' // Ideally coming from req.user
    });
    const note = await newNote.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
