# Friend request and Friend list handling

A single friend request stored as one row in db:
```
userID = sender
friendID = receiver
status = PENDING

```

### Symetrical friendships stored in db

```
userID = A, friendID = B → ACCEPTED
userID = B, friendID = A → ACCEPTED

```

## Friend requests

### 1. send friend request

POST /friends/request

body:
```json
{
  "toUserId": 42
}

```

logic:
- check not sending to self
- check row does not already exist
- create row:

```json
prisma.friend.create({
  data: {
    userID: senderId,
    friendID: toUserId,
    status: "PENDING",
  }
});

```

### 2. Get incoming friend requests

GET /friends/requests/incoming

returns rows where:
```
friendID = currentUser
status = PENDING

```

### 3. Get outgoing friend requests

GET /friends/requests/outgoing

rows where:

```
userID = currentUser
status = PENDING

```

### 4. Accept friend request

POST /friends/request/:id/accept

Where "id" is the Friend.id of the PENDING request

Logic:

```
await prisma.friend.update({
  where: { id },
  data: { status: "ACCEPTED" }
});

// create reverse row
await prisma.friend.create({
  data: {
    userID: receiverId,
    friendID: senderId,
    status: "ACCEPTED"
  }
});

```

### 5. Reject friend request

POST /friends/request/:id/reject

- delete the row or set to rejected (if we add a REJECTED enum later)

### 6. Cancel friend request

(Outgoing request)

DELETE /friends/request/:id

just delete the row


## Friends

### 1. Get friend list

GET /friends

where:

```
userID = currentUser AND status = ACCEPTED

```
This returns all accepted friendships

### 2. Remove a friend

DELETE /friends/:friendId

```
DELETE FROM Friend WHERE
(userID = me AND friendID = friend) OR
(userID = friend AND friendID = me)

```

with prisma:
```
await prisma.friend.deleteMany({
  where: {
    OR: [
      { userID: me, friendID: friendId },
      { userID: friendId, friendID: me }
    ]
  }
});

```

## Blocking - the schema already supports "BLOCKED"

### 1. Block a user

POST /friends/:userId/block

Implementation:

Update or create a row:

```
prisma.friend.upsert({
  where: {
    userID_friendID: { userID: me, friendID: userId }
  },
  update: { status: "BLOCKED" },
  create: {
    userID: me,
    friendID: userId,
    status: "BLOCKED"
  }
});

```

### 2. Unblock a user

DELETE /friends/:userId/block

## folder layout

```
src/
  routes/
    friends/
      request.routes.ts
      friend.routes.ts
  controllers/
    friends/
      request.controller.ts
      friend.controller.ts
  services/
    friend.service.ts
  schemas/
    friends.schema.ts
  prisma/
    client.ts

```
