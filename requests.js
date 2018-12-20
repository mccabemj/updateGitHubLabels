require('dotenv').config();

const axios = require('axios');

const config = {
  headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
};

module.exports = {
  addLabel: async (repoUrl, data) => {
    try {
      await axios.post(`${repoUrl}/labels`, data, config);

      console.log(`added label ${data.name} with color ${data.color} to URL ${repoUrl}`);
    } catch (err) {
      console.log(`Unable to get list of labels from Repo ${repoUrl}`);
      throw Error(err);
    }
  },

  deleteLabel: async url => {
    try {
      await axios.delete(`${url}`, config);

      console.log(`deleted label with URL ${url}`);
      return await [];
    } catch (err) {
      console.log(`Unable to get list of labels from Repo ${url}`);
      throw Error(err);
    }
  },

  getLabelsForRepo: async url => {
    try {
      const labels = await axios.get(`${url}/labels`, config);

      return labels.data.map(x => x.url);
    } catch (err) {
      console.log(`Unable to get list of labels from Repo ${url}`);
      throw Error(err);
    }
  },

  getRepos: async () => {
    try {
      const repos = await axios.get(
        `https://api.github.com/orgs/${process.env.ORG_NAME}/repos`,
        config
      );

      return repos.data.map(x => x.url);
    } catch (err) {
      console.log(
        `Unable to get list of Repos from GitHub. Please check your access token or Organisation name/access rights`
      );
      throw Error(err);
    }
  }
};
