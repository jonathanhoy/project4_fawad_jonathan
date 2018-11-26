// app object
const app = {};

//****************************UNSPLASH API****************************
app.appName = 'U-Dash'
app.unsplashClientID = '312de5ede65d57c255d22fc5a82552c05c3dc0fde821f66cfe2bef2ad716f8af';
app.unsplashUrl = `https://api.unsplash.com/photos/random/?client_id=${app.unsplashClientID}`;
// Get Random Photos with maximum count 14
app.getPhotos = (q) => {
  $.ajax({
    url: app.unsplashUrl,
    method: 'GET',
    dataType: 'JSON',
    data: {
      query: q,
      orientation: 'squarish',
      count: 14
    }
  }).then((res) => {
    app.displayPhotoResults(res);
  });
}

// Display the photos by generating img tags for the no of images pulled by the API
app.displayPhotoResults = (res) => {
  $('.unsplash-images').empty();
  let results='';
  for(let i = 0; i < res.length; i++){
    if (res[i].description != null || res[i].description != ''){
      results += `<img class="unsplash-image" src="${res[i].urls.small}" alt="${res[i].description}" 
      data-url="${res[i].urls.full}" data-download-url="${res[i].links.download}" data-tracking="${res[i].links.download_location}"
      data-creator-url="${res[i].user.links.html}" data-creator-name="${res[i].user.name}" 
      data-creator-pic="${res[i].user.profile_image.large}" data-index="${i}">`;
    }
  }
  $('.unsplash-images').append(results);
  app.unsplashModal();
}

// Keep track of downloads triggered for the artist as per the API docs 
app.downloadTrigger = (trackingLink) => {
  try {
    const unsplashDownloadTracker = fetch(trackingLink)
      .then(function (res) {
        return res.json()
      })
      .then(function (data) {
      })
  }
  catch (err) {
    console.log(err);
  }
}

// All functions related to the image modal which pops when an unsplash image is clicked
app.unsplashModal = () =>{
  let downloadURLTracking='';
  let bgURL ='';
  // When image clicked, pull the info as per the API docs and open in modal displaying the credits info
  $('.unsplash-image').on('click', function () {
    $('.image-info').empty();
    bgURL = $(this).attr('data-url');
    // information requested by unsplash API
    const downloadURL = $(this).attr('data-download-url');
    downloadURLTracking = `${$(this).attr('data-tracking')}?client_id=${app.clientID}`;
    const creatorURL = $(this).attr('data-creator-url');
    const createrName = $(this).attr('data-creator-name');
    const createrImage = $(this).attr('data-creator-pic');
    const attributionPhotoBy = `${creatorURL}?utm_source=${app.appName}&utm_medium=referral`;
    const atrributionUnsplash = `https://unsplash.com/?utm_source=y${app.appName}&utm_medium=referral`;
    const downloadButton = `<a href="${downloadURL}?force=download" class="download-btn"><button class="download"><i class="fas fa-download fa-btn"></i><span class="visually-hidden">Download Button</span></button></a>`;
    const photoBy = `
    <a class="creator" target="blank" href="${attributionPhotoBy}"><div class="display-pic"></div> ${createrName}</a>`;
    const unsplashCredit = `<a class="unsplash-credit" target="blank" href=${atrributionUnsplash}>Unsplash</a>`;
    // showing the image in a modal when clicked
    $('.image-modal').css('display', `block`);
    $('.image-modal').css('background', `url(${bgURL}) center center`);
    $('.image-modal').css('background-size', `cover`);
    // showing the creator info when image clicked
    $('.image-info').append(photoBy, unsplashCredit, downloadButton);
    $('.display-pic').css({ 'border-radius': '50%', 'background': 'url(' + createrImage + ')', 'background-size': 'cover', 'background-position': 'center', 'width': '50px', 'height': '50px', 'border': '2px solid #808080', 'margin': '0.5rem' });  
  });
  // Closes the modal 
  $('.close-btn').on('click', function () {
    $('.image-modal').css('display', 'none');
  });
  // Applies the opened image in modal as wallpaper for the dashboard
  $('.background-btn').on('click', function () {
    $('.dashboard-main').css('background', 
      `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${bgURL}') center center`);
    $('.dashboard-main').css('background-size', 'cover');
  });
  // downloads the image to the computer when clicked
  $('.download').on('click', function () {
    app.downloadTrigger(downloadURLTracking);
  });
}
//****************************UNSPLASH API****************************

