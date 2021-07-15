// create namespace object
app = {};

// define variables
app.baseURL = 'http://ws.audioscrobbler.com/2.0/';
app.apiKey = '9cc5c371e7ee279ba2c3d42a029c83a4';
app.country = '';


// make a network call to the last.fm API
app.getTopTracks = () => {
  const url = new URL(app.baseURL);
  url.search = new URLSearchParams({
    method: 'geo.gettoptracks',
    country: app.country,
    api_key: app.apiKey,
    limit: 12,
    format: 'json',
  });

  fetch(url)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(error);
      }
    })
    .then((data) => {
      const tracksArray = data.tracks.track;
      app.displayTopTracks(tracksArray);
    })
    // error handling
    .catch((error) => {
      alert('Please Enter A Real Country!');
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
    app.getTopTracks();
  });
};

// function to populate the page with the top 10 tracks
app.displayTopTracks = (listofTracks) => {
  // clear previous search results

  const ulEl = document.querySelector('ul');
  ulEl.innerHTML = '';

  // loop through each track and create an li element
  listofTracks.forEach((track) => {
    // create new li element
    const newLiElement = document.createElement('li');

    // create new header element and add tracks's name
    const newH2El = document.createElement('h2');
    newH2El.textContent = track.name;

    // add total listeners
    const newListeners = document.createElement('p');
    newListeners.textContent = track.listeners;

    const newArtist = document.createElement('p');
    newArtist.textContent = track.artist.name;

    // append to li element
    newLiElement.appendChild(newH2El);
    newLiElement.appendChild(newListeners);
    newLiElement.appendChild(newArtist);

    // append to the ul element on the page
    ulEl.appendChild(newLiElement);

    // //  get artist mbid to get photo onto the page 
    // const artistID = artist.mbid; 

    // // call GetArtistData and then retreving artist info 
    // app.getArtistData(artistID);


  });
  
};

// init function
app.init = () => {
  app.userSearch();
};

// call the init function
app.init();
