const axios = require('axios');
const grabity = require('grabity');
const noImage =
  'https://smithssanitationsupply.ca/wp-content/uploads/2018/06/noimage-1.png';
const articleUrl = 'https://hacker-news.firebaseio.com/v0/item/';
const redirectUrl = 'https://news.ycombinator.com/item?id=';
const noDescription = 'No Description';
const pdfDescription = 'This article is a PDF file';

module.exports.getArticles = async (req, res) => {
  const newArticlesUrl =
    'https://hacker-news.firebaseio.com/v0/newstories.json';

  let articles = await axios.get(newArticlesUrl);
  let result = [];
  let { page } = req.query;

  let size = page * 60 + 60 > 500 ? 500 : page * 60 + 60;

  if (page * 60 > 500) res.json(result);
  else if (req.query.type === 'even') {
    for (let i = page * 60; i < size; i++) {
      if (i % 2 !== 0) {
        result.push(articles.data[i]);
      }
    }
    res.json(result);
  } else {
    for (let i = page * 60; i < size; i++) {
      if (i % 2 === 0) {
        result.push(articles.data[i]);
      }
    }
    res.json(result);
  }
};

module.exports.getArticleDetail = async (req, res) => {
  let { data } = await axios.get(`${articleUrl}${req.params.id}.json`);
  if (data && data.url) {
    if (data.url.slice(-3) === 'pdf') {
      data.image = 'pdf';
      data.description = pdfDescription;
    } else {
      try {
        let meta = await grabity.grabIt(data.url);
        data.image = meta.image || noImage;
        data.description = meta.description;
      } catch (error) {
        data.image = noImage;
        data.description = noDescription;
      }
    }
  } else {
    if (data) {
      data.url = `${redirectUrl}${data.id}`;
      data.image = noImage;
      data.description = noDescription;
    } else {
      data = {};
      data.url = '';
      data.title = '';
      data.image = noImage;
      data.description = noDescription;
    }
  }

  res.json(data);
};
