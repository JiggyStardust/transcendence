# User Profile API Documentation

### Content

- [Routes](#routes)
  - [Check if username is available](#check-username)
  - [Avatar](#avatar)

# Routes

## Check username

Checks whether a given username is available for registration.

**Method & Endpoint**

```bash
GET /users/check-username
```

**Query Parameters**

- `username` (type: `string`, required: yes):

  Validation rules:
  - minLength: 3
  - additionalProperties: false

**Example request**

```bash
GET /users/check-username?username=alice
```

**Response**

1. Success: `200 OK`
   Examples:
   - Available body: `{"available": true}`
   - Taken body: `{"available": false}`

2. Error: `400 Bad Request`
   Occurs if:
   - `username` is missing.
   - `username` fails prevalidation
   - Extra query parameters are provided.
     Example:
   ```json
   {
     "statusCode": 400,
     "error": "Bad Request",
     "message": "querystring should have required property 'username'"
   }
   ```

**Usage Notes:**

- Use this endpoint to validate username availability in real time before submitting registration.
- Always debounce frontend calls (e.g., 300–500 ms) to reduce amount of calls.

## Avatar

**Usage Notes:**

- Avatars are served as static images from the backend. On the frontend, it’s enough to use `avatarURL` directly as an `<img src={API_URL + avatarURL}>`.
- Uploaded files:  
  - Max size: 2 MB
  - Allowed types: `image/jpeg`, `image/jpg`, `image/png`
- Every user always has at least a default avatar, e.g. "/uploads/avatars/default.jpeg".

### Upload avatar

Uploads or replaces the avatar for a given user.

**Method & Endpoint**

```bash
POST /users/:username/avatar
```

Path Parameters  
- username (type: string, required: yes): Must match the authenticated user’s username (you cannot modify someone else’s avatar).

Headers  
- Authorization: Bearer <accessToken> (required)

Request Body
- multipart/form-data with a single file field:
  - avatar (type: file, required: yes)
- Validation rules:
  - Max size: 2 MB
  - Allowed mimetypes: image/png, image/jpeg, image/jpg

**Example Request**

```bash
curl -X POST "http://localhost:4000/users/demoUser/avatar" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -F "avatar=@/path/to/avatar.png"
```

**Behavior**  

The image is:
- validated (size + mimetype),
- NOT resized, NOT modified,
- saved to disk under `/uploads/avatars/…`,
- and the user’s avatarURL is updated.

If the user already has a custom avatar, the old file will be overwritten according to backend logic.

*Response*

1. Success: `200 OK`

```json
{
  "avatarURL": "/uploads/avatars/1.png"
}
```

2. Error: `400 Bad Request`  

Occurs if:
  - No file is provided (avatar field missing).
  - File type is not allowed.
  
```json
{
  "error": "Invalid file type"
}
```

3. Error: `401 Unauthorized`

Missing or invalid Authorization header / token.

4. Error: `403 Forbidden`

Authenticated user tries to upload an avatar for a different :username.


5. Error: `413 Payload Too Large`

File exceeds 2 MB limit.

```json
{
  "error": "File too large"
}
```

### Reset avatar

Resets a user’s avatar back to the default one.

**Method & Endpoint**

```bash
DELETE /users/:username/avatar
```

Path Parameters
- username (type: string, required: yes): Must match the authenticated user’s username.

Headers 
- Authorization: Bearer <accessToken> (required)

Behavior
If the user currently has a custom avatar:
- The custom avatar file is removed (if stored on disk).
- The user’s avatarURL is set back to the default (e.g. "/uploads/avatars/default.jpeg").
- The avatarType is set to DEFAULT.
- If the user is already using the default avatar, the operation is effectively a no-op but still returns success.

**Example Request**

```bash
curl -X DELETE "http://localhost:4000/users/demoUser/avatar" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**Response**

1. Success: `200 OK`

```json
{
  "avatarURL": "/uploads/avatars/default.jpeg"
}
```

2. Error: `401 Unauthorized`

Missing or invalid Authorization header / token.

3. Error: `403 Forbidden`

Authenticated user tries to reset the avatar for a different :username.
