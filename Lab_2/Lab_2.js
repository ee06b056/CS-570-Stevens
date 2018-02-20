const fs = require ('fs');
const prompt = require ('prompt');

const getFileName = {
    name: 'file_name',
    description: 'Please input the file name of the cipher'
};

function de_cipher (txt, key, step) {
    let i = 0;
    key -= 2;
    let de_cipher_txt = '';
    for (let i = 0; i < txt.length; i++) {
        if (i % step === 0) {
            key = (key + 2) % 26;
        }
        let char_code = txt.charCodeAt(i);
        if (65 <= char_code && char_code <= 90) {
            char_code = (char_code - 65 - key + 26) % 26 + 65;
        } else if (97 <= char_code && char_code <= 122) {
            char_code = (char_code - 97 - key + 26) % 26 + 97;
        }
        de_cipher_txt += String.fromCharCode(char_code);
    }
    return de_cipher_txt;
}

let p_1 = new Promise((resolve, reject) => {
    prompt.get(getFileName,(err, result) => {
        if (err) {
            reject(err);
        } else {
            result = result.file_name;
            resolve(result);
        }
    });
});

p_1.then((result) => {
    return new Promise((resolve, reject) => {
        fs.readFile(result,'utf-8',(err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve (data);
            }
        });
    });
}).then((data) => {
    let key = 5;
    let step = 3;
    let de_cipher_txt = de_cipher(data, key, step);
    return new Promise((resolve,reject) => {
        console.log(de_cipher_txt);
        fs.writeFile('solution.txt',de_cipher_txt,(err) => {
            if (err) {
                reject(err);
            } else {
                resolve('Write success.');
            }
        });
    });
}).then((data) => {
    console.log(data);
}).catch((err)=>{
    console.log(err);
});

