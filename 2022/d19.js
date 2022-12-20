const fs = require('fs');
const yargs = require('yargs');
const argv = yargs.argv;

console.log(argv);

const defaultDataFile = argv.$0.replace(/\.js$/, '.txt')
const file = argv._[0] ?? defaultDataFile;

const data = {};
const robot = ['ore', 'clay', 'obsidian', 'geode']
const material = ['ore', 'clay', 'obsidian']

fs.readFile(file, function(err, input) {
    if (err) throw err;

    parseInput(input);
    console.log(JSON.stringify(data, null, 2));
    part1();

    part2();
});

function part1() {
    console.log(`Processing Part 1`)
    data.blueprints.forEach(b => {
        for (let minute = 1; minute < 24; minute++) {
            processTurn(b, minute);
        }
    });

    data.blueprints.forEach(b => {
        b.build.forEach(b => console.log(b))
        console.log(b.inventory)
        console.log(b.branches)
    });

    data.blueprints.forEach((b,i) => {
        let x = b.branches.sort((a,b) => a.inventory.find(i => i.m == 'geode').q - b.inventory.find(i => i.m == 'geode')).reverse();
        console.log(i, b.branches.sort((a,b) => a.inventory.find(i => i.m == 'geode').q - b.inventory.find(i => i.m == 'geode')).reverse()[0].inventory.find(i => i.m == 'geode').q)
    });
}

function part2() {
    console.log(`Processing Part 2`)
}


function processTurn(blueprint, minute) {
    console.log(`Minute ${minute}, branch count: ${blueprint.branches.length}`);
    blueprint.branches.forEach(branch => {
        let builds = startBuildingRobots(blueprint.build, branch);
        collect(branch);

        builds.forEach((b, i) => {
            if (minute > 15) {
                if (b == 'geode') buildRobot(blueprint.build, branch, b)
                return;
            }
            if (i == 0) {
                buildRobot(blueprint.build, branch, b)
            }
            else {
                let newBranch = { minute: minute, build: b, robots: JSON.parse(JSON.stringify(branch.robots)), inventory: JSON.parse(JSON.stringify(branch.inventory)) }
                buildRobot(blueprint.build, newBranch, b)
                blueprint.branches.push(newBranch)
            }
        })
    })
}

function collect(branch) {
    branch.robots.forEach(r => {
        branch.inventory.find(i => i.m == r.r).q += r.q;
    });
}

function startBuildingRobots(build, branch) {
    let builds = [];
    build.forEach(b => {
        let canBuild = true;
        b.materials.forEach(m => {
            if (branch.inventory.find(i => i.m == m.m).q < m.cost) {
                canBuild = false;
            }
        })
        if (canBuild) {
            builds.push(b.r)
        }
    });
    return builds;
}

function buildRobot(build, branch, robot) {
    let b = build.find(b => b.r == robot);
    let r = branch.robots.find(r => r.r == robot);
    r.q++;
    b.materials.forEach(m => {
        branch.inventory.find(i => i.m == m.m).q -= m.cost;
    })
}

function parseInput(input) {
    const arr = input.toString().replace(/\r\n/g, '\n').split('\n');

    data.input = [];
    data.blueprints = [];

    arr.forEach((line, i) => {
        if (!(i == arr.length - 1 && line == '')) {
            let b = line.split(' ')

            let d = {
                oreRobot: { ore: b[6] * 1 }, clayRobot: { ore: b[13] * 1 }, obsidianRobot: { ore: b[20] * 1, clay: b[23] * 1 }, geodeRobot: { ore: b[30] * 1, obsidian: b[33] * 1 }
                , inventory: { oreRobot: 1, ore: 0, clayRobot: 0, clay: 0, obsidianRobot: 0, obsidian: 0, geodeRobot: 0, geode: 0 }
            }

            let build = [];
            build.push({ r: 'ore', materials: [{ m: 'ore', cost: d.oreRobot.ore }] });
            build.push({ r: 'clay', materials: [{ m: 'ore', cost: d.clayRobot.ore }] });
            build.push({ r: 'obsidian', materials: [{ m: 'ore', cost: d.obsidianRobot.ore }, { m: 'clay', cost: d.obsidianRobot.clay }] });
            build.push({ r: 'geode', materials: [{ m: 'ore', cost: d.geodeRobot.ore }, { m: 'obsidian', cost: d.geodeRobot.obsidian }] });

            let robots = [];
            robots.push({ r: 'ore', q: 1 })
            robots.push({ r: 'clay', q: 0 })
            robots.push({ r: 'obsidian', q: 0 })
            robots.push({ r: 'geode', q: 0 })

            let inventory = [];
            inventory.push({ m: 'ore', q: 0 })
            inventory.push({ m: 'clay', q: 0 })
            inventory.push({ m: 'obsidian', q: 0 })
            inventory.push({ m: 'geode', q: 0 })

            data.blueprints.push({ build: build, branches: [{ minute: 1, next: '', robots: robots, inventory: inventory }] });
        }
    });
}