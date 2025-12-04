# Some notes for multiplayer login

1.1 Player 1 enters email/password + optional 2FA

1.2 Backend sets JWT (session cookie also a possibility)

1.3 Page loads their profile


2.1 Player clicks "start game" button

2.2 Game setup screen appears and asks something like:

```json
Select Player 2:
[Log in as second player]
[Play as guest]```

So there are 2 options, either they can log in or play as guest
Should also consider if you want more than 2 players. Maybe an inbetween page where we 
have the user choose 2 or more players.

2.3 Provide second log in form:
    - This does not override player 1's session. 
    - JWT probably not issued here?? not sure as this is only used to 
        identify the player for this game
    - Does not create new browser session so player 2's log in will not become an actual
        authenticated web session
    - Player 2's login is just treated as account verification, not a true session


## 3.1 players are stores in a "game room" not in browser sessions

3.2 Example for creating a game:
 
```json 
{
  "player1_user_id": 12,
  "player2_user_id": 87,
  "local": true
}```

3.3 player 2 is authenticated by username/password at game start and once validated their ID is used in the match
    - only 1 actual logged in browser session - player 1

3.4 Front end example

```Player 1: Julia (logged in)

Local Game Setup

Player 2 identity:
[  username: ________  ]
[  password: ________  ]
[ Login Player 2 Button ]

Or:
[ Play as Guest Player 2 ]```

if log in succeeds, the page can update to:

Player 1: Julia ✔️
Player 2: Ethan ✔️

[Start Match]

And they can play on one keyboard