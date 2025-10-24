const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const output = fs.createWriteStream(path.join(__dirname, '..', 'virtual-study-room-allinone.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => console.log('zip created:', archive.pointer(), 'bytes'));
archive.on('error', err => { throw err; });

archive.pipe(output);
archive.directory(path.join(__dirname, '..'), false);
archive.finalize();
