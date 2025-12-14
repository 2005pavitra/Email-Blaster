require('dotenv').config();

const express = require('express');
const app = express();
const { google } = require('googleapis');

const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(cors({
    origin: [
        'https://email-blaster-xi.vercel.app',
        'https://email-blaster-bjll.vercel.app', // Adding the other one just in case
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
}));
app.use(bodyParser.json());

//db
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/email-blaster';
mongoose.connect(mongoUri)
    .then(() => console.log(' Connected to MongoDB'))
    .catch(err => console.error(' MongoDB Connection Error:', err));

//schema
const EmailLogSchema = new mongoose.Schema({
    senderEmail: String,
    targetEmail: String,
    subject: String,
    timestamp: { type: Date, default: Date.now }
});

const EmailLog = mongoose.model('EmailLog', EmailLogSchema);

//0auth2 client
const OAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage'
);

//--routes-------------
app.post('/api/send-email', async (req, res) => {
    const { code, targetEmail, subject, message } = req.body;

    try {
        const { tokens } = await OAuth2Client.getToken(code);
        OAuth2Client.setCredentials(tokens);

        const gmail = google.gmail({ version: 'v1', auth: OAuth2Client });

        const uniqueRef = Math.random().toString(36).substring(2, 10);
        const finalSubject = `${subject} (Ref: ${uniqueRef})`;

        const emailLines = [
            `To: ${targetEmail}`,
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            `Subject: ${finalSubject}`,
            '',
            message
        ];

        const email = emailLines.join('\r\n').trim();
        const encodedMessage = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        const response = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage
            }
        });

        // Fetch sender email for logging
        const oauth2 = google.oauth2({ version: 'v2', auth: OAuth2Client });
        const userInfo = await oauth2.userinfo.get();
        const senderEmail = userInfo.data.email;

        await EmailLog.create({
            senderEmail: senderEmail,
            targetEmail: targetEmail,
            subject: finalSubject
        });

        res.status(200).json({ success: true, message: 'Email sent and logged successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.get('/api/admin/stats', async (req, res) => {
    try {
        const totalSent = await EmailLog.countDocuments();
        const recentLogs = await EmailLog.find().sort({ timestamp: -1 }).limit(10);
        res.json({ totalSent, recentLogs })
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' })
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});