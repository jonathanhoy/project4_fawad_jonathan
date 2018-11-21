const app = {};

// UNSPLASH
const photoApp = {};
photoApp.clientID = '312de5ede65d57c255d22fc5a82552c05c3dc0fde821f66cfe2bef2ad716f8af';
photoApp.url = 'https://api.unsplash.com/photos/random/?client_id='+photoApp.clientID;
photoApp.getPhotos = () => {
  $.ajax({
    url: photoApp.url,
    method: 'GET',
    dataType: 'JSON',
    // data: {
    //   query: q
    // }
  }).then((res) => {
    console.log(res);
    photoApp.displayResults(res);
  });
}

photoApp.displayResults = (res) => {
  $('#photo').append(`
    <img src=${res.urls.full}>
  `);
}

photoApp.init = () => {
  photoApp.getPhotos();
}

// WEATHER API
const weatherApp = {};

weatherApp.apiKey = 'aabc3958afb1ab39dcbe55a9d3801b80';

weatherApp.getWeather = (lat = 43.6532, lng = -79.3832) => {
  $.ajax({
    url: `https://api.darksky.net/forecast/${weatherApp.apiKey}/${lat},${lng}`,
    dataType: 'JSONP',
    method: 'GET',
    data: {
      units: 'ca'
    }
  }).then((res) => {
    console.log(res);
    weatherApp.displayResults(res);
  })
}

weatherApp.displayResults = (res) => {
  const degrees = ` &#176;C`
  const currentTemp = Math.floor(res.currently.temperature);
  const dailyHighTemp = Math.floor(res.daily.data[0].temperatureHigh);
  const dailyLowTemp = Math.floor(res.daily.data[0].temperatureLow);
  const dailySummary = res.daily.data[0].summary;
  $('#weather').append(`
    <h2>Weather</h2>
    <div class="weather">
      <p>Current Weather: ${currentTemp}${degrees}</p>
      <p>Today's High:  ${dailyHighTemp}${degrees}</p>
      <p>Today's Low:  ${dailyLowTemp}${degrees}</p>
      <p>${dailySummary}</p>
    </div>
  `);
}

weatherApp.getCoordinates = () => {
  navigator.geolocation.getCurrentPosition(function(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    weatherApp.getWeather(lat, lng);
  });
}

weatherApp.init = () => {
  weatherApp.getCoordinates();
}

// NEWS API - TWO PROMISES
const newsApp = {};

newsApp.apiKey = 'b66771502bb047dbb8d6dd42c9d0b1b1';

newsApp.getNews = $.ajax({
  url: `https://newsapi.org/v2/top-headlines`,
  dataType: 'JSON',
  method: 'GET',
  data: {
    apiKey: newsApp.apiKey,
    country: 'ca',
    pageSize: 5
  }
});

newsApp.getHackerNews = $.ajax({
  url: `https://newsapi.org/v2/top-headlines`,
  dataType: 'JSON',
  method: 'GET',
  data: {
    apiKey: newsApp.apiKey,
    sources: 'hacker-news',
    pageSize: 5
  }
});

$.when(newsApp.getNews, newsApp.getHackerNews)
  .then((res1, res2) => {
    newsApp.displayResults(res1);
    newsApp.displayResults(res2);
  })
  .fail((err1, err2) => {
    console.log(err1, err2);
  });



newsApp.displayResults = (res) => {
  const articles = res[0].articles
  articles.forEach((article) => {
    $(`#news`).append(`
      <div class="article">
        <h3>${article.title}</h3>
        <a href="${article.url}" target="_blank">${article.source.name}</a>
      </div>
    `);
  })
}

newsApp.init = () => {

}

app.init = () => {
  photoApp.init();
  weatherApp.init();
  newsApp.init();
}

$(() => {
  app.init();
})