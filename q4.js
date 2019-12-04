let count = 0;

for (var i=158126; i<=624574; i++) {
    let s=i+"";
    let double = false;
    let dec = true;

    for (var j=0;j<s.length;j++)  {
        if (j == 0) {
            if (s[j]==s[j+1] && s[j] != s[j+2]) {
                double = true;
            }
        }
        else if (j < 5) {
            if (s[j]==s[j+1] && s[j] != s[j+2] && s[j] != s[j-1]) {
                double = true;
            }
        }
        else {
            if (s[j]==s[j+1] && s[j] != s[j-1]) {
                double = true;
            }
        }
        if (s[j]>s[j+1]) {
            dec = false;
            break;
        }

    }

    if (double && dec) {
        count++;
    }
}

console.log(count);