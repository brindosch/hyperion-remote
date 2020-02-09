// Calc hash of file
const crypto = require('crypto');
const fs = require('fs');

module.exports = (file) => {
    const hash = crypto.createHash('sha256');
    const input = fs.createReadStream(file);
    input.on('readable', () => {
        const data = input.read();
        if (data)
            hash.update(data);
        else {
            console.log(`SHA256: ${hash.digest('hex')}`);
        }
    });

}


