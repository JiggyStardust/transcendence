
import { useEffect, useState } from "react";
import { FiPlus, FiXCircle } from "react-icons/fi";
import { Button } from "../components/Button";
import Input from "../components/Input";
import { PROXY_URL } from "../constants";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { useAppToast } from "../context/ToastContext";
import type { User } from "../context/UserContext";
import type { Status } from "../types/toastTypes";

type LoggedIn = {
  type: "loggedIn";
  id: string;
  name: string;
  avatarUrl: string;
};

type Pending = {
  type: "pending";
  id: string;
  username?: string;
  password?: string;
  statusUsername?: Status;
  statusPassword?: Status;
};

type PlayerCard = LoggedIn | Pending;


const CardFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative p-4 w-72 h-80 border rounded-xl shadow-lg flex-shrink-0">
    {children}
  </div>
);

const LoggedInCard = ({ card }: { card: LoggedIn }) => (
  <CardFrame>
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <img
        src={card.avatarUrl}
        className="w-28 h-28 rounded-full object-cover"
        alt={`Avatar of ${card.name}`}
        />
      <p className="text-2xl font-semibold">{card.name}</p>
    </div>
  </CardFrame>
);

const PendingCard = ({
  card,
  onUpdate,
  onLogin,
  onRemove,
}: {
  card: Pending;
  onUpdate: (id: string, updates: Partial<Pending>) => void;
  onLogin: (card: Pending) => void;
  onRemove: (id: string) => void;
}) => (
  <CardFrame>
    <button className="absolute top-4 right-4" onClick={() => onRemove(card.id)}>
      <FiXCircle size={20} />
    </button>

    <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-3 px-4">
      <Input
        id={`username-${card.id}`}
        label="Username"
        value={card.username}
        status={card.statusUsername || undefined}
        onChange={e => onUpdate(card.id, { username: e.target.value, statusUsername: undefined, })}
        />
      <Input
        id={`password-${card.id}`}
        type="password"
        label="Password"
        value={card.password}
        status={card.statusPassword || undefined}
        onChange={e => onUpdate(card.id, { password: e.target.value, statusPassword: undefined, })}
        />
      <Button onClick={() => onLogin(card)}>Log in</Button>
    </div>
  </CardFrame>
);

/* Helpers to store already logged in users in localstore */

const SIDE_PLAYERS_KEY = "sidePlayers";

const getStoredSidePlayers = (): string[] =>
  JSON.parse(localStorage.getItem(SIDE_PLAYERS_KEY) ?? "[]");

const storeSidePlayer = (username: string) => {
  const existing = getStoredSidePlayers();
  if (!existing.includes(username)) {
    localStorage.setItem(
      SIDE_PLAYERS_KEY,
      JSON.stringify([...existing, username])
    );
  }
};

/**/

let idCounter = 1;

export default function Players() {
  const { loadMe, loadUser, users, clearUsers } = useUser();
  const { logout } = useAuth();
  const [cards, setCards] = useState<PlayerCard[]>([]);
  const { showToast } = useAppToast();
  
  /* Restore main + side players on entry */
  
  useEffect(() => {
    (async () => {
      const me = await loadMe();
      if (!me) return;
      
      for (const username of getStoredSidePlayers()) {
        await loadUser(username);
      }
    })();
  }, [loadMe, loadUser]);
  
  /* Build cards from UserContext */
  
  useEffect(() => {
    const loggedInCards: LoggedIn[] = Object.values(users).map((user: User) => ({
      type: "loggedIn",
      id: String(user.id),
      name: user.displayName,
      avatarUrl: user.avatarUrl,
    }));
    
    setCards(loggedInCards);
  }, [users]);
  
  
  const addPendingCard = () => {
    setCards(prev => [
      ...prev,
      { type: "pending", id: String(++idCounter) },
    ]);
  };

  const updatePending = (id: string, updates: Partial<Pending>) => {
    setCards(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const removePending = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  const handleLogin = async (card: Pending) => {
    if (!card.username) {
      updatePending(card.id, { statusUsername: {type: "error", message: "Username required",}, });
      return;
    }
    if (!card.password) {
      updatePending(card.id, { statusPassword: {type: "error", message: "Password required",}, });
      return;
    }

    const guestList = cards
      .filter((c): c is LoggedIn => c.type === "loggedIn")
      .map(c => Number(c.id));

    const res = await fetch(PROXY_URL + "/verify_player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: card.username,
        password: card.password,
        guestList,
      }),
    });


    const data = await res.json();

    if (!res.ok) {
      // console.log("response:" + data.error);
      showToast(data.error, "error");
      return;
    }

    storeSidePlayer(data.username);
    await loadUser(data.username);
    showToast(data.username + " joined the game!", "success");
  };

  const handleLogout = () => {
    localStorage.removeItem(SIDE_PLAYERS_KEY);
    clearUsers();
    logout();
  };

  return (
    <main>
      <div className="flex gap-12 p-12 overflow-x-auto">
        {cards.map(card =>
          card.type === "loggedIn" ? (
            <LoggedInCard key={card.id} card={card} />
          ) : (
            <PendingCard
              key={card.id}
              card={card}
              onUpdate={updatePending}
              onLogin={handleLogin}
              onRemove={removePending}
            />
          )
        )}
        {cards.length < 4 && (
          <button
            onClick={addPendingCard}
            className="w-72 h-80 border rounded-xl flex items-center justify-center"
          >
            <FiPlus size={96} />
          </button>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <Button
          onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </main>
  );
}
