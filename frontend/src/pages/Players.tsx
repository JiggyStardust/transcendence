import { Button } from "../components/Button";
import Input from "../components/Input";
import { PROXY_URL } from "../constants";
import { useState } from "react";
import { FiPlus, FiXCircle } from "react-icons/fi";

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

const CardFrame = ({ children, className = "" }) => (
  <div className={`relative p-4 w-72 h-80 border flex-shrink-0 snap-start rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

const LoggedInCard = ({ card }: { card: LoggedIn }) => {
	return (
		<CardFrame className="flex flex-col items-center justify-center gap-4">
			<img src={card.avatarUrl} className="size-28 object-cover rounded-full"/>
			<p className="bolded text-2xl">{card.name}</p>
		</CardFrame>
	)
}

type PendingCardProps = {
  card: Pending;
	setCards: React.Dispatch<React.SetStateAction<PlayerCard[]>>
  onUpdate: (id: string, updates: Partial<Pending>) => void;
	handleLogin: () => void;
  onLoginSuccess: (id: string, user: any) => void;
};

const PendingCard =({ card, setCards, onUpdate, handleLogin, onLoginSuccess }: PendingCardProps) => {

	const removeCard = (id: string) => {
		console.log("remove card clicked");
	  setCards(prevCards =>
	    prevCards.filter(card => card.id !== id)
	  );
	};

	return (
		<CardFrame>
			<button className="absolute top-8 right-8 cursor-pointer"
				onClick={() => removeCard(card.id)}>
				<FiXCircle size="20" />
			</button>
			<div className="absolute bottom-10 inset-x-0 flex flex-col items-center">
				<Input id="username" label="Username" value={card.username} onChange={(e) => onUpdate(card.id, { username: e.target.value })}/>
				<Input type="password" id="password" label="Password" value={card.password} onChange={(e) => onUpdate(card.id, { password: e.target.value })}/>
				<Button onClick={handleLogin}>Log in</Button>
			</div>
		</CardFrame>
	)
}

type PlayerCardProps = {
  card: PlayerCard;
  onUpdate: (id: string, updates: Partial<Pending>) => void;
	handleLogin: () => void;
  onLoginSuccess: (id: string, user: any) => void;
	setCards: React.Dispatch<React.SetStateAction<PlayerCard[]>>
};

const PlayerCardComponent = ({ card, onUpdate, handleLogin, onLoginSuccess, setCards }: PlayerCardProps) => {
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
					setCards={setCards}
        />
      );
  }
};

const AddCard = ({ onAdd }) => (
  <button onClick={onAdd} className="flex items-center justify-center w-72 h-80 border flex-shrink-0 snap-start rounded-xl shadow-lg cursor-pointer">
    <FiPlus size="128"/>
  </button>
);

var idCounter = 2;


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

	const handleLogIn = () => {
		//TODO
		console.log("Handle login");
	}

	const onLoginSuccess = () => {
		//TODO
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
						setCards={setCards}
			    />
			  ))}
				{cards.length < 4 && 
					<AddCard onAdd={addCard} />
				}
			</div>
	  </main>
	);
}

export default Players;