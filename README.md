# Test script - sending mass emails using Notify API

To check that the Notify API can process the [advertised 3000 messages per minute](https://docs.notifications.service.gov.uk/node.html#limits).

## Running the script

1. Get a test Notify API key
   Get a *test* key generated from the Notify dashboard. (Note, if you use a live key instead for this kind of testing it's against Notify terms and your account could get blocked. Test keys let you send large quantities of messages that appear in the Notify dashboard, but don't actually send the emails out.)
   
2. Set up a dummy Notify message template
   Create your message template in the Notify dashboard and grab the id, to replace the one in the script.

```
NOTIFY_TEST_API_KEY=<api key> node index.js
```



## Possible Notify API errors

[Notify error code docs](https://docs.notifications.service.gov.uk/node.html#error-codes)

`Exceeded rate limit` - You may have run the script more than once per minute, exceeding the 3000/min limit.

`Your system clock must be accurate to within 30 seconds` - this can be misleading. The error occurs if the timestamp of the request is > 30s before the time when the Notify server receives and processes it. This could be due to your system clock on your laptop being out, but more likely is that there was a delay before the request was actually sent. Modifying Node.js connection pooling is a possible cause.
eg:
```
https.globalAgent.maxSockets = 30;
```

## Using Wireshark to monitor requests out

Follow these [instructions](https://gist.github.com/dfrankland/0fec2cd565f1f7b78fb0e3ededf36b89) to set up.
Pass the path to the SSL key log file as an env variable:

```
SSLKEYLOGFILE=/Users/<you>/ssl_key_log_file.log NOTIFY_TEST_API_KEY=<api key> node index.js
```

In Wireshark, capture the Wi-Fi en0 interface.
Filter requests with `http contains "/notifications/email"`
