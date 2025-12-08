- AuthContext handles logging in and logging out. It only saves AccessTokens and RefreshTokens and has boolean "isAuthenticated".
- If we want to, we can protect routes with useAuth hook (to the game for example)

- UserContext has all the possible information, that frontend needs to display profile pages,
match statistics, avatar image, friends and so on.

- Each session has only one user, who is truly logged in / authenticated (full role). Other users do login, but they can't edit profile settings, and are only logged so that their match
statistics can be saved/altered (partial role). Should this be a completely separate context, like: SessionPlayersContext? Or should we just have a logic like 
