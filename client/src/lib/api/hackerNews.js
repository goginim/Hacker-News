import axios from 'axios';

export const getArticles = () => {
  return axios.get('/api/articles');
};

export const getArticleDetail = articleId => {
  return axios.get(`/api/articles/${articleId}`);
};
