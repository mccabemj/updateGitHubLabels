require('dotenv').config();

const axios = require('axios');

const config = {
  headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
};

const responseError = (err, startMsg) =>
  `${startMsg} ${
    err.response && err.response.data && err.response.data.message ? err.response.data.message : ''
  }`;

const getRepos = async url => {
  try {
    const repos = await axios.get(url, config);

    const { link } = repos.headers;
    let nextUrl = null;
    if (link) {
      const theNext = link.split(',').filter(x => x.includes('rel="next"'));
      if (theNext.length > 0) {
        nextUrl = theNext[0].replace('<', '').replace('>; rel="next"', '');
      }
    }

    return {
      urls: repos.data.map(x => x.url),
      nextUrl
    };
  } catch (err) {
    throw Error(responseError(err, `Unable to get list of Repos from GitHub`));
  }
};

const getLabelsForRepo = async url => {
  try {
    const labels = await axios.get(`${url}/labels`, config);

    return labels.data.map(x => x.url);
  } catch (err) {
    throw Error(responseError(err, `Unable to get list of labels from Repo ${url}`));
  }
};

const addLabel = async (repoUrl, data) => {
  try {
    await axios.post(`${repoUrl}/labels`, data, config);

    return `added label ${data.name} with color ${data.color} to URL ${repoUrl}`;
  } catch (err) {
    throw Error(responseError(err, `Unable to get list of labels from Repo ${repoUrl}`));
  }
};

const deleteLabel = async url => {
  try {
    await axios.delete(`${url}`, config);

    return `deleted label with URL ${url}`;
  } catch (err) {
    throw Error(responseError(err, `Unable to delete label from URL ${url}`));
  }
};

module.exports = {
  addLabel,
  deleteLabel,
  getLabelsForRepo,
  getRepos
};
