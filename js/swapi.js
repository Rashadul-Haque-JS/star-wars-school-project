
export {fetchCharacters, fetchPlanet, fetchSpecies, fetchVehicles, fetchStarships}
const BASE_URL = 'https://swapi.dev/api'

// Fetches characters from SWAPI
async function fetchCharacters(page=1){
    const response = await fetch(`${BASE_URL}/people/?page=${page}`);
    const data = await response.json();
    return data.results;
}

// Fetches planets from SWAPI
async function fetchPlanet(planetNb){
    const response = await fetch(`${BASE_URL}/planets/${planetNb}/`);
    const data = await response.json();
    return data
}

// Fetches species from SWAPI
async function fetchSpecies(speciesNb){
    const response = await fetch(`${BASE_URL}/species/${speciesNb}/`);
    const data = await response.json();
    return data
}

// Fetches vehicles from SWAPI
async function fetchVehicles(vehiclesNb) {
    const response = await fetch(`${BASE_URL}/vehicles/${vehiclesNb}/`)
    const data = await response.json();
    return data
}

// Fetches starships from SWAPI
async function fetchStarships(starshipsNb) {
    const response = await fetch(`${BASE_URL}/starships/${starshipsNb}/`)
    const data = await response.json();
    return data
}