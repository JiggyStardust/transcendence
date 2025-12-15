// Players.tsx
import { Button } from "../components/Button";
import Input from "../components/Input";
import { PROXY_URL } from "../constants";
import { useEffect, useState } from "react";
import { FiPlus, FiXCircle } from "react-icons/fi";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";

// This is temporary to demonstrate logout functionality / see if it works. Will be put to NavBar later.
const LogoutButton = () => {
  const { logout } = useAuth();
  return (
    <button
      onClick={logout}
      className="mt-4 px-6 py-2 rounded-lg border border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
    >
      Log Out
    </button>
  );
};

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
  error?: string;
};

type PlayerCard = LoggedIn | Pending;

const CardFrame = ({ children, className = "" }: any) => (
  <div className={`relative p-4 w-72 h-80 border flex-shrink-0 snap-start rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

const LoggedInCard = ({ card }: { card: LoggedIn }) => {
  return (
    <CardFrame className="flex flex-col items-center justify-center gap-4">
      <img src={card.avatarUrl} className="w-28 h-28 object-cover rounded-full" alt={"Avatar Image of " + card.name}/>
      <p className="font-semibold text-2xl">{card.name}</p>
    </CardFrame>
  )
}

type PendingCardProps = {
  card: Pending;
  setCards: React.Dispatch<React.SetStateAction<PlayerCard[]>>
  onUpdate: (id: string, updates: Partial<Pending>) => void;
  handleLogin: (player: Pending) => void;
};

const PendingCard = ({ card, setCards, onUpdate, handleLogin}: PendingCardProps) => {

  const removeCard = (id: string) => {
    console.log("remove card clicked");
    setCards(prevCards =>
      prevCards.filter(c => c.id !== id)
    );
  };

  return (
    <CardFrame>
      <button className="absolute top-4 right-4 cursor-pointer"
        onClick={() => removeCard(card.id)}>
        <FiXCircle size={20} />
      </button>
      <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-3 px-4">
        <Input id={"username-" + card.id} label="Username" value={card.username} onChange={(e) => onUpdate(card.id, { username: e.target.value })}/>
        <Input type="password" id={"password-" + card.id} label="Password" value={card.password} onChange={(e) => onUpdate(card.id, { password: e.target.value })}/>
        <Button onClick={() => handleLogin(card)}>Log in</Button>
        {card.error && <p className="text-red-500 text-sm mt-2">{card.error}</p>}
      </div>
    </CardFrame>
  )
}

type PlayerCardProps = {
  card: PlayerCard;
  onUpdate: (id: string, updates: Partial<Pending>) => void;
  handleLogin: (card: Pending) => void;
  setCards: React.Dispatch<React.SetStateAction<PlayerCard[]>>
};

const PlayerCardComponent = ({ card, onUpdate, handleLogin, setCards }: PlayerCardProps) => {
  switch (card.type) {
    case "loggedIn":
      return <LoggedInCard card={card} />;
    case "pending":
      return (
        <PendingCard
          card={card}
          onUpdate={onUpdate}
          handleLogin={handleLogin}
          setCards={setCards}
        />
      );
  }
};

const AddCard = ({ onAdd }: { onAdd: () => void }) => (
  <button onClick={onAdd} className="flex items-center justify-center w-72 h-80 border flex-shrink-0 snap-start rounded-xl shadow-lg cursor-pointer">
    <FiPlus size={128}/>
  </button>
);

let idCounter = 2;

const Players = () => {
  const [cards, setCards] = useState<PlayerCard[]>([]);
  const { loadMe, loadUser } = useUser();

  useEffect(() => {
    (async () => {
      const me = await loadMe();
      if (me) {
        const mainCard: LoggedIn = {
          type: "loggedIn",
          id: String(me.id),
          name: me.displayName,
          avatarUrl: me.avatarUrl
        }
        setCards(prev => {
          const exists = prev.some(c => c.type === "loggedIn" && c.id === String(me.id));
          return exists ? prev : [mainCard, ...prev];
        });
      }
    })();
  }, [loadMe]);

  const addCard = () => {
    setCards(prev => [
      ...prev,
      {
        type: "pending",
        id: idCounter.toString(),
        username: "",
        password: ""
      }
    ]);
    idCounter++;
  };

  const updatePendingCard = (id: string, updates: Partial<Pending>) => {
    setCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, ...updates } : card
      )
    );
  };

  const handleLogIn = async (card: Pending) => {
    const { username, password } = card;
    if (!password || !username) {
      // show error in the pending card PLACEHOLDER -> need to match with Maria's errors later
      updatePendingCard(card.id, { error: "Both username and password needed" });
      return;
    }

    // guestList is an array of ids of players who already logged in
    const guestList = cards
      .filter((c): c is LoggedIn => c.type === "loggedIn")
      .map(c => Number(c.id));
    
    try {
      const res = await fetch(PROXY_URL + "/verify_player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, guestList}),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Login failed:", data.error);
        updatePendingCard(card.id, { error: data.error || "Login failed" });
        return;
      }
      // verify_player returned success. Now load the side player's full profile from /users/:username
      
      const user = await loadUser(data.username);
      if (!user) {
        updatePendingCard(card.id, { error: "Failed to load user profile" });
        return;
      }

      setCards(prev =>
        prev.map(c =>
          c.id === card.id
            ? {
                type: "loggedIn",
                id: String(user.id),
                name: user.displayName,
                avatarUrl: user.avatarUrl
              } as LoggedIn
            : c
        )
      );
    } catch (err) {
      console.error("Error handling login:", err);
      updatePendingCard(card.id, { error: "Unexpected error" });
    }
  };

  return (
    <main>
      <div className="flex gap-12 p-12 justify-start overflow-x-auto flex-nowrap no-scrollbar snap-x snap-mandatory scroll-pl-12">
        {cards.map(card => (
          <PlayerCardComponent
            key={card.id}
            card={card}
            onUpdate={updatePendingCard}
            handleLogin={handleLogIn}
            setCards={setCards}
          />
        ))}
        {cards.length < 4 && <AddCard onAdd={addCard} />}
      </div>


          {/* Logout Button PLACEHOLDER */}
      <div className="flex justify-center w-full">
        <LogoutButton />
      </div>
    </main>
  );
}

export default Players;
