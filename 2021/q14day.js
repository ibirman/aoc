const _ = require('lodash')
const bigInt = require("big-integer");
let s = `CKFFSCFSCBCKBPBCSPKP

NS -> P
KV -> B
FV -> S
BB -> V
CF -> O
CK -> N
BC -> B
PV -> N
KO -> C
CO -> O
HP -> P
HO -> P
OV -> O
VO -> C
SP -> P
BV -> H
CB -> F
SF -> H
ON -> O
KK -> V
HC -> N
FH -> P
OO -> P
VC -> F
VP -> N
FO -> F
CP -> C
SV -> S
PF -> O
OF -> H
BN -> V
SC -> V
SB -> O
NC -> P
CN -> K
BP -> O
PC -> H
PS -> C
NB -> K
VB -> P
HS -> V
BO -> K
NV -> B
PK -> K
SN -> H
OB -> C
BK -> S
KH -> P
BS -> S
HV -> O
FN -> F
FS -> N
FP -> F
PO -> B
NP -> O
FF -> H
PN -> K
HF -> H
VK -> K
NF -> K
PP -> H
PH -> B
SK -> P
HN -> B
VS -> V
VN -> N
KB -> O
KC -> O
KP -> C
OS -> O
SO -> O
VH -> C
OK -> B
HH -> B
OC -> P
CV -> N
SH -> O
HK -> N
NO -> F
VF -> S
NN -> O
FK -> V
HB -> O
SS -> O
FB -> B
KS -> O
CC -> S
KF -> V
VV -> S
OP -> H
KN -> F
CS -> H
CH -> P
BF -> F
NH -> O
NK -> C
OH -> C
BH -> O
FC -> V
PB -> B`

ss= `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`

s=s.replace(/\r\n/g,'\n');

let polymer = s.split("\n")[0]
let rules = new Map()
console.log(s.split("\n")[1])
s = s.split("\n\n")[1]
	 .split("\n")
	 .map(e=>rules.set(e.split(" -> ")[0],e.split(" -> ")[1]))

let map = new Map()
for (let i=0; i<polymer.length-1; i++){
	let pair = polymer[i]+polymer[i+1]
	map.set(pair,(map.get(pair)||0)+1) 
}

const step = (steps)=>{
	let letterCount =  _.countBy(polymer)
	for (let i = 1; i <= steps; i++) {
		let new_map = new Map();
		for (let [pair, q] of map) {
			const letter = rules.get(pair);
			new_map.set(pair[0] + letter,  bigInt(q + (new_map.get(pair[0] + letter) || 0)));
			new_map.set(letter  + pair[1], bigInt(q + (new_map.get(letter  + pair[1]) || 0)));
			letterCount[letter] = (letterCount[letter] || 0) +q
			}
		map = new_map;
	}
    console.log(letterCount)
	return (Math.max(...Object.values(letterCount))-Math.min(...Object.values(letterCount)))
}
console.log("p1", step(10))
console.log("p2", step(40))