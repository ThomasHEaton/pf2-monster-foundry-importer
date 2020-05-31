const fs = require('fs');
const readline = require('readline');

const nethysUrlPrefix = "https://2e.aonprd.com/Monsters.aspx?ID=";

const parser = {
    parseFile: async (path, imageDirPath) => {
        return await processMonsters(path, imageDirPath);
    }
};

async function processMonsters(path, imageDirPath) {
    const fileStream = fs.createReadStream(path);

    let monsterList = [];

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const monster = JSON.parse(line);

        modifyMonsterFields(monster, imageDirPath);

        monsterList.push(monster);
    }

    return monsterList;
}

function modifyMonsterFields(monster, imageDirPath) {
    const nethysUrl = monster.data.details.nethysUrl;
    const monsterId = nethysUrl.replace(nethysUrlPrefix, "");

    if (fs.existsSync(`${imageDirPath}/${monsterId}.png`)) {
        monster.img = `systems/pf2e/monsters/${monsterId}.png`;
        monster.token.img = `systems/pf2e/monsters/${monsterId}.png`;
    }
}

module.exports = parser;
