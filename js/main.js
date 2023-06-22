// Global variables
let characters = []
let charObject
const people = {}
const planets = {}
const species = {}
const vehicles = {}
const starships = {}
let currentPage = 1

//
//
//...........MODEL............
//
//

import { fetchCharacters } from "./swapi.js"
import { fetchPlanet } from "./swapi.js"
import { fetchSpecies } from "./swapi.js"
import { fetchVehicles } from "./swapi.js"
import { fetchStarships } from "./swapi.js"

// Initial state - Fetches and saves the first 10 characters
async function initState(page = 1) {
  characters = await fetchCharacters(page)
  hideListPreloader()
  people[page] = characters
  renderCharList()
}

// Checks and saves characters data
async function getCharacters(page) {
  const planetDetailsCon = document.querySelector(".details .planet-details")
  try {
    if (people[page]) {
      characters = people[page]
    } else {
      characters = await fetchCharacters(page)
      people[page] = characters
    }
    return characters
  } catch (error) {
    planetDetailsCon.innerHTML = `<p>Looks like there was a problem, ${error}</p>`
  }
}

//Checks and saves current characters planet/species/vehicles/starships
async function getCurrentData(
  urlNumber,
  object,
  fetchData,
  renderData,
  template
) {
  const planetDetailsCon = document.querySelector(".details .planet-details")
  try {
    if (object[urlNumber]) {
      renderData(object[urlNumber], template)
    } else {
      const currentData = await fetchData(urlNumber)
      object[urlNumber] = currentData
      renderData(currentData, template)
    }
  } catch (error) {
    planetDetailsCon.innerHTML = `<p>Looks like there was a problem, ${error}</p>`
  }
}

//
//
//..........CONTROLLES...........
//
//

//
async function nextPage() {
  currentPage++
  characters = await getCharacters(currentPage)
  renderCharList()
}

// Splits homeworld URL in order to get planet number
function splitPlanetUrl(url) {
  if (url) {
    const temp = url.split("/")
    const planetNb = temp[temp.length - 2]
    return planetNb
  } else {
    planetDetailsCon.innerHTML = "<p>No planet available</p>"
  }
}

// Splits species / vehicles / starships URL in order to get numbers
function splitUrlArray(urlArr) {
  let number
  let currentNumbers = []
  if (urlArr.length > 0) {
    for (let url of urlArr) {
      const temp = url.split("/")
      number = temp[temp.length - 2]
      currentNumbers.push(number)
    }
  }
  return currentNumbers
}

