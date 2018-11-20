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
    sources: 'hacker-news'
  }
});

$.when(newsApp.getNews, newsApp.getHackerNews)
  .then((...res) => {
    console.log(res);
  })
  .fail((err1, err2) => {
    console.log(err1, err2);
  });



// newsApp.displayResults = (res) => {
//   $('#news').append(`
//     <h2>News</h2>
//   `);
//   res.forEach((article) => {
//     $('#news').append(`
//       <div class="article">
//         <h3>${article.title}</h3>
//         <a href="${article.url}" target="_blank">${article.source.name}</a>
//       </div>
//     `);
//   })
// }

newsApp.init = () => {
  newsApp.getNews();
  newsApp.getHackerNews();
}