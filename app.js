// create namespace object
app = {};

// define variables
app.baseURL = 'http://ws.audioscrobbler.com/2.0/';
app.apiKey = '9cc5c371e7ee279ba2c3d42a029c83a4';
app.country = '';

// create variable to track highest number of listens (this is the baseline when determining bar width later on)
app.highestListens = 0;

// make a network call to the last.fm API
app.getTopTracks = () => {
  const url = new URL(app.baseURL);
  url.search = new URLSearchParams({
    method: 'geo.gettoptracks',
    country: app.country,
    api_key: app.apiKey,
    limit: 10,
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
      app.createChart(tracksArray);
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

// function to create bar chart based on results of the API call
app.createChart = (tracksArray) => {
  // clear the container for any previous charts
  const resultsEl = document.querySelector('.results');
  resultsEl.innerHTML = '';

  // create chart title
  const title = document.createElement('h2');
  title.innerText = `Trending tracks for ${app.country}`; // to capitalize first letter

  resultsEl.prepend(title);

  // create chart container
  const chartEl = document.createElement('div');
  chartEl.classList = 'chart';

  // create label container for the chart
  const ulEl = document.createElement('ul');
  ulEl.classList = 'labels';

  // create outer SVG element to contain all the bars
  const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgEl.setAttribute('height', '600px'); // width is set in CSS

  tracksArray.forEach((track, i) => {
    // ************** LABEL *********************
    // create li element (for labelling)
    const liEl = document.createElement('li');
    liEl.classList = 'artist';

    const trackEl = document.createElement('p');
    trackEl.classList = 'song';
    trackEl.innerText = track.name;

    const artistEl = document.createElement('p');
    artistEl.innerText = track.artist.name;

    // append to li and parent ul
    liEl.appendChild(trackEl);
    liEl.appendChild(artistEl);
    ulEl.appendChild(liEl);

    // **************** BAR *******************
    // create bar element for each track
    const barEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    // update highest number of listeners (used to calculate the width of the bar later)
    const numListens = parseInt(track.listeners);
    if (numListens > app.highestListens) {
      app.highestListens = numListens;
    }

    // store number of listens as a data attribute for later retrieval
    barEl.setAttribute('data-listens', numListens);

    // set attributes for the bar:
    // position to the far left of the SVG element
    barEl.setAttribute('x', '0');
    // position vertically (top-down) according to how many bars are currently on the page
    barEl.setAttribute('y', `${i * 10 + 0.5}%`);
    // set height to a fixed 9% of the SVG height (10% - 0.5% "margin" on each side)
    barEl.setAttribute('height', '9%');
    // set width to 0 initially (will be updated later)
    barEl.setAttribute('width', '0');

    // appends bar to the outer SVG element
    svgEl.appendChild(barEl);
  });

  // add labels and SVG to the page
  chartEl.appendChild(ulEl);
  chartEl.appendChild(svgEl);
  resultsEl.appendChild(chartEl);

  // create y-axis label
  const yLabel = document.createElement('p');
  yLabel.classList = 'ylabel';
  yLabel.textContent = 'Total number of listeners';
  resultsEl.appendChild(yLabel);

  // set height of results container
  resultsEl.style.height = '100vh';

  // call function to change the width of the bars
  app.updateBars();

  // call function to scroll to results
  app.scrollToResults();
};

// function to calculate and set width of each bar
app.updateBars = () => {
  // get all current bars in the chart
  const allBars = document.querySelectorAll('rect');

  allBars.forEach((bar, i) => {
    // for each bar, retrieve the number of listens (stored as a data attribute)
    const listens = parseInt(bar.dataset.listens);

    // calculate the width as a percentage of the top 10 track with the highest number of listens
    const newWidth = (listens / app.highestListens) * 100;

    // update the bar after a delay, depending on its index number
    setTimeout(() => {
      bar.setAttribute('width', `${newWidth}%`);
    }, 100 * i);
  });

  // set highestListens tracker to 0 for the next search
  app.highestListens = 0;
};

// function to scroll to results
app.scrollToResults = () => {
  const heightInpx = window.innerHeight;

  window.scroll({ top: heightInpx, behavior: 'smooth' });
};

// init function
app.init = () => {
  app.userSearch();
};

// call the init function
app.init();

// bar chart adapted from: https://atomizedobjects.com/blog/javascript/how-to-create-svg-bar-chart-javascript/
