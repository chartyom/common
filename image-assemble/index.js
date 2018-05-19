const fs = require("fs")
const PNG = require("pngjs").PNG
const r = 32
const img_size = 256
const YX = img_size * r
var log_max = r * r * 2

function getImg(img, x, y, dst) {
  return new Promise(ok => {
    fs
      .createReadStream(img)
      .pipe(new PNG())
      .on("parsed", function() {
        this.bitblt(dst, 0, 0, img_size, img_size, x, y)
        ok(dst)
      })
  }).catch(e => console.log(e))
}

async function createImg(path) {
  var dst = new PNG({ width: YX * 2, height: YX })
  for (var x = 0; x < r; x++) {
    for (var y = 0; y < r; y++) {
      console.log("./images/" + x + "_" + y + ".png")
      await getImg(
        "./images/" + x + "_" + y + ".png",
        YX / 2 + x * img_size,
        y * img_size,
        dst
      )
    }
  }

  for (var x = r / 2; x < r; x++) {
    for (var y = 0; y < r; y++) {
      console.log("./images/" + x + "_" + y + ".png")
      await getImg(
        "./images/" + x + "_" + y + ".png",
        x * img_size - YX / 2,
        y * img_size,
        dst
      )
    }
  }

  for (var x = 0; x < r / 2; x++) {
    for (var y = 0; y < r; y++) {
      console.log("./images/" + x + "_" + y + ".png")
      await getImg(
        "./images/" + x + "_" + y + ".png",
        YX / 2 + YX + x * img_size,
        y * img_size,
        dst
      )
    }
  }
  dst.pack().pipe(fs.createWriteStream(path))
}

createImg("./out_1024.png").catch(e => console.log(e))
