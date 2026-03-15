
const { MaskUtils } = require('./frontend/src/utils/mask.utils.js'); // Assuming I can run it like this, but it's TS...
// Actually, I'll just simulate the code here.

function passportID(value) {
    return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 20);
}

console.log('Result for "abc-123":', passportID('abc-123'));
console.log('Result for "a123":', passportID('a123'));
console.log('Result for "123a":', passportID('123a')); // This one fails in the component because of the regex test
