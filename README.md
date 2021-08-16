# Swvl Notifications API.

- API for sending sms to single user or gruop of users and sending push notification to single user or group of users

## Quick Overview

- This API has 4 endponts.
  1. For Send SMS to single user
  2. For Send SMS to group of users
  3. For Send push notification to single user
  4. For Send push notification to group of users

## Quick Start

- For start using this API, just let docker run your environment by type.

```
    docker-compose up
```

- you can use postman for testing this API.
- **NOTE-1**: I know that you mentioned in the challenge pdf file that I don't need to integrate with Real SMS Provider but I did because I wanted to check if my code will work or not and this is a free trial service, you can put your number to check it also.

- **NOTE-2** You number must be registered so you can send yourself a message you can easily text or email me with your number or any other number you want to try and i will add you as a registered number.

- **NOTE-3** I couldn't get real token so i can test FCM push notification API so i made a fake one will response with a json object.

## Send a SMS to single user

- Hit this endpoint -> http://localhost:5000/api/v1/sms/single

```
content-type: application/json
{
    "message": "Hello From Node.js", // Put your message here
    "phoneNumber": "+000000000000" // Put your number here
}

```

## Send a SMS to multiple user

- Hit this endpoint -> http://localhost:5000/api/v1/sms/group

```
content-type: application/json
{
    "message": "Hello From Node.js", // Put your message here
    "phoneNumber": ["+200000000000", "+20000000000"] // Put your number here
}

```

## Send a push notification to single user

- Hit this endpoint -> http://localhost:5000/api/v1/sms/push-notification/single/v2

```
content-type: application/json
{
    "title": "Notification title", // Put your title here
    "body": "Notification body" // Put your body here
    "deviceId": "Device id" // Put device id here
}

```

## Testing

```
npm run test
```

## End

- You can reach me via my Email: mina_daoud@outlook.com or my Phone number: 01204582130 if you have any questions.
