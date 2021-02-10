const sslkeylog = require('sslkeylog');
sslkeylog.hookAll();
var https = require('https');
https.globalAgent.maxSockets = 30;

const NotifyClient = require('notifications-node-client').NotifyClient;
const notifyApiClient = new NotifyClient(process.env.NOTIFY_TEST_API_KEY);

const NUMBER_OF_MESSAGES = 3000;
// set up your message template in the Notify dashboard and grab the id, to replace the one below
const NOTIFY_MESSAGE_TEMPLATE_ID = 'cbf2f9c6-c44c-43ab-bc28-3fd2c8a0e170';

let emailAddresses = []
const d = new Date();
for (let i = 0; i < NUMBER_OF_MESSAGES; i++) {
  emailAddresses.push(`${d.getHours()}-${d.getMinutes()}--${i}@test.com`)
}
let requestTimestamps = [];
(async () => {
    let errorCount = 0;
    await Promise.allSettled(
      emailAddresses.map((emailAddress) => {
        requestTimestamps.push(new Date());
        return notifyApiClient.sendEmail(
          NOTIFY_MESSAGE_TEMPLATE_ID,
          emailAddress
        )
      })).then(results => {
        results.map((result, idx) => {
          if (result.status === 'rejected') {
            errorCount = errorCount + 1;
            console.log(`=========================
            ${JSON.parse(result.reason.config.data).email_address}
            ${result.reason.response.status}: ${result.reason.response.data.errors[0].message}
            Request timestamp: ${requestTimestamps[idx].toString()}
            Response timestamp: ${result.reason.response.headers.date}`)
          }
        })
        console.log('Total = ', results.length)
        console.log('Errors = ', errorCount)
      }
    ).catch(err => {
      console.log(`================== allSettled catch: ${err.message}`)
    })
  }
)()
