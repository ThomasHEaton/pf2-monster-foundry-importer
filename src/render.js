const parser = require('./parser');
const {remote} = require('electron');
const {dialog} = remote;
const {writeFileSync} = require('fs');

foundryDb = document.getElementById('foundryDb');
foundryDbBtn = document.getElementById('foundryPathBtn');
imageDirPath = document.getElementById('imageDirPath');
imageDirPathBtn = document.getElementById('imageDirPathBtn');

uploadBtn = document.getElementById('uploadBtn');

async function handleClick() {
    const path = foundryDb.value;
    const dirPath = imageDirPath.value;

    const output = await parser.parseFile(path, dirPath);

    const result = await dialog.showSaveDialog({
        properties: ['saveFile'],
        buttonLabel: "Save Foundry DB",
    });

    let outputString = "";

    output.forEach((monster) => {
        // The Foundry Bestiary DB is many JSON objects all separated by a newline.
        outputString += JSON.stringify(monster) + "\n";
    });

    writeFileSync(result.filePath, outputString);
}

foundryDbBtn.onclick = async () => {
    const foundryDbPath = await dialog.showOpenDialog({
        properties: ['openFile'],
        buttonLabel: "Open Foundry DB",
    });

    if (foundryDbPath.filePaths && foundryDbPath.filePaths.length > 0) {
        foundryDb.value = foundryDbPath.filePaths[0];

        activateButton();
    }
};

imageDirPathBtn.onclick = async () => {
    const imageDirectoryPath = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        buttonLabel: "Select Image Folder"
    });

    if (imageDirectoryPath.filePaths && imageDirectoryPath.filePaths.length > 0) {
        imageDirPath.value = imageDirectoryPath.filePaths[0];

        activateButton();
    }
};

activateButton = () => {
    uploadBtn.disabled = !(foundryDb.value && imageDirPath.value);
};

uploadBtn.onclick = () => {
    handleClick();
};

foundryDb.onchange = async () => {
    activateButton()
};

foundryDb.oninput = async () => {
    activateButton();
};

imageDirPath.onchange = async () => {
    activateButton()
};

imageDirPath.oninput = async () => {
    activateButton();
};
