const fs = require('fs');
const path = require('path');
const p2pBaseUrl = path.resolve(__dirname, '../../p2p/lib/');
const entries = fs
    .readdirSync('../../p2p/lib/')
    .filter(function (file) {
        return file.match(/.*-modal.*\.js$/);
    })
    .map(file => {
        const filename = file.split('.')[0];

        return [filename, p2pBaseUrl + '/' + file];
    });
console.log('entries', {
    test: 'test',
    ...Object.fromEntries(entries),
});
