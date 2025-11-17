# User Profile API Documentation

### Content

- [Routes](#routes)
  - [Check if username is available](#check-username)

## Routes

### Check username

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
GET /check-username?username=alice
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
