// capture some elements from the DOM 
const form = document.querySelector('#adventure-form');
const loading = document.querySelector('#loading');
const loadingDots = document.querySelector('#loading-dots');
const validationMessage = document.querySelector('#validation-message');
let loadingTimer;

// define constants
const weatherCodes = { 0:'Clear sky'
                      , 1:'Mainly clear'
                      , 2:'Partly cloudy'
                      , 3:'Overcast'
                      , 45:'Foggy'
                      , 48:'Rime fog'
                      , 51:'Light drizzle'
                      , 53:'Drizzle'
                      , 55:'Heavy drizzle'
                      , 61:'Light rain'
                      , 63:'Rain'
                      , 65:'Heavy rain'
                      , 71:'Light snow'
                      , 73:'Snow'
                      , 75:'Heavy snow'
                      , 80:'Rain showers'
                      , 81:'Rain showers'
                      , 82:'Heavy showers'
                      , 95:'Thunderstorm' };

// define event handlers
form.addEventListener('submit', submitForm);

// start the page after the character choices have loaded
startPage();

// ----- functions -----
async function startPage() {
  await loadCharacters();

  // Select Rick Sanchez as the default character.
  // The option values are character IDs, and Rick's ID is 1.
  document.querySelector('#character-input').value = '1';

  // Load the first report automatically.
  form.dispatchEvent(new Event('submit', {
    bubbles: true,
    cancelable: true
  }));
}

// handle the form submission
async function submitForm(event) {
  event.preventDefault();
  validationMessage.textContent = '';

  // get form values
  const location = document.querySelector('#location-input').value.trim();
  const character = document.querySelector('#character-input').value.trim();
  const days = Number(document.querySelector('#days-input').value);

  // validate form values
  if (location.length < 2 || character === '' || days < 1 || days > 90) {
    validationMessage.textContent = 'Please enter a destination, choose a character, and select 1–90 days.';
    return;
  }

  loading.classList.add('visible');
  startLoadingAnimation();
  document.querySelector('#report-title').textContent = location;

  // fetch data
  try {
    const geo = await getCoordinates(location);
    const characterData = await getCharacter(character);
    const identity = await getIdentity();
    const quakes = await getEarthquakes(geo.latitude, geo.longitude, days);

    await renderWeather(geo);
    renderCharacter(characterData);
    renderEarthquakes(quakes, days);
    renderIdentity(identity);

    const reportTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    document.querySelector('#report-time').textContent = `REPORT GENERATED ${reportTime}`;
  } catch (error) {
    validationMessage.textContent = `We lost the signal: ${error.message} Please try again.`;
  } finally {
    stopLoadingAnimation();
    loading.classList.remove('visible');
  }
}

// get the characters from the API and add them to the drop-down menu
async function loadCharacters() {
  // https://rickandmortyapi.com/documentation/#get-all-characters
  const characterSelect = document.querySelector('#character-input');
  const characterURL = 'https://rickandmortyapi.com/api/character';

  try {
    //NOTE: This response is paginated. For simplicity we are only loading the first page, 20 characters.
    const response = await fetch(characterURL);

    if (!response.ok) {
      throw new Error('character list could not be loaded.');
    }

    const data = await response.json();

    characterSelect.innerHTML = '';

    for (let i = 0; i < data.results.length; i++) {
      const character = data.results[i];
      const option = document.createElement('option');

      option.value = character.id;
      option.textContent = character.name;

      if (character.name === 'Rick Sanchez') {
        option.selected = true;
      }

      characterSelect.appendChild(option);
    }

    characterSelect.disabled = false;
  } catch (error) {
    characterSelect.innerHTML = '<option value="">Characters unavailable</option>';
    validationMessage.textContent = error.message;
  }
}

// get coordinates for a location
async function getCoordinates(place) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1&language=en&format=json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('location lookup failed.');
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('that destination was not found.');
  }

  return data.results[0];
}

