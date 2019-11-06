const core = require('@actions/core');
const { GitHub } = require('@actions/github');

import { createReadStream, statSync } from 'fs';
import { basename, join } from 'path';
import { Glob } from 'glob';
import * as readChunk from 'read-chunk';
// FIXME Is it possible to import 'file-type'? e.g.:
// import * as fileType from 'file-type';
const fileType = require('file-type');

export default async function run () {
  try {
    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const github = new GitHub(process.env.GITHUB_TOKEN);

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const globPattern = core.getInput('glob_pattern', { required: true });
    const upload_url = core.getInput('upload_url', { required: true });
    const blacklist = core.getInput('blacklist').split('|').filter(e => e.trim() != '')

    // search for files in asset path
    Glob(globPattern, async function (er, files) {
      if (er != null) {
        core.setFailed(er.message);
        throw er;
      }
      if (!files.length) {
        core.warning(`WARNING! Glob pattern <${globPattern}> produced an empty file list`);
      }
      // be sure the file is not blacklisted
      files = files.filter(file => {
        const tfile = file.split('/').pop()
        for (const entry of blacklist) {
          if (tfile.includes(entry)) {
            core.debug(`File <${tfile}> with path <${file}> blacklisted - skip`)
            return false
          }
        }
        return true
      })

      // now we can upload them
      files.forEach(async function (file) {
        const stats = statSync(file);
        const fsize = stats.size;
        let fmime = 'application/octet-stream'
        if (fsize >= fileType.minimumBytes) {
          // FIXME Can we use some built-in feature instead of depending on 'read-chunk'?
          const buffer = readChunk.sync(file, 0, fileType.minimumBytes);
          if (fileType(buffer)) {
            fmime = fileType(buffer).mime
          }
        }
        core.debug('Upload ' + file + ' [size: ' + fsize + ', type:' + fmime + ']...')

        // Upload a release asset
        // API Documentation: https://developer.github.com/v3/repos/releases/#upload-a-release-asset
        // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset
        const uploadAssetResponse = await github.repos.uploadReleaseAsset({
          file: createReadStream(file),
          headers: {
            'content-length': fsize,
            'content-type': fmime,
          },
          name: basename(file),
          url: upload_url,
        })

      })
    })

    /*
     const uploadAssetResponse = await github.repos.uploadReleaseAsset({
       url: uploadUrl,
       headers,
       name: assetName,
       file: fs.readFileSync(assetPath)
     });
   
     // Get the browser_download_url for the uploaded release asset from the response
     const {
       data: { browser_download_url: browserDownloadUrl }
     } = uploadAssetResponse;
   
     // Set the output variable for use by other actions: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
     core.setOutput('browser_download_url', browserDownloadUrl);
     */
  } catch (error) {
    core.setFailed(error.message);
  }
}
