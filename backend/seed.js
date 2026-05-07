const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load env
dotenv.config();

const User = require('./models/User');
const Lead = require('./models/Lead');
const Note = require('./models/Note');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.error(err));

const seedDB = async () => {
  try {
    // Clear Existing Data
    await User.deleteMany({});
    await Lead.deleteMany({});
    await Note.deleteMany({});

    // Create Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = new User({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user created: admin@example.com / password123');

    // Create Sample Leads
    const leads = [
      {
        name: 'John Doe',
        companyName: 'Acme Corp',
        email: 'john.doe@acme.com',
        phoneNumber: '555-1234',
        leadSource: 'Website',
        assignedSalesperson: 'Admin',
        status: 'New',
        estimatedDealValue: 5000
      },
      {
        name: 'Jane Smith',
        companyName: 'Tech Innovations',
        email: 'jane@techinnovations.io',
        phoneNumber: '555-5678',
        leadSource: 'Referral',
        assignedSalesperson: 'Admin',
        status: 'Contacted',
        estimatedDealValue: 12000
      },
      {
        name: 'Bob Johnson',
        companyName: 'Global Industries',
        email: 'bjohnson@global.net',
        phoneNumber: '555-9012',
        leadSource: 'Cold Call',
        assignedSalesperson: 'Admin',
        status: 'Qualified',
        estimatedDealValue: 25000
      },
      {
        name: 'Alice Williams',
        companyName: 'NextGen Solutions',
        email: 'alice.w@nextgen.com',
        phoneNumber: '555-3456',
        leadSource: 'Trade Show',
        assignedSalesperson: 'Admin',
        status: 'Won',
        estimatedDealValue: 40000
      }
    ];

    const insertedLeads = await Lead.insertMany(leads);
    console.log(`${insertedLeads.length} leads created.`);

    // Create Sample Notes
    const notes = [
      {
        leadId: insertedLeads[0]._id,
        content: 'Left a voicemail. Seems like a good prospect.',
        createdBy: 'admin@example.com'
      },
      {
        leadId: insertedLeads[1]._id,
        content: 'Had a great introductory call. Scheduled a demo for next week.',
        createdBy: 'admin@example.com'
      }
    ];

    await Note.insertMany(notes);
    console.log(`${notes.length} notes created.`);

    console.log('Database Seeding Completed Successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
