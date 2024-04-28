import ytdl from "ytdl-core";
import fs from "fs";

const download_video = async (link: string) => {
  const data = await ytdl.getBasicInfo(link);
  const { title } = data.videoDetails;
  return new Promise<string>((res, rej) => {
    ytdl(link, {
      filter: "audioonly",
      quality: "highestaudio",
    })
      .on(
        "progress",
        (chunklength: number, totalDownloaded: number, totalSize: number) => {
          const sizeDownloaded = ((totalDownloaded / totalSize) * 100).toFixed(
            2
          );
          console.log("Donwloaded:", sizeDownloaded + "%", "of 100");
        }
      )
      .pipe(fs.createWriteStream("audio.mp3"))
      .on("finish", () => {
        res(title);
      })
      .on("error", (err: any) => rej(err.message));
  });
};

export default download_video;
