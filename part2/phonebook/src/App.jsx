import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-1234567" },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const addPerson = (e) => {
    e.preventDefault();
    const alreadyInContacts = persons.find((p) => p.name === newName);
    if (alreadyInContacts) {
      alert(`${newName} is already added to phonebook`);
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };
      setPersons(persons.concat(newPerson));
      setNewName("");
      setNewNumber("");
    }
  };

  const handleNameInput = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberInput = (e) => {
    setNewNumber(e.target.value);
  };

  const handleSearchFilterInput = (e) => {
    setSearchFilter(e.target.value);
    if (e.target.value == "") {
      setFilterActive(false);
    } else {
      setFilterActive(true);
    }
  };

  const displayPersons = ({ name, number }) => {
    return (
      <p key={name}>
        {name} {number}
      </p>
    );
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        searchFilter={searchFilter}
        handleSearchFilterInput={handleSearchFilterInput}
      />
      <h3>Add a new </h3>
      <PersonForm
        newName={newName}
        handleNameInput={handleNameInput}
        newNumber={newNumber}
        handleNumberInput={handleNumberInput}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
      <Persons
        filterActive={filterActive}
        persons={persons}
        searchFilter={searchFilter}
        displayPersons={displayPersons}
      />
    </div>
  );
};

const Filter = ({ searchFilter, handleSearchFilterInput }) => (
  <div>
    filter shown with
    <input value={searchFilter} onChange={handleSearchFilterInput} />
  </div>
);

const PersonForm = ({
  newName,
  handleNameInput,
  newNumber,
  handleNumberInput,
  addPerson,
}) => (
  <form>
    <div>
      name: <input value={newName} onChange={handleNameInput} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberInput} />
    </div>
    <div>
      <button type="submit" onClick={addPerson}>
        add
      </button>
    </div>
  </form>
);

const Persons = ({ filterActive, persons, searchFilter, displayPersons }) => {
  if (filterActive) {
    return persons
      .filter((person) =>
        person.name.toLowerCase().includes(searchFilter.toLowerCase())
      )
      .map(displayPersons);
  } else {
    return persons.map(displayPersons);
  }
};
export default App;
