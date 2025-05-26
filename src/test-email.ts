import { sendEmail } from './utils/emailSender';

(async () => {
  try {
    await sendEmail('uwitonzeafuwahamissi@gmail.com', 'Test Email', '<p>Hello from test</p>');
    console.log('Test email sent');
  } catch (err) {
    console.error('Test email failed:', err);
  }
})();
