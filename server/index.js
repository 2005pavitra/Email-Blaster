require('dotenv').config();

const express = require('express');
const app = express();
const {google} = require('googleapis');

const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

//0auth2 client
const OAuth2Client =new google.auth.OAuth2Client(
process.env.GOOGLE_CLIENT_ID,
process.env.GOOGLE_CLIENT_SECRET,
'postmessage'
);

app.post('/api/send-email', async(req,res) =>{
    const{code, targetEmail, subject, message} = req.body;

    try{
        const {token} = await OAuth2Client.getToken(code);
        OAuth2Client.setCredentials(token);

        const gmail = google.gmail({version:'v1', auth: OAuth2Client});

        const emailLines = [
            `To: ${targetEmail}`,
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            `Subject: ${subject}`,
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

        console.log('Email sent successfully:', response.data);
        res.status(200).json({message: 'Email sent successfully'});
    }catch(error){
        console.error('Error sending email:', error);
        res.status(500).json({error: 'Failed to send email'});
    }
})

app.listen(process.env.PORT || 3001, () => {
    console.log('Server is running on port ${process.env.PORT || 3001}');
});