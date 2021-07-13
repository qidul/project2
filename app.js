// create namespace object
app = {};

// define variables
app.baseURL = 'http://ws.audioscrobbler.com/2.0/';
app.apiKey = '9cc5c371e7ee279ba2c3d42a029c83a4';
app.country = '';

// make a network call to the last.fm API
app.getTopArtists = () => {
  const url = new URL(app.baseURL);
  url.search = new URLSearchParams({
    method: 'geo.gettopartists',
    country: app.country,
    api_key: app.apiKey,
    limit: 10,
    format: 'json',
  });

  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const artistArray = data.topartists.artist;
      app.displayArtists(artistArray);
    });
};

// function to listen for user submission
app.userSearch = () => {
  const formEl = document.querySelector('form');

  formEl.addEventListener('submit', (event) => {
    // prevent form refresh on submission
    event.preventDefault();

    // retrieve user input
    const inputEl = document.querySelector('#search');
    app.country = inputEl.value;

    // call the network request
    app.getTopArtists();
  });
};

// function to populate the page with the top 10 artists
app.displayArtists = (listofArtists) => {
  // clear previous search results
  const ulEl = document.querySelector('ul');
  ulEl.innerHTML = '';

  // loop through each artist and create an li element
  listofArtists.forEach((artist) => {
    // create new li element
    const newLiElement = document.createElement('li');

    // create new header element and add artist's name
    const newH2El = document.createElement('h2');
    newH2El.textContent = artist.name;

    // add total listeners
    const newListeners = document.createElement('p');
    newListeners.textContent = artist.listeners;

    // append to li element
    newLiElement.appendChild(newH2El);
    newLiElement.appendChild(newListeners);

    // append to the ul element on the page
    ulEl.appendChild(newLiElement);
  });
};

// init function
app.init = () => {
  app.userSearch();
};

// call the init function
app.init();

// TO ADD:
// error handling
