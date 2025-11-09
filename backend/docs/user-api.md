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
