var fs = require("fs");

const sourceData = "2020q4.txt"

const REQUIRED_FIELDS = ['pid', 'ecl', 'hcl', 'hgt', 'eyr', 'byr',
                         'iyr']
// Part 1
try {
    const data = fs.readFileSync(
        sourceData, 'utf8'
    );

    const asArray = data.split('\n\n')
    const res = asArray.filter(data => {
        const numInclusions = REQUIRED_FIELDS.filter(fieldName => {
            return data.includes(fieldName)
        }).length
        return numInclusions === REQUIRED_FIELDS.length
    }).length
    console.log(res);
} catch (err) {
    console.error(err);
}

const isValidBirthYear = (year) => {
    if (year.length !== 4) return false
    let yr = parseInt(year)
    return year >= 1920 && year <= 2002
}

const isValidIssueYear = (year) => {
    if (year.length !== 4) return false
    let yr = parseInt(year)
    return year >= 2010 && year <= 2020
}

const isValidExpYear = (year) => {
    if (year.length !== 4) return false
    let yr = parseInt(year)
    return year >= 2020 && year <= 2030
}

const isValidHeight = (height) => {
    const isCm = height.slice(-2) === "cm"
    const val = height.slice(0, -2)
    if (isCm) {
        return val >= 150 && val <= 193
    } else {
        return val >= 59 && val <= 76
    }
}

const isValidEyeColour = (input) => {
    const validOptions = ['amb', "blu", 'brn', 'gry',  'grn',  'hzl',  'oth']
    return validOptions.includes(input)
}

const isValidPid = (input) => {
    if (input.length === 9) {
        return parseInt(input) !== NaN
    } else {
        return false
    }
}


const isValidHexCode = (colour) => {
    return /^#[0-9a-f]{6}$/i.test(colour)
}

// Part 2
try {
    const data = fs.readFileSync(
        sourceData, 'utf8'
    );
    const asArray = data.split('\r\n\r\n')
    let counter = 0
    const validEntries = asArray.filter((id,i) => {
        const fields = id.split(/\s/) // Regex for whitespace
        const validFields = fields.filter(field => {
            const [fieldName, val] = field.split(":")
            if (fieldName === 'pid') {
                return isValidPid(val)
            }
            else if (fieldName === 'ecl') {
                return isValidEyeColour(val)
            }
            else if (fieldName === 'hcl') {
                return isValidHexCode(val)
            }
            else if (fieldName === 'hgt') {
                return isValidHeight(val)
            }
            else if (fieldName === 'eyr') {
                return isValidExpYear(val)
            }
            else if (fieldName === 'byr') {
                return isValidBirthYear(val)
            }
            else if (fieldName === 'iyr') {
                return isValidIssueYear(val)
            } else {
                return false
            }

        })
        console.log(i, validFields.length === REQUIRED_FIELDS.length);
        return validFields.length === REQUIRED_FIELDS.length
    })
    console.log(validEntries.length);
} catch (err) {
    console.error(err);
}