const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;
const _ = require('underscore');

console.log(argv);

const file = argv._[0] ?? 'q16sample.txt';
const data = argv._[1] ?? '';
let totalVersion = 0;

if (data != '') {
    console.log(data);
    part1(data);
}
else {
    fs.readFile(file, function(err, input) {
        if(err) throw err;

        let data = parseInput(input);
        part1(data);
        part2(data);
    });
}

console.log(`Total of version numbers is ${totalVersion}`)

function part1(data) {
    console.log(`Processing Part 1`)

    let code = {
        Transmission: hexToBin(data),
        OriginalTransmission: hexToBin(data),
        Packets: []
    }

    code.Packets.push(processPacket(code));
    console.log(code)
}

function processPacket(code) {
    let packet = {}; 
    packet.PacketVersion = getPacketVersion(code);
    totalVersion += parseInt(packet.PacketVersion,2);

    packet.PacketTypeId = getPacketTypeId(code);
    let typeName = parsePacketType(packet.PacketTypeId);


    packet.PacketType = typeName;
    
    if (typeName == 'Literal') {
        packet.LiteralValue = getLiteralValue(code);
        packet.Value = parseInt(packet.LiteralValue, 2);
    }
    else { 
        let lengthTypeId = getLengthTypeId(code);

        if (lengthTypeId == '0') {
            let subPacketsLength = getSubPacketHeader(code, 15);
            packet.SubPackets = [];
            let finalLength = code.Transmission.length - subPacketsLength;

            while (code.Transmission.length > finalLength && code.Transmission.length > 0) {
                packet.SubPackets.push(processPacket(code));
            }
        }
        else if (lengthTypeId == '1') {
            console.log('1')
            let subPacketCount = getSubPacketHeader(code, 11);
            packet.SubPackets = [];

            for (let i=0;i<subPacketCount;i++) {
                packet.SubPackets.push(processPacket(code));
            }
        }

        console.log(typeName, packet.SubPackets)
        if (packet.SubPackets != null) {
            if (typeName == 'Sum') {
                packet.Value = packet.SubPackets.reduce((sum,p) => sum += p.Value, 0);
            }
            else if (typeName == 'Product') {
                packet.Value = packet.SubPackets.reduce((product,p) => product *= p.Value, 1);
            }
            else if (typeName == 'Minimum') {
                packet.Value = Math.min(...packet.SubPackets.map(p => p.Value));
            }
            else if (typeName == 'Maximum') {
                packet.Value = Math.max(...packet.SubPackets.map(p => p.Value));
            }
            else if (typeName == 'Greater Than') {
                packet.Value = packet.SubPackets[0].Value > packet.SubPackets[1].Value;
            }
            else if (typeName == 'Less Than') {
                packet.Value = packet.SubPackets[0].Value < packet.SubPackets[1].Value;
            }
            else if (typeName == 'Equal') {
                packet.Value = packet.SubPackets[0].Value == packet.SubPackets[1].Value;
            }
        }
    }

    return packet;
}

function getPacketVersion(code) {
    let packetVersion = code.Transmission.substr(0,3);
    code.Transmission = code.Transmission.substr(3);
    return packetVersion;
}

function getPacketTypeId(code) {
    let packetTypeId = code.Transmission.substr(0,3);
    code.Transmission = code.Transmission.substr(3);
    return packetTypeId;
}

function getLiteralValue(code) {
    let lastPacket = false;
    let literalValue = '';
    let packetLength = 0;

    for (i=0;i<code.Transmission.length && !lastPacket;i+=5) {
        if (code.Transmission.substr(i,1) == '0') {
            lastPacket = true;
        }
        literalValue += code.Transmission.substr(i+1,4);
        packetLength += 5;
    }
    if (code.Transmission.length > literalValue.length) {
        code.Transmission = code.Transmission.substr(packetLength);
    }
    else {
        code.Transmission = '';
    }
    return literalValue;
}

function getLengthTypeId(code) {
    let lengthTypeId = code.Transmission.substr(0,1);
    code.Transmission = code.Transmission.substr(1);
    return lengthTypeId;
}

function getSubPacketHeader(code, length) {
    let header = parseInt(code.Transmission.substr(0,length), 2);
    code.Transmission = code.Transmission.substr(length);
    return header;
}

function part2(data) {
    console.log(`Processing Part 2`)
    let code = hexToBin(data);
}

function hexToBin(hex) { return hex.split('').map(h => 
    h=='0'?'0000':
    h=='1'?'0001':
    h=='2'?'0010':
    h=='3'?'0011':
    h=='4'?'0100':
    h=='5'?'0101':
    h=='6'?'0110':
    h=='7'?'0111':
    h=='8'?'1000':
    h=='9'?'1001':
    h=='A'?'1010':
    h=='B'?'1011':
    h=='C'?'1100':
    h=='D'?'1101':
    h=='E'?'1110':'1111'
).join('');
}

function parsePacketType(typeCode) {
    let typeId = parseInt(typeCode, 2);

    if (typeId == 0) {
        typeName = 'Sum';
    }
    else if (typeId == 1) {
        typeName = 'Product'
    }
    else if (typeId == 2) {
        typeName = 'Minimum'
    }
    else if (typeId == 3) {
        typeName = 'Maximum'
    }
    else if (typeId == 4) {
        typeName = 'Literal'
    }
    else if (typeId == 5) {
        typeName = 'Greater Than'
    }
    else if (typeId == 6) {
        typeName = 'Less Than'
    }
    else if (typeId == 7) {
        typeName = 'Equal'
    }

    return typeName;
}

function parseInput(data) {
    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');

    return arr[0];
}