//****************************WEATHER BIT API*************************
app.weatherBitApiKey = '31c8603c22634ebeab1e5b95384a3b2d';
app.getCurrWeatherUrl = ' http://api.weatherbit.io/v2.0/current';
app.getForecastWeatherUrl = ' http://api.weatherbit.io/v2.0/forecast/daily';

// Gets the current weather by passing the city
app.callCurrWeather = (city) => {
  $.ajax({
    url: app.getCurrWeatherUrl,
    dataType: 'JSON',
    method: 'GET',
    data: {
      key: app.weatherBitApiKey,
      city: city
    }
  }).then((res) => {
    app.displayCurrWeather(res);
  })
}

// Displays the weathers in Degrees Centigrade
app.degrees = `&deg;C`
app.displayCurrWeather = (res) => {
  const currentWeather = Math.floor(res.data[0].temp);
  const city = res.data[0].city_name;
  const country = res.data[0].country_code;
  const icon = res.data[0].weather.icon;
  const description = res.data[0].weather.description;
  $('.city-input').attr('placeholder', `${city}, ${country}`);
  $('.weather-container').append(`
    <p class="weather-current">${currentWeather}${app.degrees}</p>
    <img src="assets/${icon}.png" alt="${description}" class="weather-icon">
  `);
}

// Forecasts the weather
app.callForecast = (city) => {
  $.ajax({
    url: app.getForecastWeatherUrl,
    dataType: 'JSON',
    method: 'GET',
    data: {
      key: app.weatherBitApiKey,
      city: city
    }
  }).then((res) => {
    app.displayForecast(res);
  })
}

//Displays the forecast 
app.displayForecast = (res) => {
  const high = Math.floor(res.data[0].max_temp);
  const low = Math.floor(res.data[0].min_temp);
  $('.weather-container').append(`
    <p class="weather-high">H ${high}${app.degrees}</p>
    <p class="weather-low">L ${low}${app.degrees}</p>
  `);
}

// Gets the weather for the new city input by the user
app.getNewCity = () => {
  $('.weather-form').on('submit', (e) => {
    e.preventDefault();
    newCity = $('.city-input').val();
    $('.weather-container').empty();
    app.callCurrWeather(newCity);
    app.callForecast(newCity);
  })
}
//****************************WEATHER BIT API*************************

//****************************DATE AND TIME***************************
// credit: https://tecadmin.net/get-current-date-time-javascript/
// Current Time
app.currentTime = () => {
  window.setInterval(function() {
    const today = new Date();
    let hours = parseInt(today.getHours());
    let timeOfDay = 'am'
    if (hours >= 12 && hours !== 24) {
      timeOfDay = 'pm'
    }
    if (hours >= 13) {
      hours = hours - 12;
    } else if (hours === 0) {
      hours = hours + 12;
    }
    let minutes = today.getMinutes();
    minutes = app.checkTime(minutes);
    let currentTime = `${hours}:${minutes}`;
    $('.time-container').empty();
    $('.time-container').append(`<p class="time">${currentTime} ${timeOfDay}</p>`);
  }, 1000);
}

// credit: https://www.w3schools.com/js/tryit.asp?filename=tryjs_timing_clock
// Chech time to maintain 12hr format
app.checkTime = (i) => {
  if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
  return i;
}

// Current Date
app.currentDate = () => {
  const today = new Date();
  let year = `${today.getFullYear()}`;
  let currentMonth = `${today.getMonth()}`;
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let month = monthNames[currentMonth];
  let day = `${today.getDate()}`;
  let currentDate = `${month} ${day}, ${year}`;
  $('.date-container').empty();
  $('.date-container').append(`<p class="date animated fadeIn">${currentDate}</p>`);
}
//****************************DATE AND TIME***************************


