const fs = require('fs');

fs.readFile('q2.txt', function(err, data) {
    if(err) throw err;

    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');

    let h=0;
    let d=0;
    let aim=0;

    for(let i=0;i<arr.length;i++) {
        let c=arr[i].split(' ');
        let action=c[0];
        let distance=c[1]*1;

        if (action=='forward') {
            h+=distance;
            d+=(aim*distance);
        }
        else if (action=='down') {
            //d+=distance;
            aim+=distance;
        }
        else if (action=='up') {
            //d-=distance;
            aim-=distance;
        }
        else if (action=='backwards') {
            h-=distance;
        }
    }
    console.log(h,d,h*d);
});