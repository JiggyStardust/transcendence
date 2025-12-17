# Matches

### posting matches to backend

```
curl -X POST http://localhost:5173/matches \
  -H "Content-Type: application/json" \
  -d '{"userIds": [1, 2], "scores": [10, 15], "winner": [false, true]}'
```

### getting match info back from backend

```
curl -s "http://localhost:4000/match_history?userId=2" | jq
```

### returns from IMatchHistoryData

the function will return an array where each item looks like this:

```json
{
  matchId: 1,
  userId: 5,           // The user who requested it
  score: 15,           // Their score in this match
  isWinner: true,      // Whether they won
  createdAt: "2024-12-16T10:30:00Z",
  match: {
    id: 1,
    winnerId: 5,
    createdAt: "2024-12-16T10:30:00Z",
    winner: {          // The winner's info
      id: 5,
      username: "player1",
      displayName: "Player One",
      avatarURL: "https://..."
    },
    participants: [    // ALL participants including scores
      {
        userId: 5,
        score: 15,     // ← Scores are here!
        isWinner: true,
        createdAt: "2024-12-16T10:30:00Z",
        user: {
          id: 5,
          username: "player1",
          displayName: "Player One",
          avatarURL: "https://..."
        }
      },
      {
        userId: 7,
        score: 10,     // ← Opponent's score
        isWinner: false,
        createdAt: "2024-12-16T10:30:00Z",
        user: {
          id: 7,
          username: "player2",
          displayName: "Player Two",
          avatarURL: "https://..."
        }
      }
    ]
  }
}```


