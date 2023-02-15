import util from 'util';
import path from 'path';
import { exec } from 'child_process';

const execp = util.promisify(exec);

const makeVideoFromPhotos = async ({ pathToDir, fps = 25, quality = '1920x1080' }) => {
  const videoFileName = `tmp-video.mp4`;
  const pathToVideoFile = path.join(pathToDir, videoFileName);

  console.log('ffmpeg start makeVideoFile -', new Date().toLocaleString());

  try {
    await execp(`ffmpeg -y -i ${pathToDir}\\img-%06d.jpg -r ${fps} -s ${quality} -vcodec libx264 ${pathToVideoFile}`);
    // console.log('ffmpeg result:', result);
  } catch (error) {
    console.log('ffmpeg error:', error);
    throw error;
  }

  console.log('ffmpeg finish makeVideoFile -', new Date().toLocaleString());

  return videoFileName;
};

const makeVideoPoster = async ({ pathToDir, videoName }) => {
  const posterFileName = `tmp-poster.jpg`;
  const pathToVideoFile = path.join(pathToDir, videoName);
  const pathToPosterFile = path.join(pathToDir, posterFileName);

  //   console.log('start makeVideoPoster pathToVideo -', pathToVideo);
  //   console.log('start makeVideoPoster pathToPosterFile -', pathToPosterFile);

  try {
    await execp(`ffmpeg -y -i ${pathToVideoFile} -ss 00:00:01 -frames:v 1 ${pathToPosterFile}`);
  } catch (error) {
    console.log('ffmpeg error:', error);
    throw error;
  }

  return posterFileName;
};

const getVideoInfo = async ({ pathToDir, videoName }) => {
  const pathToVideoFile = path.join(pathToDir, videoName);

  try {
    const result = await execp(`ffprobe ${pathToVideoFile} -print_format json -show_format -show_streams`);
    // console.log('ffprobe result:', JSON.parse(result.stdout));

    return JSON.parse(result.stdout);
  } catch (error) {
    console.log('ffmpeg error:', error);
    throw error;
  }
};

export default { makeVideoFromPhotos, makeVideoPoster, getVideoInfo };
