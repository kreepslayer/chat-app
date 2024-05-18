import { Controller, Get, Param, Res } from "@nestjs/common";

@Controller("feed")
export class FeedController {
  @Get("image/:fileName")
  findImageByName(@Param("fileName") fileName: string, @Res() res) {
    console.log("🚀 ~ FeedController ~ findImageByName ~ fileName:", fileName);
    if (!fileName || ["null", "[null]"].includes(fileName)) return;
    return res.sendFile(fileName, { root: "./images" });
  }
}
