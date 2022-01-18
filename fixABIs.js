const fs = require('fs')

const dir = './src/abis/';

// list all files in the directory
try {
    const files = fs.readdirSync(dir);

    // files object contains all files names
    // log them on console
    files.forEach(file => {
        console.log(file);
        var obj = JSON.parse(fs.readFileSync(dir + file, 'utf8'));
        if (obj.abi) {
            console.log("sleect ABI for: " + file);
            fs.writeFileSync(dir + file, JSON.stringify(obj.abi));
        }
    });

} catch (err) {
    console.log(err);
}
