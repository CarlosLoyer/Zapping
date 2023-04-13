var express = require("express");
var app = express();
var fs = require("fs");

const m3u = require("m3u8-write");

function updateLista(seq, seg) {
  var file = [
    { "EXT-X-VERSION": "3" },
    { "EXT-X-TARGETDURATION": "10" },
    { "EXT-X-MEDIA-SEQUENCE": seq },
    { EXTINF: "10" },
    `../video/segment${seg}.ts`,
    { EXTINF: "10" },
    `../video/segment${seg === 63 ? 0 : seg + 1}.ts`,
    { EXTINF: "10" },
    `../video/segment${seg === 62 ? 0 : seg === 63 ? 1 : seg + 2}.ts`,
  ];

  fs.writeFile("./public/files/zapping.m3u8", m3u(file), function (err) {
    if (err) throw err;
  });
}

let seq = 0;
let seg = 0;

function myLoop() {
  if (seg > 63) {
    seg = 0;
  }
  if (seq === 0) {
    updateLista(seq, seg);
    seq++;
    seg++;
    begin = false;
  }
  setTimeout(function () {
    updateLista(seq, seg);
    seq++;
    seg++;
    myLoop();
  }, 10000);
}

myLoop();

module.exports = app;