//****************************TECH NEWS API***************************
// Using News API to pull tech news from various sources. Simple a source is passed to the API to get results
app.newsApiKey = 'b66771502bb047dbb8d6dd42c9d0b1b1';
// Getting tech news by passing the source. E.g. The wired is default
app.getTechNews = (source) => {
  $.ajax({
    url: `https://newsapi.org/v2/top-headlines`,
    dataType: 'JSON',
    method: 'GET',
    data: {
      apiKey: app.newsApiKey,
      sources: source
    }
  }).then((res) => {
    app.displayNewsResults(res);
  });
}
// Display the News
app.displayNewsResults = (res) => {
  $('.news-list').empty();
  for(let i = 0; i < res.articles.length; i++){
    $('.news-list').append(`
      <div class="news-container animated fadeIn">
      <p class="news-title"><a href="${res.articles[i].url}" target="_blank" class="news-link">${res.articles[i].title}</a></p>
      </div>
    `);
  }
}
//****************************TECH NEWS API***************************

//****************************NY Times API****************************
app.nytApiKey = `api-key=b6adbb67b7d9458997ba0b2b5bed2846`;
// Get top stories based on the category passed to the API. World top stories is default
app.getNyt = (category) => {
  $.ajax({
    url: `https://api.nytimes.com/svc/topstories/v2/${category}.json?${app.nytApiKey}`,
    method: 'GET'
  }).then((res) => {
    app.displayNytArticles(res);
  });
}
// Display results
app.displayNytArticles = (res) => {
  $('.news').empty();
  for (let i = 0; i < res.results.length; i++) {
    if (res.results[i].multimedia.length != 0) {
      $('.news').append(`
        <div class="news-container animated fadeIn">
          <a href="${res.results[i].url}" target="_blank"><img src="${res.results[i].multimedia[0].url}" alt="${res.results[i].multimedia[0].caption}" class="news-image"></a>
          <p class="news-title"><a href="${res.results[i].url}" target="_blank" class="news-link">${res.results[i].title}</a></p>
        </div>
      `);
    }
  }
}
// When new category is selected. Getting stories for the category selected
app.getNewCategory = () => {
  $('.news-category').on('change', function() {
    const newCategory = $(this).val();
    app.getNyt(newCategory);
  })
}
//****************************NY Times API****************************

// App init() method
app.init = () => {
  // Calling Unsplash API
  app.getPhotos();
  // images can be searched using unsplash
  $('.unsplash-search').on('change', function (e) {
    e.preventDefault();
    app.getPhotos($('.unsplash-search').val());
  });
  // When toggle is used to hide all the info on the dashboard except date, time, weather and the google bar
  $('#hide-all').change(function () {
    if ($(this.checked)) {
      $('.tech-news').toggleClass('hide'); 
      $('.unsplash').toggleClass('hide');
      $('.news-tile').toggleClass('hide');
      $('.google-bar').toggleClass('hide-mode-google');
      $('.date-time').toggleClass('hide-mode-date-time');
      $('.weather').toggleClass('hide-mode-weather');
    }
  });
  // random wallapaper for the Grid Container
  const randomWallpaper = ['wallpaper-1', 'wallpaper-2', 'wallpaper-3'];
  const randomPic = randomWallpaper[Math.floor(Math.random() * randomWallpaper.length)];
  $('.dashboard-main').css('background',
    `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('assets/${randomPic}.jpg') center center`);
  $('.dashboard-main').css('background-size','cover');
  
  // hover on image modal
  $('.image-modal').hover(function () {
    $('.image-info').css('display', 'block');
  }, function () {
    $('.image-info').css('display', 'none');
  });

  // Calling the Weather Bit API
  app.callCurrWeather('Toronto, Canada');
  app.callForecast('Toronto, Canada');
  // Weather for a different city can be checked
  app.getNewCity();

  // Date & Time
  app.currentDate(); 
  app.currentTime();

  // New York Times
  app.getNyt('world');
  // Updates NYT section
  app.getNewCategory(); 

  //Gets Tech News by default Wired
  app.getTechNews('wired');
  // When News API source is changes
  $('.btn-source').on('click', function(e){
    e.preventDefault();
    $('.tech-head').text($(this).text());
    const chosenSource = $(this).val();
    app.getTechNews(chosenSource);
  })
}

// Document Ready
$(function () {
  app.init(); 
})