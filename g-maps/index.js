const request = require("request")
const fs = require("fs")

var options = {
  headers: {
    "user-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36",
    "x-client-data": "client-data",
    referer: "http://localhost:8080/"
  }
}
const dist = __dirname + "/images"

function rp(x, y) {
  return new Promise((res, rej) => {
    request
      .get(
        "https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i7!2i" +
          x +
          "!3i" +
          y +
          "!4i256...",
        options
      )
      .on("response", function(response) {
        if (response.statusCode !== 200) {
          rej("Error: statusCode" + response.statusCode)
        }
        res()
      })
      .on("error", function(error) {
        rej(error)
      })
      .pipe(fs.createWriteStream(dist + "/" + x + "_" + y + ".png"))
  }).catch(e => console.log(e))
}

async function repeat(r) {
  for (var x = 0; x < r; x++) {
    for (var y = 0; y < r; y++) {
	  console.log(x + "_" + y + ".png")
      await rp(x, y)
    }
  }
}
/*

zoom 5 (32)
 y => min: 0, max: 31 
 x => min: 0, max: 31
 result 1024 images
 
zoom 7 (128)
 y => min: 0, max: 127 
 x => min: 0, max: 127
 result 16384 images
 */
repeat(128)
