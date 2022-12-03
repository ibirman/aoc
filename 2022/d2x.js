const {readFileSync, promises: fsPromises} = require('fs');

const input = readFileSync('d2b.txt', 'utf-8').trimEnd().split('\r\n') 

const key = {'A': 1, 'B': 2, 'C': 3, 'X': 1, 'Y': 2, 'Z': 3}

const part1 = input
    .map(result => result.split(' '))
    .map(([a, b]) => { 
        if (key[a] === key[b]) return 3 + key[b] 
        else if (key[a] - key[b] === -1 || key[a] - key[b] === 2) return 6 + key[b]
        else return 0 + key[b]})
    .reduce((acc, x) => acc + x, 0)

console.log(part1)