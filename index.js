const requests = require('./requests');

// put the new labels here. These are just an example
const newLabels = [
  { name: 'Bug', color: 'FF2D00', description: 'Bug' },
  { name: 'Active', color: '00C1FF', description: 'Active' },
  { name: 'Enhancement', color: '1FFF00', description: 'Enhancement' },
  { name: 'Important', color: 'FF00C1', description: 'Important' },
  { name: 'Low Importance', color: 'BFBFBF', description: 'Low Importance' },
  { name: 'Stale', color: 'FFFB00', description: 'Stale' }
];

const go = async () => {
  try {
    // get all repos
    const repos = await requests.getRepos();

    // get a list of all labels on all repos so we can delete 1 by 1 (API doesn't support mass delete)
    const getLabels = repos.map(repo => requests.getLabelsForRepo(repo));
    const labels = await Promise.all(getLabels);
    const allLabels = [].concat(...labels);

    // delete labels 1 by 1
    const deleteLabels = allLabels.map(url => requests.deleteLabel(url));
    await Promise.all(deleteLabels);

    // add our new labels to each repo (again, 1 by 1)
    const addAllLabels = repos.map(repo => newLabels.map(data => requests.addLabel(repo, data)));
    const labelAddPromises = [].concat(...addAllLabels);
    await Promise.all(labelAddPromises);
  } catch (err) {
    console.log('EXIT');
  }
};

go();
