/**
 * Variavies de estado da aplicação
 */
const DATA_URL = 'http://restcountries.eu/rest/v2/all'
let tabCountries = null
let tabFavorites = null
let allCountries = []
let favoriteCountries = []
let countCountries = 0
let countFavorites = 0

let totalPopulationList = 0
let totalPopulationFavorite = 0

let numberFormat = null

window.addEventListener('load', ()=>{
  tabCountries = document.querySelector('#tabCountries')
  tabFavorites = document.querySelector('#tabFavorites')
  countCountries = document.querySelector('#countCountries')
  countFavorites = document.querySelector('#countFavorites')
  totalPopulationFavorite = document.querySelector('#totalPopulationFavorites')
  totalPopulationList = document.querySelector('#totalPopulationList')
  numberFormat = Intl.NumberFormat('pt-BR')

  fetchCountries()
})

const fetchCountries = async () => {
  try {
    const res = await fetch(DATA_URL)
    const json = await res.json()
    allCountries = json.map(country => {
      const { numericCode, translations, capital, population, flag } = country
      return {
        id: numericCode,
        name: translations.br,
        population,
        formattedPopulation: formatNumber(population),
        capital,
        flag
      }
    })
    render()
  } catch (error) {
    console.error('ERROR: ' + error)
  }
}

const render = () => {
  renderCountryList()
  renderFavorites()
  renderSummary()
  handleCountryButtons()
}

function renderCountryList () {
  let countriesHTML = '<div>'

  allCountries.forEach(country => {
    const { name, flag, id, capital, formattedPopulation } = country
    const countryHTML = `
      <div class='country'>
        <div>
            <a id='${id}' class='waves-effect waves-light btn'>+</a>
        </div>
        <div>
        <img src='${flag}' alt='${name}'/>
        </div>
        <div>
          <ul>
            <li>${name}</br>${capital}</li>
            <li>${formattedPopulation}</li>
          </ul>
        </div>
      </div>
    `
    countriesHTML += countryHTML
  })
  countriesHTML += '</div>'
  tabCountries.innerHTML = countriesHTML
}

const renderFavorites = () => {
  let favoritesHTML = '<div>'
  favoriteCountries.forEach(country => {
    const { name, flag, id, formattedPopulation, capital } = country
    const favoriteHTML = `
      <div class='country'>
        <div>
            <a id='${id}' class='waves-effect waves-light btn red darken-4'>+</a>
        </div>
        <div>
        <img src='${flag}' alt='${name}'/>
        </div>
        <div>
          <ul>
            <li>${name}</br>${capital}</li>
            <li>${formattedPopulation}</li>
          </ul>
        </div>
      </div>
    `
    favoritesHTML += favoriteHTML
  })

  favoritesHTML += '</div>'
  tabFavorites.innerHTML = favoritesHTML
}

const renderSummary = () => {
  countCountries.textContent = allCountries.length
  countFavorites.textContent = favoriteCountries.length
  const totalPopulation = allCountries.reduce((accumulator, current) => {
    return accumulator + current.population
  }, 0)
  totalPopulationList.textContent = formatNumber(totalPopulation)

  const totalFavorites = favoriteCountries.reduce((accumulator, current) =>{
    return accumulator + current.population
  }, 0)
  totalPopulationFavorite.textContent = formatNumber(totalFavorites)
}

const handleCountryButtons = () => {
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'))
  const favoritesButtons = Array.from(tabFavorites.querySelectorAll('.btn'))

  countryButtons.forEach(button => {
    button.addEventListener('click', () => addToFavorites(button.id))
  })
  favoritesButtons.forEach(button => {
    button.addEventListener('click', () => removeFromFavorites(button.id))
  })
}

const addToFavorites = (id) => {
  const countryToAdd = allCountries.find(country => country.id === id)
  favoriteCountries = [...favoriteCountries, countryToAdd]
  favoriteCountries.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
  allCountries = allCountries.filter(country => country.id !== id)
  render()
}

const removeFromFavorites = (id) =>{
  const countryToRemove = favoriteCountries.find(country => country.id === id)
  allCountries = [...allCountries, countryToRemove]
  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
  favoriteCountries = favoriteCountries.filter(country => country.id !== id)
  render()
}

const formatNumber = (number) => {
  return numberFormat.format(number)
}