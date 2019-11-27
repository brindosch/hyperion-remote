// require modules
const fs = require('fs');
const archiver = require('archiver');
const package = require(process.cwd() + '/package.json')

// vars
let FILENAME, SOURCE_DIR, TARGET_DIR

// eval what we shall do
const args = process.argv.slice(2)

if (args[0] == 'EMBED' || args[0] == 'SPA') {
    // set file name
    FILENAME = `${package.productName.replace(' ', '-')}-${package.version}-${args[0]}.zip`
    // target directory workingdir + /dist/spa/
    SOURCE_DIR = process.cwd() + '/dist/spa/'
    TARGET_DIR = process.cwd() + '/dist/'
} else if (args[0] == 'PWA') {
    // set file name
    FILENAME = `${package.productName.replace(' ', '-')}-${package.version}-${args[0]}.zip`
    // target directory workingdir + /dist/pwa/
    SOURCE_DIR = process.cwd() + '/dist/pwa/'
    TARGET_DIR = process.cwd() + '/dist/'
} else {
    console.error('Please use SPA | EMBED (spaembed) | PWA as script argument')
    process.exit(1);
}

console.log('### Create ZIP archive with FILENAME: ', FILENAME)
console.log('Source Dir: ', SOURCE_DIR)
console.log('Target Dir: ', TARGET_DIR)

// create a file to stream archive data to.
var output = fs.createWriteStream(TARGET_DIR + FILENAME);
var archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});

// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
output.on('close', function () {
    console.log(archive.pointer() + ' total bytes written');
});

// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        console.warn(err)
    } else {
        // throw error
        throw err;
    }
});

// good practice to catch this error explicitly
archive.on('error', function (err) {
    throw err;
});

// pipe archive data to the file
archive.pipe(output);

// add directory
archive.directory(SOURCE_DIR, false)

archive.finalize();