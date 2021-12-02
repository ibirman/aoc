for (i=1;i<1000;i++) {
    process.stdout.write(`${i}: `);
    let n = i;

    while (n != 1 && n < 999999) {
        if (n%2 == 0) {
            n = n/2;
        }
        else {
            n = n*3 +1
        }

        process.stdout.write(`${n} `);
    }

    process.stdout.write("\n");
}