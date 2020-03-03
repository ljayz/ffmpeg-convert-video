const glob = require("glob");
const R = require("ramda");
const pathToFfmpeg = require("ffmpeg-static");
const shell = require("shelljs");
const upath = require("upath");

const folder = "04 First Course Project - The Monster Slayer"; //put here the folder which has the videos to convert
const getFilename = R.compose(R.last, R.split("/"));

try {
  const files = glob.sync(`${folder}/*.mp4`);
  console.log(JSON.stringify(files, null, 2));
  const folderPath = process.cwd();

  files.map(async f => {
    const filename = getFilename(f);
    const fPath = upath.normalize(`${folderPath}/${f}`);
    const filePath = upath.normalize(`${folderPath}/${filename}`);
    const ffmpegPath = upath.normalize(pathToFfmpeg);
    const ffmpegCode = `"${ffmpegPath}" -i "${fPath}" -s hd480 -c:v libx264 -crf 23 -c:a aac -strict -2 "${filePath}"`; //this will convert the video to 480p resolution

    try {
      console.log(`Running: ${ffmpegCode}`);
      await shell.exec(ffmpegCode, { silent: true });
      console.log("File Converted: " + filename);
    } catch (e) {
      console.log(`Err`, e);
    }

    return filename;
  });
} catch (e) {
  console.log(`Err`, e);
}
