module.exports = {
  getRandomImg() {
    const imgs = [
      'https://i.imgur.com/TahFuE8.png',
      'https://i.imgur.com/veymrtk.png',
      'https://i.imgur.com/eJw2upF.png',
      'https://i.imgur.com/Li4cg1F.png',
      'https://i.imgur.com/Q8zlSYO.png',
      'https://i.imgur.com/CrroC5t.png',
      'https://i.imgur.com/kFsGblj.png',
      'https://i.imgur.com/zr2lLdr.png',
      'https://i.imgur.com/xt8fqIA.png'
    ];
    return imgs[Math.floor(Math.random() * imgs.length)];
  }
}