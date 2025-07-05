const fs = require('node:fs/promises');
const {EventEmitter} = require('node:events');

(async () => {
// Functions:

    // CREATE_FILE:
    const createFile = async (filePath) => {
        // if path already exists:
        try {
            var fixedPath = filePath.replace(CREATE_FILE, "").trim();
            await fs.access(fixedPath);
        }
        // if it doesn't:
        catch {
            try {
                await fs.writeFile(fixedPath, "");
            }
            catch (err) {
            console.log(`File Path: ${filePath}\nError Message: ${err}`);
        }
        }
    }
    // DELETE_FILE:
    const deleteFile = async (filePath) => {
        // check if file exists:
        try {
            let fixedPath = filePath.replace(CREATE_FILE, "").trim();
            await fs.access(fixedPath);
            // now delete it here:
            await fs.unlink(fixedPath);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                console.log(`Deletion of ${filePath} ALREADY completed successfully.`);
            }
            else console.log(`File Path: ${filePath}\nError Message: ${err}`);
        }
    }
    // RENAME_FILE:
    const renameFile = async (filePath, newName) => { 
        // check if file exists:
        try {
            let fixedPath = filePath.replace(CREATE_FILE, "").trim();
            let fixedNewName = newName.replace(NEW_NAME, "").trim();
            await fs.access(fixedPath);
            // now change name here:
            await fs.rename(fixedPath, fixedNewName);
        } 
        catch (err) {
            if (err.code === 'ENOENT') {
                console.log(`Renaming of ${filePath} ALREADY completed successfully.\nNow called ${newName}`);
            }
            else console.log(`File Path: ${filePath}\nError Message: ${err}`);
        }
    }

    // ADD DATA: 
    const addData = async (path, data) => {
        try {
            let fixedPath = path.replace(ADD, "").trim();
            await fs.access(fixedPath);
            // Add data:
            await fs.writeFile(fixedPath, data);
        }
        catch (err) {
            console.log(`File Path: ${path}\nError Message: ${err}`);
        }
    }
    // Commands:
    const CREATE_FILE = "create file";
    const DELETE_FILE = "delete file";
    const RENAME_FILE = "rename file";
        const NEW_NAME = "-new name";
    const ADD = "add";
        const DATA = "-data";
    // Open the file (returns a File Descriptor in the form of a promise) && flag === 'r'/read:
    const commandFileHandler = await fs.open('./command.txt', 'r');
    const watcher = fs.watch('./command.txt');

    commandFileHandler.on('change', async () => {
            const size = (await commandFileHandler.stat()).size; // stat returns stats regarding the file, and size is a method of stat which returns size in bytes!
            const buffer = Buffer.alloc(size);
            const offset = 0;
            const length = buffer.length;
            const position = 0;

            await commandFileHandler.read(buffer, offset, length, position);
            // save the decoded buffer to a variable and check for specific keywords and perform keyword specific operations
            const commandContent = buffer.toString('UTF-8', 0, buffer.length);

            // cmd:= "create file <path>"
            if (commandContent.includes(CREATE_FILE)) {
                const filePath = commandContent.substring(CREATE_FILE.length + 1);
                createFile(filePath);
            }
            // cmd:= "delte file <path>"
            if (commandContent.includes(DELETE_FILE)) {
                const filePath = commandContent.substring(DELETE_FILE.length + 1);
                deleteFile(filePath);
            }
            // cmd:= "rename file <path> new name <path>"
            if (commandContent.includes(RENAME_FILE) && commandContent.includes(NEW_NAME)) {
                const startOldName = commandContent.indexOf(RENAME_FILE) + RENAME_FILE.length + 1; // +1 for space or separator
                const startNewName = commandContent.indexOf(NEW_NAME);

                const oldName = commandContent.substring(startOldName, startNewName).trim();
                const newName = commandContent.substring(startNewName + NEW_NAME.length + 1).trim();

                renameFile(oldName, newName);
            }
            // cmd:= "add <path> data": 
            if (commandContent.includes(ADD) && commandContent.includes(DATA)) {
                const dataStart = commandContent.indexOf(DATA);
                const filePath = commandContent.substring(ADD.length + 1, dataStart);

                const data = commandContent.substring(dataStart + DATA.length + 1);

                addData(filePath, data);
            }
    });

    for await (const event of watcher) {
        if (event.eventType === 'change') {
            console.log(`The file, '${event.filename}' was changed`);
            commandFileHandler.emit('change');
        }   
    }
})();