// get character data
async function getCharacter(id) {
  const url = `https://rickandmortyapi.com/api/character/${encodeURIComponent(id)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('no matching character was found.');
  }

  const data = await response.json();
  return data;
}

// get identity data
async function getIdentity() {
  const response = await fetch('https://fakerapi.it/api/v2/persons?_quantity=1');

  if (!response.ok) {
    throw new Error('identity generator is unavailable.');
  }

  const data = await response.json();
  return data.data[0];
}

// get earthquake data
async function getEarthquakes(latitude, longitude, days) {
  const end = new Date();
  const start = new Date(end.getTime() - days * 86400000);

  const params = new URLSearchParams({
    format: 'geojson',
    latitude: latitude,
    longitude: longitude,
    maxradiuskm: '500',
    starttime: start.toISOString(),
    endtime: end.toISOString(),
    minmagnitude: '2.5',
    orderby: 'time',
    limit: '6'
  });

  const response = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?${params}`);

  if (!response.ok) {
    throw new Error('seismic data is unavailable.');
  }

  return response.json();
}

// render weather data
async function renderWeather(geo) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;
  const response = await fetch(url);
  const data = await response.json();
  const current = data.current;

  let weatherDescription = weatherCodes[current.weather_code];
  if (!weatherDescription) {
    weatherDescription = 'Changing skies';
  }

  document.querySelector('#temperature').textContent = `${Math.round(current.temperature_2m)}°`;
  document.querySelector('#weather-label').textContent = weatherDescription;
  document.querySelector('#coordinates').textContent = `${geo.name}, ${geo.country_code} · ${geo.latitude.toFixed(2)}°, ${geo.longitude.toFixed(2)}°`;
  document.querySelector('#wind').textContent = `${Math.round(current.wind_speed_10m)} mph`;
  document.querySelector('#humidity').textContent = `${current.relative_humidity_2m}%`;
  document.querySelector('#local-time').textContent = current.time.split('T')[1];
}

// render character data
function renderCharacter(character) {
  document.querySelector('#character-content').innerHTML = `
    <img src="${character.image}" alt="Portrait of ${character.name}">
    <div>
      <h3>${character.name}</h3>
      <p class="muted">${character.origin.name}</p>
    </div>`;

  document.querySelector('#character-meta').innerHTML = `
    <span>${character.status.toUpperCase()}</span>
    <span>${character.species.toUpperCase()}</span>
    <span>${character.gender.toUpperCase()}</span>`;
}

// render earthquake data
function renderEarthquakes(data, days) {
  document.querySelector('#quake-count').textContent = data.metadata.count;
  document.querySelector('#quake-window').textContent = days;

  const quakeList = document.querySelector('#quake-list');

  if (data.features.length === 0) {
    quakeList.innerHTML = '<p class="muted">No significant earthquakes found nearby.</p>';
    return;
  }

  let quakeHTML = '';
  const earthquakesToShow = data.features.slice(0, 4);

  for (let i = 0; i < earthquakesToShow.length; i++) {
    const quake = earthquakesToShow[i];
    quakeHTML += `
      <div class="quake-item">
        <strong>M ${quake.properties.mag.toFixed(1)}</strong>
        <span>${quake.properties.place}</span>
        <time>${formatDate(new Date(quake.properties.time))}</time>
      </div>`;
  }

  quakeList.innerHTML = quakeHTML;
}

// render identity data
function renderIdentity(person) {
  document.querySelector('#identity-name').textContent = `${person.firstname} ${person.lastname}`;
  document.querySelector('#identity-details').textContent = `${person.gender.toUpperCase()} · ${person.birthday} · ${person.address.city}, ${person.address.country}`;
}

// show zero, one, two, and three dots while the APIs are working
function startLoadingAnimation() {
  let numberOfDots = 0;
  loadingDots.textContent = '';

  loadingTimer = setInterval(function () {
    numberOfDots = numberOfDots + 1;

    if (numberOfDots > 3) {
      numberOfDots = 0;
    }

    loadingDots.textContent = '.'.repeat(numberOfDots);
  }, 500);
}

function stopLoadingAnimation() {
  clearInterval(loadingTimer);
  loadingDots.textContent = '';
}

// format a date
function formatDate(date) {
  return date.toLocaleDateString(undefined, { month:'short', day:'numeric' });
}
