const servers = [
  {
    flag: "🇩🇪", country: "Германия", city: "Frankfurt",
    uuid: "29fd1aa4-b0a3-4cf6-9df8-071b3eb521be",
    host: "de6.joybang.site", port: 443,
    pbk: "Xh2KakYrLA2ob_ldEk76FbT8PKILpuT3rTJj8wKhizY",
    sni: "kion.ru", sid: "0880", spx: "/JK1t2ttc9manJEz",
    fp: "chrome", flow: "xtls-rprx-vision"
  },
  {
    flag: "🇪🇪", country: "Эстония", city: "Tallinn",
    uuid: "c186e71d-630d-480a-82e5-8c5535f47c3d",
    host: "ee3.joybang.site", port: 443,
    pbk: "sPX1OEUYYV3jtT1087zuVu7xmWQJ3O6X2FdYAQeg-3w",
    sni: "kinopoisk.ru", sid: "49bc", spx: "/P5Fs6G7WmlPAdwE",
    fp: "chrome", flow: "xtls-rprx-vision"
  },
  {
    flag: "🇨🇭", country: "Швейцария", city: "Zurich",
    uuid: "99fdf061-2937-4668-8793-de6a4d2c6703",
    host: "chz.joybang.site", port: 443,
    pbk: "-eIeMbJt8qFvc-kCbUYg1ZOHzOHi5gCaSGAembG6MXo",
    sni: "epicgames.com", sid: "85327f2e12", spx: "/1U9OcpLiD0rwweg",
    fp: "chrome", flow: "xtls-rprx-vision"
  },
  {
    flag: "🇳🇱", country: "Нидерланды", city: "Amsterdam",
    uuid: "6e6e8c17-085f-4361-9bee-aea20a5a3ea4",
    host: "nl5.joybang.site", port: 443,
    pbk: "oCiHWE6jMqYcn7GNyTYC7T-JuzuiJI74IthRpWe0uXo",
    sni: "web.max.ru", sid: "33941f", spx: "/Kh7QNCUYgGd3nE7",
    fp: "chrome", flow: "xtls-rprx-vision"
  },
  {
    flag: "🇸🇪", country: "Швеция", city: "Stockholm",
    uuid: "078cf2f4-6b99-4272-a9a8-695f0ecf716e",
    host: "se2.joybang.site", port: 443,
    pbk: "K6KGrP9bSGdE1fse-ViNiSiWQLyaBBkbVzhj7f6KvjM",
    sni: "rutube.ru", sid: "99d6cb3488333e31", spx: "/xSuMFOfhXg3x4Qu",
    fp: "chrome", flow: "xtls-rprx-vision"
  },
  {
    flag: "🇷🇺", country: "Россия", city: "Moscow",
    uuid: "88e770d3-dc35-421b-b80a-a506ae35444f",
    host: "rus5.joybang.site", port: 443,
    pbk: "FzrQfH8_NTfiFJW2Vy79EAudFH9-I-zkKk2PSr8vm3A",
    sni: "cloudcdn-m9-15.cdn.yandex.net", sid: "1d", spx: "/YOYYieobaztP7gn",
    fp: "chrome", flow: "xtls-rprx-vision"
  },
  {
    flag: "🇫🇮", country: "Финляндия", city: "Helsinki",
    uuid: "7d8c30e0-e44d-4767-b5ac-b9eecf9bbf7e",
    host: "fl3.joybang.site", port: 443,
    pbk: "yfsqWoE6tbG-DgP_KeHHgLmivFLBGKJBAIwsUSYT5hE",
    sni: "kaspersky.ru", sid: "c81b906d1366", spx: "/bGTWIdzzdzwflOA",
    fp: "chrome", flow: "xtls-rprx-vision"
  },
  {
    flag: "🇱🇻", country: "Латвия", city: "Riga",
    uuid: "a4e6b58a-ea85-4d9a-94cc-fedf920a9b5b",
    host: "lv2.joybang.site", port: 443,
    pbk: "KVxnoi0lW65BoIiXJVHoJ5HVRxEyUZbPcmUhB7DO1C0",
    sni: "tele2.lv", sid: "e9eb33efb563f7", spx: "/KZWlH9T7SjHDFyv",
    fp: "firefox", flow: "xtls-rprx-vision"
  }
];

module.exports = (req, res) => {
  const telegramId = req.query.id || "guest";

  // Генерируем ссылки
  const links = servers.map(s => {
    // Красивое имя: 🇩🇪 Германия | Frankfurt ⚡
    const name = `${s.flag} ${s.country} | ${s.city} ⚡`;
    
    return `vless://${s.uuid}@${s.host}:${s.port}` +
      `?encryption=none` +
      `&flow=${s.flow}` +
      `&fp=${s.fp}` +
      `&pbk=${s.pbk}` +
      `&security=reality` +
      `&sid=${s.sid}` +
      `&sni=${s.sni}` +
      `&spx=${s.spx}` +
      `&type=tcp` +
      `#${encodeURIComponent(name)}`;
  });

  // Склеиваем в один текст и кодируем в Base64
  const subText = links.join('\n');
  const base64 = Buffer.from(subText).toString('base64');

  // Отправляем ответ
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Profile-Title', 'base64:' + Buffer.from('🚀 MyVPN Premium').toString('base64'));
  res.setHeader('Profile-Update-Interval', '12');
  
  res.status(200).send(base64);
};
