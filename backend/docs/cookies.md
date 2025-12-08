# HTTP cookies

- HTTP only cookie -> server saves the token in a cookie as HTTP only -> javascript cannot access it

- Unsafe way -> access token -> sent in header -> stored locally all the time

*TODO:*
 - install cookie-parser
 - cookies need to be handled where we generate the access token


## how the tokens work

- access token and refresh tokens are issued
- access token has a lifetime of 15 minutes
- User gets a new access token every 15 minutes automatically.
- if the server sees that the access token is expired, then the browser sends the refresh token
- Server verifies the refresh token and issues a new access token, and sometimes also a new refresh token.

- Cookies belong in the route, not in the service layer


```ts
server.ts
 ├──
 |
routes/
 └── userRoutes.ts       <-- defines URLs

authentication/
 └── userController.ts   <-- sets cookies (reply.setCookie)
 |
 └── authService.ts      <-- generates tokens only
 ```


*TODO - maybe*
- add a /refresh endpoint

- invalidate refresh tokens

- add middleware to verify access tokens

- secure your cookies for production