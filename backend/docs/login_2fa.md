# backend - signup, login, 2FA and JWT

## how to run server

old - node server.js

current - npm run dev

## how to log in on command line without a frontend
### This code must be copied as is because of the location of newline chars

```
curl -X POST http://localhost:4000/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"demoUser","password":"demoPass"}'
```

### to log in (this will explicitly tell curl to save cookies and send them back)

```
curl -i \
  -c cookies.txt \
curl -X POST http://localhost:4000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demoUser","password":"demoPass"}'
```

or
```
curl -X POST http://localhost:4000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testUser1", "password": "password123"}'
```

### To go to your profile for example
```
curl http://localhost:4000/profile \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

## Enabling 2FA

2FA is optional. There should be a button on the profile page or somewhere that lets the user <br>
decide if they want to enable 2FA.
```
curl -X POST http://localhost:4000/enable-2fa \
  -H "Authorization: Bearer <TOKEN>" \
```
example:
```
curl -X POST http://localhost:4000/enable-2fa \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJkZW1vVXNlciIsImlhdCI6MTc2MzQyMjkzNSwiZXhwIjoxNzYzNDIzODM1fQ.qSj61jHIgTZm9_6djE1ir8jwxa6H8yOsGUIa9w2Ohf0" \
```


### Expected response (I think)
{
  "otpauth_url": "otpauth://totp/MyApp:test@example.com?secret=JBSWY3DPEHPK3PXP&issuer=MyApp",
  "secret": "JBSWY3DPEHPK3PXP"
}

## Terminal QR (no frontend required)
I haven' gotten this to work. I usually just create a qr.html and open it in firefox to get the QR code to scan
```
npx qrcode-terminal 'otpauth://totp/MyApp:test@example.com?secret=JBSWY3DPEHPK3PXP&issuer=MyApp'
```

## Verify 2FA
```
curl -X POST http://localhost:4000/verify-setup-2fa \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"code": "123456"}'
```
example: 
```
curl -X POST http://localhost:4000/verify-setup-2fa \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJkZW1vVXNlciIsImlhdCI6MTc2MzQyMjkzNSwiZXhwIjoxNzYzNDIzODM1fQ.qSj61jHIgTZm9_6djE1ir8jwxa6H8yOsGUIa9w2Ohf0" \
  -H "Content-Type: application/json" \
  -d '{"code": "904481"}'
```

## 2FA login
```
curl -X POST http://localhost:4000/login-2fa \
  -H "Content-Type: application/json" \
  -d '{"username": "demoUser", "token": "654321"}'
```

## Verification
```
curl -X POST http://localhost:3000/verify-2fa \
  -H "Content-Type: application/json" \
  -d '{"token": "123456", "secret": "JBSWY3DPEHPK3PXP"}'
``` 

## to test a protected route
```
curl -b cookies.txt http://localhost:4000/protected
```
