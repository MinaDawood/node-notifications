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
- **NOTE**: I know that you mentioned in the challenge pdf file that I don't need to integrate with Real SMS Provider but I did because I wanted to check if my code will work or not and this is a free trial service, you can put your number to check it also.

## Send SMS to single user

- Hit this endpoint -> http://localhost:5000/api/v1/sms/single

```
content-type: application/json
{
    "message": "Hello From Node.js", // Put your message here
    "phoneNumber": "+201204582130" // Put your number here
}

```
