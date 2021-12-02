const fs = require('fs');

let passports = fs.readFileSync('./2020q4.txt', 'utf-8').split('\r\n\r\n');

let total = 0;

passports.map((p,i) => {
    total += processPassport(p,i)==true;
});

console.log(total);

function processPassport(passport, num) {
    let fields = passport.split(/\s+/);
    let valid=true;

    let requiredFieldCount=0;
    let requiredFields = ['ecl', 'pid', 'eyr', 'hcl', 'byr', 'iyr', 'hgt']
    let optionalFields = ['cid']
    let pf={};

    fields.map(f => {
        let name=f.split(':')[0];
        let value=f.split(':')[1];

        if (requiredFields.indexOf(name) >=0 || optionalFields.indexOf(name) >= 0) {
            if (requiredFields.indexOf(name) >= 0) {
                requiredFieldCount++;
            }

            if (pf[name] != null) valid = false; 
            else pf[name] = value;

            switch (name) {
                case 'byr':
                    var byr = value.match(/^\d{4}$/);
                    if (!byr) valid = false;
                    else if (value*1<1920 || value*1>2002) valid = false;
                    break;
                case 'iyr':
                    var iyr = value.match(/^\d{4}$/);
                    if (!iyr) valid = false;
                    else if (value*1<2010 || value*1>2020) valid = false;
                    break;
                case 'eyr':
                    var eyr = value.match(/^\d{4}$/);
                    if (!eyr) valid = false;
                    else if (eyr[0]*1<2020 || eyr[0]*1>2030) valid = false;
                    break;
                case 'hgt':
                    var hgt = value.match(/^(\d+)(in|cm)$/);
                    if (hgt) {
                        var height = hgt[1]*1;
                        var unit = hgt[2];
                        if (unit == 'cm' && (height<150 || height>193)) valid = false; 
                        if (unit == 'in' && (height<59 || height>76)) valid = false; 
                    }
                    else {
                        valid = false;
                    }
                    break;
                case 'hcl':
                    var hcl = value.match(/^(#)([a-z]|\d){6}$/);
                    if (!hcl) valid = false;
                    break;
                case 'ecl':
                    var ecl = value.match(/^(amb|blu|brn|gry|grn|hzl|oth)$/);
                    if (!ecl) valid = false;
                    break;
                case 'pid':
                    var pid = value.match(/^\d{9}$/);
                    if (!pid) valid = false;
                    break;
                default:
                    break;
            }
        }
        else {
            valid = false;
        }
    });

    console.log(`Passport ${num} required fields: ${requiredFieldCount} hcl: ${pf['hcl']} valid: ${valid && requiredFieldCount==7}`);

    if (requiredFieldCount == 7 && valid) {
        return true;
     }

    return false;
}