// InitActions - click listeners
function initActions() {
  const ul = document.querySelector("ul.characters")
  const nextArrow = document.querySelector(".arrows .next")
  const previousArrow = document.querySelector(".arrows .previous")
  const planetDetailsCon = document.querySelector(".details .planet-details")
  const planetBtn = document.querySelector(".buttons .planet")
  const speciesBtn = document.querySelector(".buttons .species")
  const vehiclesBtn = document.querySelector(".buttons .vehicles")
  const starshipsBtn = document.querySelector(".buttons .starships")
  const headingsAll = planetDetailsCon.querySelectorAll("h4")

  nextArrow.addEventListener("click", () => {
    ul.innerHTML = ""
    previousArrow.style.display = "block"
    showListPrelaoder()
    deactivateButtons()
    emptyDetailsCon()
    nextPage()
    hideListPreloader()
    renderPageNumber()
  })

  previousArrow.addEventListener("click", () => {
    ul.innerHTML = ""
    nextArrow.style.display = "block"
    currentPage--
    showListPrelaoder()
    deactivateButtons()
    emptyDetailsCon()
    characters = people[currentPage]
    renderCharList(characters)
    hideListPreloader()
    renderPageNumber()
  })

  ul.addEventListener("click", (event) => {
    renderDetailsPreloader()
    deactivateButtons()
    getCharAndPlanetDetails(event)
  })

  planetBtn.addEventListener("click", () => {
    planetDetailsCon.innerHTML = ""
    renderPlanetPrelaoder()
    getCurrentData(
      splitPlanetUrl(charObject.homeworld),
      planets,
      fetchPlanet,
      renderCurrentData,
      getPlanetTemplate
    )
    hidePlanetPreloader()
    activateBtn(planetBtn)
  })

  speciesBtn.addEventListener("click", () => {
    planetDetailsCon.innerHTML = ""
    renderPlanetPrelaoder()
    const currentSpecies = splitUrlArray(charObject.species)
    if (currentSpecies.length == 0) {
      planetDetailsCon.innerHTML += "<p>No species available</p>"
    } else {
      for (let speciesNb of currentSpecies) {
        getCurrentData(
          speciesNb,
          species,
          fetchSpecies,
          renderCurrentData,
          getSpeciesTemplate
        )
      }
    }
    hidePlanetPreloader()
    activateBtn(speciesBtn)
  })

  vehiclesBtn.addEventListener("click", () => {
    planetDetailsCon.innerHTML = ""
    renderPlanetPrelaoder()
    const currentVehicles = splitUrlArray(charObject.vehicles)
    if (currentVehicles.length == 0) {
      planetDetailsCon.innerHTML += "<p>No vehicles available</p>"
    } else if (currentVehicles.length > 1) {
      for (let vehicle of currentVehicles) {
        getCurrentData(
          vehicle,
          vehicles,
          fetchVehicles,
          renderVehiclesData,
          getNamesTemplate
        )
      }
    } else {
      for (let vehicle of currentVehicles) {
        getCurrentData(
          vehicle,
          vehicles,
          fetchVehicles,
          renderCurrentData,
          getVehiclesTemplate
        )
      }
    }
    hidePlanetPreloader()
    activateBtn(vehiclesBtn)
  })

  starshipsBtn.addEventListener("click", () => {
    planetDetailsCon.innerHTML = ""
    renderPlanetPrelaoder()
    const currentSshps = splitUrlArray(charObject.starships)
    if (currentSshps.length == 0) {
      planetDetailsCon.innerHTML += "<p>No starships available</p>"
    } else if (currentSshps.length > 1) {
      //NEW
      for (let starShp of currentSshps) {
        getCurrentData(
          starShp,
          starships,
          fetchStarships,
          renderStarshipsData,
          getNamesTemplate
        )
      }
    } else {
      for (let starShp of currentSshps) {
        getCurrentData(
          starShp,
          starships,
          fetchStarships,
          renderCurrentData,
          getVehiclesTemplate
        )
      }
    }
    hidePlanetPreloader()
    activateBtn(starshipsBtn)
  })
}

//
//
// ............VIEW............
//
//

// Renders characters list in the DOM
function renderCharList() {
  for (let char of characters) {
    const ul = document.querySelector("ul.characters")
    const li = document.createElement("li")
    li.innerText = `${char.name}`
    ul.append(li)
  }
}

function emptyDetailsCon() {
  const charDetailsCon = document.querySelector(".details .char-details")
  const planetDetailsCon = document.querySelector(".details .planet-details")
  charDetailsCon.innerHTML = ""
  planetDetailsCon.innerHTML = ""
}

// Efter user interaction renders the details of the choosen character
// and its planet in the DOM
function getCharAndPlanetDetails(event) {
  const charDetailsCon = document.querySelector(".details .char-details")
  const planetBtn = document.querySelector(".buttons .planet")
  if (event.target.tagName === "LI") {
    const charName = event.target.innerText
    charObject = characters.find((character) => character.name === charName)
    charDetailsCon.innerHTML = getCharacterTemplate(charObject)
    getCurrentData(
      splitPlanetUrl(charObject.homeworld),
      planets,
      fetchPlanet,
      renderCurrentData,
      getPlanetTemplate
    )
    hidePlanetPreloader()
    activateBtn(planetBtn)
  }
}

