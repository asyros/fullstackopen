import { useEffect, useState } from "react";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then((data) => {
        setPersons(data);
      })
      .catch((error) => {
        alert("Failed to fetch persons from server");
      });
  }, []);

  const addPerson = (e) => {
    e.preventDefault();
    const alreadyInContacts = persons.find((p) => p.name === newName);
    const phoneNumberUpdate =
      alreadyInContacts && newNumber !== alreadyInContacts.number;
    if (phoneNumberUpdate) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        updatePerson({ ...alreadyInContacts, number: newNumber });
      }
    } else if (alreadyInContacts && !phoneNumberUpdate) {
      alert(`${newName} is already added to phonebook`);
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };
      personService.create(newPerson).then((res) => {
        setPersons(persons.concat({ ...newPerson, id: res.id }));
        setNewName("");
        setNewNumber("");
        setNotificationMessage(`Added ${newName}`);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
        if (errorMessage) {
          setErrorMessage(null);
        }
      });
    }
  };

  const deletePerson = (id) => {
    const personToDelete = persons.filter((person) => person.id == id);
    if (personToDelete) {
      personService.deletePerson(id);
      setPersons(persons.filter((person) => person.id != id));
    }
  };

  const updatePerson = ({ name, id, number }) => {
    const personToUpdate = persons.filter((person) => person.id == id);
    if (personToUpdate) {
      personService
        .update(id, { name, number })
        .then((res) => {
          setPersons(persons.map((person) => (person.id == id ? res : person)));
          setNotificationMessage(`Updated ${newName}'s number`);
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
          if (errorMessage) {
            setErrorMessage(null);
          }
        })
        .catch((error) => {
          if (error.response.status == 404) {
            setErrorMessage(
              `Information of ${name} has already been removed from the server`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
            setPersons(persons.filter((person) => person.id != id));
          }
        });
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

  const displayPersons = ({ name, number, id }) => {
    return (
      <p key={name}>
        {name} {number} <button onClick={() => deletePerson(id)}>delete</button>
      </p>
    );
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        errorMessage={errorMessage}
        notificationMessage={notificationMessage}
      />
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

const Notification = ({ errorMessage, notificationMessage }) => {
  const errorStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  const notificationStyle = {
    ...errorStyle,
    color: "green",
  };

  const message = notificationMessage || errorMessage;
  const style = notificationMessage ? notificationStyle : errorStyle;

  if (message) {
    return <div style={style}>{message}</div>;
  }
};
