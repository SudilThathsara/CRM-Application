const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');

// @route   GET api/dashboard
// @desc    Get aggregated statistics for dashboard
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const qualifiedLeads = await Lead.countDocuments({ status: 'Qualified' });
    const wonLeads = await Lead.countDocuments({ status: 'Won' });
    const lostLeads = await Lead.countDocuments({ status: 'Lost' });

    const totalEstimatedValueResult = await Lead.aggregate([
      { $group: { _id: null, totalValue: { $sum: '$estimatedDealValue' } } }
    ]);
    const totalEstimatedValue = totalEstimatedValueResult.length > 0 ? totalEstimatedValueResult[0].totalValue : 0;

    const wonDealsValueResult = await Lead.aggregate([
      { $match: { status: 'Won' } },
      { $group: { _id: null, totalValue: { $sum: '$estimatedDealValue' } } }
    ]);
    const totalValueWon = wonDealsValueResult.length > 0 ? wonDealsValueResult[0].totalValue : 0;

    res.json({
      totalLeads,
      newLeads,
      qualifiedLeads,
      wonLeads,
      lostLeads,
      totalEstimatedValue,
      totalValueWon
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
