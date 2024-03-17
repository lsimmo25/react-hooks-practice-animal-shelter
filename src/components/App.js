import React, { useState } from "react";
import Filters from "./Filters";
import PetBrowser from "./PetBrowser";

function App() {
  const [pets, setPets] = useState([]);
  const [filters, setFilters] = useState({ type: "all" });
  const [adopted, setIsAdopted] = useState(false)

  const onFindPetsClick = () => {
    let url = "http://localhost:3001/pets";
    if (filters.type !== "all") {
      url += `?type=${filters.type}`;
    }
    fetch(url)
      .then((r) => r.json())
      .then((data) => setPets(data))
      .catch((error) => console.error("Error fetching pets:", error));
  };

  const onChangeType = (e) => {
    const filteredPets = e.target.value;
    setFilters({ type: filteredPets });
  };

  const onAdoptPet = (petAdopted) => {
    fetch(`http://localhost:3001/pets/${petAdopted.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isAdopted: true }),
    })
      .then((r) => r.json())
      .then(() => {
        setPets((prevPets) => {
          return prevPets.map((pet) => {
            if (pet.id === petAdopted.id) {
              return { ...pet, isAdopted: true };
            }
            return pet;
          });
        });
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="ui container">
      <header>
        <h1 className="ui dividing header">React Animal Shelter</h1>
      </header>
      <div className="ui container">
        <div className="ui grid">
          <div className="four wide column">
            <Filters onChangeType={onChangeType} filters={filters} onFindPetsClick={onFindPetsClick} />
          </div>
          <div className="twelve wide column">
            <PetBrowser pets={pets} onAdoptPet={onAdoptPet}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