// Creates a HTML template for the character details
function getCharacterTemplate(object) {
  return `
  <h3><strong>${object.name}</strong></h3>
  <p>Height: ${object.height}cm</p>
  <p>Mass: ${object.mass}kg</p>
  <p>Hair color: ${object.hair_color}</p>
  <p>Skin color: ${object.skin_color}</p>
  <p>Eye color: ${object.eye_color}</p>
  <p>Birth year: ${object.birth_year}</p>
  <p>Gender: ${object.gender}</p>
  `
}
// Creates a HTML template for the planet details
function getPlanetTemplate(object) {
  return `
    <h3><strong>${object.name}</strong></h3>
    <p>Rotation period: ${object.rotation_period}h</p>
    <p>Orbital period: ${object.orbital_period}days</p>
    <p>Diameter: ${object.diameter}km</p>
    <p>Climate: ${object.climate}</p>
    <p>Gravity: ${object.gravity}</p>
    <p>Terrain: ${object.terrain}</p>
    `
}
// Creates a HTML template for the species details
function getSpeciesTemplate(object) {
  return `
    <h3><strong>${object.name}</strong></h3>
    <p>Classification: ${object.classification}</p>
    <p>Designation: ${object.designation}</p>
    <p>Average height: ${object.average_height}</p>
    <p>Skin colors: ${object.skin_colors}</p>
    <p>Hair colors: ${object.hair_colors}</p>
    <p>Eye colors: ${object.eye_colors}</p>
    <p>Average lifespan: ${object.average_lifespan}</p>
    `
}

// Creates a template for the buttons
function getNamesTemplate(object) {
  return `<button class="choice">${object.name}</button>`
}

// Creates a HTML template for the vehicles and the starships details.
// Vehicles and starships have the same key/value pairs
function getVehiclesTemplate(object) {
  return `
    <h3><strong>${object.name}</strong></h3>
    <p>Model: ${object.model}</p>
    <p>Manufacturer: ${object.manufacturer}</p>
    <p>Cost_in_credits: ${object.cost_in_credits}</p>
    <p>Max_atmosphering_speed : ${object.max_atmosphering_speed}</p>
    <p>Crew: ${object.crew}</p>
    <p>Passengers: ${object.passengers}</p>
    `
}

// Renders current planet/species details in the DOM
function renderCurrentData(object, template) {
  const planetDetailsCon = document.querySelector(".details .planet-details")
  planetDetailsCon.innerHTML += template(object)
}

// Renders current vehicles buttons in the DOM
function renderVehiclesData(object, template) {
  const planetDetailsCon = document.querySelector(".details .planet-details")
  planetDetailsCon.innerHTML += template(object)
  let choiceBtns = document.querySelectorAll("button.choice")
  for (let button of choiceBtns) {
    button.addEventListener("click", (event) => {
      let choice = ""
      choice = event.target.innerText
      renderNextVehicle(vehicles, choice)
    })
  }
}

// Renders current starships buttons in the DOM
function renderStarshipsData(object, template) {
  const planetDetailsCon = document.querySelector(".details .planet-details")
  planetDetailsCon.innerHTML += template(object)
  let choiceBtns = document.querySelectorAll("button.choice")
  for (let button of choiceBtns) {
    button.addEventListener("click", (event) => {
      let choice = ""
      choice = event.target.innerText
      renderNextStarship(starships, choice)
    })
  }
}

// Renders next vehicle after user interaction
function renderNextVehicle(vehicles, currentName) {
  const planetDetailsCon = document.querySelector(".details .planet-details")
  let currentObj = {}
  const vehiclesArr = Object.entries(vehicles)
  for (let vehicle of vehiclesArr) {
    if (
      (currentObj = vehicle.find((vehicle) => vehicle.name === currentName))
    ) {
      planetDetailsCon.innerHTML = getVehiclesTemplate(currentObj)
    }
  }
}

