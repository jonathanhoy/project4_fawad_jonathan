const app = {};
app.appName = 'UDash'
// UNSPLASH
app.unsplashClientID = '312de5ede65d57c255d22fc5a82552c05c3dc0fde821f66cfe2bef2ad716f8af';
app.unsplashUrl = `https://api.unsplash.com/photos/random/?client_id=${app.unsplashClientID}`;
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

app.displayPhotoResults = (res) => {
  $('.unsplash-images').empty();
  console.log(res);
  let results='';
  for(let i = 0; i < res.length; i++){
    results += `<img class="unsplash-image" src="${res[i].urls.small}" alt="${res[i].description}" 
    data-url="${res[i].urls.full}" data-download-url="${res[i].links.download}" data-tracking="${res[i].links.download_location}"
    data-creator-url="${res[i].user.links.html}" data-creator-name="${res[i].user.name}" 
    data-creator-pic="${res[i].user.profile_image.large}" data-index="${i}">`;
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

app.unsplashModal = () =>{
  let downloadURLTracking='';
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
    const downloadButton = `<a href="${downloadURL}?force=download"><button class="download"><i class="fas fa-download fa-btn"></i><span class="visually-hidden">Download Button</span></button></a>`;
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

  $('.close-btn').on('click', function () {
    $('.image-modal').css('display', 'none');
  });

  $('.download').on('click', function () {
    console.log(downloadURLTracking);
    app.downloadTrigger(downloadURLTracking);
  });

}


// WEATHER BIT API

app.weatherBitApiKey = '31c8603c22634ebeab1e5b95384a3b2d';
app.getCurrWeatherUrl = ' http://api.weatherbit.io/v2.0/current';
app.getForecastWeatherUrl = ' http://api.weatherbit.io/v2.0/forecast/daily';

app.callCurrWeather = () => {
  $.ajax({
    url: app.getCurrWeatherUrl,
    dataType: 'JSON',
    method: 'GET',
    data: {
      key: app.weatherBitApiKey,
      ip: 'auto'
    }
  }).then((res) => {
    console.log(res);
    app.displayCurrWeather(res);
  })
}

app.displayCurrWeather = (res) => {
  const currentWeather = Math.floor(res.data[0].temp);
  const city = res.data[0].city_name;
  const icon = res.data[0].weather.icon;
  $('.weather-container').append(`
    <p class="weather-city">${city}</p>
    <p class="weather-current">${currentWeather}</p>
    <img src="../assets/${icon}.png">
  `);
}

// app.callForecast = () => {
//   $.ajax({
//     url: app.getForecastWeatherUrl,
//     dataType: 'JSON',
//     method: 'GET',
//     data: {
//       key: app.weatherBitApiKey,
//       ip: 'auto'
//     }
//   }).then((res) => {
//     console.log(res)
//     app.displayForecast(res);
//   })
// }

// app.displayForecast = (res) => {
//   const high = Math.floor(res.data[0].max_temp);
//   const low = Math.floor(res.data[0].min_temp);
//   $('.weather-container').append(`
//     <p class="weather-high"> H ${high}</p>
//     <p class="weather-low"> L ${low}</p>
//   `);
// }

// DATE AND TIME
// credit: https://tecadmin.net/get-current-date-time-javascript/
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
    let minutes = `${today.getMinutes()}`;
    minutes = app.checkTime(minutes);
    let currentTime = `${hours}:${minutes}`;
    $('.time-container').empty();
    $('.time-container').append(`<p class="time">${currentTime} ${timeOfDay}</p>`);
  }, 1000);
}

// credit: https://www.w3schools.com/js/tryit.asp?filename=tryjs_timing_clock
app.checkTime = (i) => {
  if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
  return i;
}

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



// NEWS API
app.newsApiKey = 'b66771502bb047dbb8d6dd42c9d0b1b1';

app.getNews = $.ajax({
  url: `https://newsapi.org/v2/top-headlines`,
  dataType: 'JSON',
  method: 'GET',
  data: {
    apiKey: app.newsApiKey,
    country: 'ca',
    pageSize: 5
  }
});

app.getHackerNews = $.ajax({
  url: `https://newsapi.org/v2/top-headlines`,
  dataType: 'JSON',
  method: 'GET',
  data: {
    apiKey: app.newsApiKey,
    sources: 'hacker-news',
    pageSize: 5
  }
});

$.when(app.getNews, app.getHackerNews)
  .then((res1, res2) => {
    // app.displayNewsResults(res1); // NEWS CURRENTLY DISABLED.
    // app.displayNewsResults(res2); // NEWS CURRENTLY DISABLED.
  })
  .fail((err1, err2) => {
    console.log(err1, err2);
  });



app.displayNewsResults = (res) => {
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



// NEW YORK TIMES

app.nytApiKey = `api-key=b6adbb67b7d9458997ba0b2b5bed2846`;

app.getNyt = (category) => {
  $.ajax({
    url: `https://api.nytimes.com/svc/topstories/v2/${category}.json?${app.nytApiKey}`,
    method: 'GET'
  }).then((res) => {
    // console.log(res.results)
    app.displayNytArticles(res);
  });
}

app.displayNytArticles = (res) => {
  $('.news').empty();
  for (let i = 0; i < res.results.length; i++) {
    if (res.results[i].multimedia.length != 0) {
      $('.news').append(`
        <div class="news-container animated fadeIn">
          <a href="${res.results[i].url}" target="_blank"><img src="${res.results[i].multimedia[0].url}" class="news-image"></a>
          <p class="news-title"><a href="${res.results[i].url}" target="_blank" class="news-link">${res.results[i].title}</a></p>
        </div>
      `);
    }
  }
}

app.getNewCategory = () => {
  $('.news-category').on('change', function() {
    const newCategory = $(this).val();
    app.getNyt(newCategory);
  })
}




app.init = () => {
  // app.getPhotos();
  $('.unsplash-search').on('change',function (e) {
    e.preventDefault();
    console.log($('.unsplash-search').val());
    app.getPhotos($('.unsplash-search').val());
  });
  // hover on image modal
  $('.image-modal').hover(function () {
    $('.image-info').css('display', 'block');
  }, function () {
    $('.image-info').css('display', 'none');
  });

  app.callCurrWeather();
  app.callForecast();
  app.currentDate(); // Date & Time tile
  app.currentTime(); // Date & Time tile
  app.getNyt('world'); // New York Times
  app.getNewCategory(); // Updates NYT section
}

$(() => {
  app.init();
  
})