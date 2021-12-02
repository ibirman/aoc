const fs = require('fs');

fs.readFile('q1.txt', function(err, data) {
    if(err) throw err;

    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');

    let increased=0;
    let last = -1;

    for(let i=2;i<arr.length;i++) {
        let v1=arr[i-2]*1;
        let v2=arr[i-1]*1;
        let v3=arr[i]*1;
        v=v1+v2+v3;

        if (last != -1 && v*1>last*1) {
            increased++;
        }
        console.log(v, last, increased);
        last=v;
    }
    console.log(increased);
});