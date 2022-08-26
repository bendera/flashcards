const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const manifest = require('../public/manifest.json');

const output = fs.createWriteStream(
  path.join(__dirname, `../${manifest.name}-${manifest.version}.zip`)
);
const archive = archiver('zip', {
  zlib: { level: 9 },
});

archive.on('error', function (err) {
  throw err;
});

archive.pipe(output);

archive.directory(path.join(__dirname, '../build'), false);

archive.finalize();
