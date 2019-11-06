import { Glob } from 'glob';
const core = require('@actions/core');
const fs = require('fs');

export default async function run () {
  try {
    // get inputs
    const globPattern = core.getInput('glob_pattern', { required: true });
    //const work = core.getInput('search_path', { required: true });
    //const searchPath = process.env.GITHUB_WORKSPACE + '/'

    // search for files with pattern and get version of first file
    let v

    Glob(globPattern, async function (er, files) {
      if (er != null) {
        core.setFailed(er.message);
        throw er;
      }
      if (!files.length) {
        core.setFailed('ERROR! Glob pattern <' + globPattern + '> produced an empty file list');
        throw 'ERROR! Glob pattern <' + globPattern + '> produced an empty file list';
      }
      // read first matching file
      core.warning('Found files (use first): ' + JSON.stringify(files));
      const file = files[0]
      fs.readFile(file, (err, rawdata) => {
        if (err) {
          core.setFailed('ERROR! Failed to read file')
          throw err
        }
        core.warning('cwdPRocess : ' + process.cwd() + rawdata + JSON.parse(rawdata));
        // parsers
        if (file.endsWith('.json')) {
          const data = JSON.parse(rawdata);
          v = data.version
        } else {
          core.setFailed('ERROR! No parser for <' + file + '> implemented');
          throw 'ERROR! No parser for <' + file + '> implemented';
        }

        // test version output
        if (v == undefined)
          core.setFailed('ERROR! Failed to parse version from ' + file)

        // define output
        const version = v
        core.warning('Version found: ' + version);

        // Set the output variable for use by other actions: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
        core.setOutput('version', version);
      })
    })
  } catch (error) {
    core.setFailed(error.message);
  }
}