// Renders next starship after user interaction
function renderNextStarship(starships, currentName) {
  const planetDetailsCon = document.querySelector(".details .planet-details")
  let currentObj = {}
  const starshipArr = Object.entries(starships)
  for (let starship of starshipArr) {
    if (
      (currentObj = starship.find((starship) => starship.name === currentName))
    ) {
      planetDetailsCon.innerHTML = getVehiclesTemplate(currentObj)
    }
  }
}

function showListPrelaoder() {
  const listPreloader = document.querySelector(".preloader.char-list")
  listPreloader.style.display = "block"
}

function hideListPreloader() {
  const listPreloader = document.querySelector(".preloader.char-list")
  listPreloader.style.display = "none"
}

// Renders preloader in the details section
function renderDetailsPreloader() {
  const charDetailsCon = document.querySelector(".details .char-details")
  const planetDetailsCon = document.querySelector(".details .planet-details")
  charDetailsCon.innerHTML = `<div class="preloader char-details"></div>`
  planetDetailsCon.innerHTML = `<div class="preloader planet-details"></div>`
}

function renderPlanetPrelaoder() {
  const planetDetailsCon = document.querySelector(".details .planet-details")
  planetDetailsCon.innerHTML = `<div class="preloader planet-details"></div>`
}

function hidePlanetPreloader() {
  const planetPreloader = document.querySelector(".preloader.planet-details")
  planetPreloader.style.display = "none"
}

function renderPageNumber() {
  const nextArrow = document.querySelector(".arrows .next")
  const previousArrow = document.querySelector(".arrows .previous")
  let currentPgNum = document.querySelector(".current-page")
  currentPgNum.innerText = currentPage
  if (currentPage == 1) previousArrow.style.display = "none"
  if (currentPage == 9) nextArrow.style.display = "none"
}

// Gives different background colors to the buttons and the planet container
function activateBtn(button) {
  const planetDetailsCon = document.querySelector(".details .planet-details")
  const planetBtn = document.querySelector(".buttons .planet")
  const speciesBtn = document.querySelector(".buttons .species")
  const vehiclesBtn = document.querySelector(".buttons .vehicles")
  const starshipsBtn = document.querySelector(".buttons .starships")
  removeDisabledAttr()
  switch (button) {
    case planetBtn:
      planetBtn.classList.add("active-planet")
      planetDetailsCon.style.backgroundColor = "#8E8E8E"
      break
    case speciesBtn:
      speciesBtn.classList.add("active-species")
      planetDetailsCon.style.backgroundColor = "#7c7c7c"
      break
    case vehiclesBtn:
      vehiclesBtn.classList.add("active-vehicles")
      planetDetailsCon.style.backgroundColor = "#6e6e6e"
      break
    case starshipsBtn:
      starshipsBtn.classList.add("active-starships")
      planetDetailsCon.style.backgroundColor = "#636262"
      break
  }
}

// Removes background colors
function deactivateButtons() {
  const planetDetailsCon = document.querySelector(".details .planet-details")
  const planetBtn = document.querySelector(".buttons .planet")
  const speciesBtn = document.querySelector(".buttons .species")
  const vehiclesBtn = document.querySelector(".buttons .vehicles")
  const starshipsBtn = document.querySelector(".buttons .starships")
  setDisabledAttr()
  planetBtn.classList.remove("active-planet")
  speciesBtn.classList.remove("active-species")
  vehiclesBtn.classList.remove("active-vehicles")
  starshipsBtn.classList.remove("active-starships")
  planetDetailsCon.style.backgroundColor = "#8E8E8E"
}

// Sets disabled attribute to the buttons
function setDisabledAttr() {
  const buttons = document.querySelectorAll(".buttons .btn")
  buttons.forEach((btn) => {
    btn.setAttribute("disabled", "")
  })
}
// Removes disabled attribute from the buttons
function removeDisabledAttr() {
  const buttons = document.querySelectorAll(".buttons .btn")
  buttons.forEach((btn) => {
    btn.removeAttribute("disabled")
  })
}
//
//...........Entry Point............
//
//
function main() {
  initState()
  initActions()
}
main()
