import { Button } from "../components/Button";
import Input from "../components/Input";
import { PROXY_URL } from "../constants";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

const LoginCard = () => {
	return (
		<div className="p-4 w-72 h-80 border flex-shrink-0 snap-start rounded-xl shadow-lg">
			<p>Logged in</p>
		</div>
	)
}

const Players = () => {
	const [cards, setCards] = useState([
    { id: 1, text: "Card 1" }
  ]);

	const addCard = () => {
    const nextId = cards.length + 1;
    setCards([...cards, { id: nextId, text: `Card ${nextId}` }]);
  };

	const AddCard = ({ onAdd }) => (
	  <button onClick={onAdd} className="flex items-center justify-center w-72 h-80 border flex-shrink-0 snap-start rounded-xl shadow-lg cursor-pointer">
	    <FiPlus size="128"/>
	  </button>
	);

	return (
	  <main>
	    <div className="flex gap-12 p-12 justify-start overflow-x-auto flex-nowrap no-scrollbar snap-x snap-mandatory scroll-pl-12">
				{cards.map(card => (
					<LoginCard />
        ))}
				<AddCard onAdd={addCard} />
			</div>
			<Button onClick={addCard}>Add Card</Button>
	  </main>
	);
}

export default Players;