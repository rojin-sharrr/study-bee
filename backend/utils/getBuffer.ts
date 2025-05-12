import fs from 'fs/promises'

const getBuffer = async  (filePath: string) => {
    // Check if the file exists in the given filepath and if it doesnot then it returns null and if does then return buffer with fs
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    if(!fileExists){
        return null;
    }
    const buffer = await fs.readFile(filePath);
    return buffer;
}
export default getBuffer;