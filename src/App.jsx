import { useState } from "react";

const initialFriends = [
  {
    id: "118836",
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: "933372",
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  }, 
  {
    id: "499476",
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setshowAddFriend] = useState(false);
  const [addFriend, setAddFriend] = useState(initialFriends);
  const [selectedPerson, setSelectedPerson] = useState("");

  function handleshowAddFriend() {
    setshowAddFriend((show) => !show);
    setSelectedPerson("");
  }

  function handleAddFriend(friend) {
    setAddFriend((prev) => {
      return [...prev, friend];
    });
    handleshowAddFriend();
  }

  function handleSelection(friend) {
    setSelectedPerson((curr) => (curr.id === friend.id ? "" : friend));
    setshowAddFriend(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={addFriend}
          selected={selectedPerson}
          onSelect={handleSelection}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleshowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedPerson && (
        <FormSplitBill friends={setAddFriend} selectedPerson={selectedPerson} />
      )}
    </div>
  );
}

function FriendList({ friends, onSelect, selected }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          onSelect={onSelect}
          selected={selected}
          friend={friend}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelect, selected }) {
  const isSelected = selected.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} &#8377;{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you &#8377;{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button
        onClick={() => {
          onSelect(friend);
        }}
      >
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleName(e) {
    setName(e.target.value);
  }
  function handleImage(e) {
    setImage(e.target.value);
  }

  function handleClick(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();

    onAddFriend({ id, name: name, image: `${image}?=${id}`, balance: 0 });

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form form action="" className="from-add-friend">
      <label>🧑‍🤝‍🧑Friend Name</label>
      <input type="text" value={name} onChange={handleName} />

      <label>🌄Image URL</label>
      <input type="text" value={image} onChange={handleImage} />

      <Button onClick={handleClick}>Add</Button>
    </form>
  );
}

function FormSplitBill({ friends, selectedPerson }) {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [Payer, setPayer] = useState("you");

  function updateBalance(e) {
    e.preventDefault();
    friends((friends) => {
      return friends.filter((person) => {
        if (person.id === selectedPerson.id) {
          // person.balance = 100;
          console.log("myExpense:", myExpense)
          console.log("Balance: ", person.balance);
          console.log("bill:", bill)
          console.log(Number(person.balance) + (Number(bill) - Number(myExpense)))
          if (Payer === "you") {
            person.balance =
              Number(person.balance) + (Number(bill) - Number(myExpense));
          } else {
            person.balance = Number(person.balance) - Number(myExpense);
          }
        }
        // setBill("")
        // setMyExpense("")
        return person;
      });
    });
  }

  function handleBill(e) {
    setBill(Number(e.target.value));
  }
  function handleMyExpense(e) {
    // setMyExpense(e.target.value);
    setMyExpense(Number(e.target.value) > bill ? myExpense : Number(e.target.value));
  }

  function handlePayer(e) {
    setPayer(e.target.value);
  }

  return (
    <form action="" className="form-split-bill">
      <h2>Split a Bill with {selectedPerson.name}</h2>

      <label htmlFor="">💵 Bill Value</label>
      <input type="text" name="" id="" value={bill} onChange={handleBill} />

      <label htmlFor="">🕴️ Your expense</label>
      <input
        type="text"
        name=""
        id=""
        value={Number(myExpense)}
        onChange={handleMyExpense}
      />

      <label htmlFor="">🧑‍🤝‍🧑 {selectedPerson.name}'s expense</label>
      <input
        type="text"
        name=""
        id=""
        value={Number(bill) - Number(myExpense)}
        disabled
      />

      <label htmlFor="">🤑 Who is paying the bill?</label>
      <select name="" id="" value={Payer} onChange={handlePayer}>
        <option value="you">You</option>
        <option value={selectedPerson.name}>{selectedPerson.name}</option>
      </select>
      <Button onClick={updateBalance}> Submit </Button>
    </form>
  );
}
