import { Button } from "../components/Button";
import Input from "../components/Input";
import { PROXY_URL } from "../constants";
import { useState } from "react";
import { FiPlus, FiXCircle } from "react-icons/fi";


type PlayerCard =
	{
    type: "loggedIn";
    id: string;
    name: string;
    avatarUrl: string;
  } | {
    type: "pending";
    id: string;
    username?: string;
    password?: string;
    error?: string;
	};

const LoggedInCard = ({ card }: { card: Extract<PlayerCard, { type: "loggedIn" }> }) => {
	return (
		<div className="p-4 w-72 h-80 border flex-shrink-0 flex flex-col items-center justify-center gap-4 snap-start rounded-xl shadow-lg">
			<img src={card.avatarUrl} className="size-28 object-cover rounded-full"/>
			<p className="bolded text-2xl">{card.name}</p>
		</div>
	)
}

type PendingCardProps = {
  card: Extract<PlayerCard, { type: "pending" }>;
  onUpdate: (id: string, updates: Partial<PlayerCard>) => void;
	handleLogin: () => void;
  onLoginSuccess: (id: string, user: any) => void;
};

const PendingCard =({ card, onUpdate, handleLogin, onLoginSuccess }: PendingCardProps) => {
	return (
		<div className="relative p-4 w-72 h-80 border flex-shrink-0 snap-start rounded-xl shadow-lg">
			<button className="absolute top-8 right-8 cursor-pointer"><FiXCircle className="size-5" /></button>
			<div className="absolute bottom-12 inset-x-0 flex flex-col items-center justify-center">
				<Input id="username" label="Username" value={card.username} onChange={(e) => onUpdate(card.id, { username: e.target.value })}/>
				<Input id="password" label="Password" value={card.password} onChange={(e) => onUpdate(card.id, { password: e.target.value })}/>
				<Button onClick={handleLogin}>Log in</Button>
			</div>
		</div>
	)
}

type PlayerCardProps = {
  card: PlayerCard;
  onUpdate: (id: string, updates: Partial<PlayerCard>) => void;
	handleLogin: () => void;
  onLoginSuccess: (id: string, user: any) => void;
};

const PlayerCardComponent = ({ card, onUpdate, handleLogin, onLoginSuccess }: PlayerCardProps) => {
  switch (card.type) {
    case "loggedIn":
      return <LoggedInCard card={card} />;
    case "pending":
      return (
        <PendingCard
          card={card}
          onUpdate={onUpdate}
					handleLogin={handleLogin}
          onLoginSuccess={onLoginSuccess}
        />
      );
  }
};

const AddCard = ({ onAdd }) => (
  <button onClick={onAdd} className="flex items-center justify-center w-72 h-80 border flex-shrink-0 snap-start rounded-xl shadow-lg cursor-pointer">
    <FiPlus size="128"/>
  </button>
);


const Players = () => {
	const [cards, setCards] = useState<PlayerCard[]>([
	  {
	    type: "loggedIn",
	    id: "1",							//change to real data
	    name: "Maria",
	    avatarUrl: "../src/assets/pong-thumbnail.png"
	  }
	]);

	const addCard = () => {
    const nextId: string = String(cards.length + 1);
		  setCards(prev => [
		    ...prev,
		    {
		      type: "pending",
		      id: nextId,
		      username: "",
		      password: ""
		    }
		  ]);
  };

	const updatePendingCard = (id: string, updates: Partial<PlayerCard>) => {
  	// setCards(prev =>
    // 	prev.map(p => (p.id === id ? { ...p, ...updates } : p))
  	// );
		console.log("Update pending card");
	};

	const handleLogIn = () => {
		console.log("Handle login");
	}

	const onLoginSuccess = () => {
		console.log("Login was successfull, do something about it");
	}

	return (
	  <main>
	    <div className="flex gap-12 p-12 justify-start overflow-x-auto flex-nowrap no-scrollbar snap-x snap-mandatory scroll-pl-12">
				{cards.map(card => (
			    <PlayerCardComponent
			      key={card.id}
			      card={card}
			      onUpdate={updatePendingCard}
						handleLogin={handleLogIn}
			      onLoginSuccess={onLoginSuccess}
			    />
			  ))}
				<AddCard onAdd={addCard} />
			</div>
	  </main>
	);
}

export default Players;