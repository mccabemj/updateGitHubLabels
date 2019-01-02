const colors = require('colors/safe');
const requests = require('./requests');

// put the new labels here. These are just an example
const newLabels = [
  { name: 'IMPORTANT', color: 'FF0000', description: 'IMPORTANT' }, // red
  { name: 'bug', color: 'FF8000', description: 'Bug' }, // orange
  { name: 'improvement', color: '00FBFF', description: 'Improvement' }, // light blue
  { name: 'customer request', color: '00FF78', description: 'Customer Request' }, // green
  { name: 'discussion', color: 'A600FF', description: 'Discussion' }, // purple
  { name: 'on-hold', color: 'B3B3B3', description: 'On Hold' } // orange
];

const go = async () => {
  try {
    console.log(colors.blue.underline('Starting'));

    // get all repos
    const repos = await requests.getRepos();

    console.log(colors.blue(`Retrieved ${repos.length} Repositorys`));

    // get a list of all labels on all repos so we can delete 1 by 1 (API doesn't support mass delete)
    const getLabels = repos.map(repo => requests.getLabelsForRepo(repo));
    const labels = await Promise.all(getLabels);
    const allLabels = [].concat(...labels);

    console.log(
      colors.blue(`Retrieved list of ${allLabels.length} labels from all Repos to delete`)
    );

    // delete labels 1 by 1
    const deleteLabels = allLabels.map(url => requests.deleteLabel(url));
    const successfulDeletes = await Promise.all(deleteLabels);

    // add our new labels to each repo (again, 1 by 1)
    const addAllLabels = repos.map(repo => newLabels.map(data => requests.addLabel(repo, data)));
    const labelAddPromises = [].concat(...addAllLabels);
    const successfulAdds = await Promise.all(labelAddPromises);

    console.log(colors.red(`Successfully Deleted ${successfulDeletes.length} labels`));

    console.log(colors.green(`Successfully Added ${successfulAdds.length} labels`));

    console.log(colors.blue.underline('Finished'));
  } catch (err) {
    console.log(err.message);
  }
};

go();
