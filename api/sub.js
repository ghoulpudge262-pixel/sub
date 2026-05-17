const crypto = require('crypto');

// ⬇️ Список твоих VPN-серверов
const servers = [
  {
    flag: "🇩🇪", country: "Германия", city: "Франкфурт",
    host: "de1.example.com", port: 443,
    pbk: "REPLACE_PUBLIC_KEY", sni: "www.google.com", sid: "abcd1234",
    flow: "xtls-rprx-vision"
  },
  {
    flag: "🇳🇱", country: "Нидерланды", city: "Амстердам",
    host: "nl1.example.com", port: 443,
    pbk: "REPLACE_PUBLIC_KEY", sni: "www.microsoft.com", sid: "efgh5678",
    flow: "xtls-rprx-vision"
  },
  {
    flag: "🇪🇪", country: "Эстония", city: "Таллин",
    host: "ee1.example.com", port: 443,
    pbk: "REPLACE_PUBLIC_KEY", sni: "www.apple.com", sid: "ijkl9012",
    flow: "xtls-rprx-vision"
  }
];

// Генерация UUID v5 (точно такая же как в Python uuid.uuid5)
function generateUUID(telegramId) {
  const namespace = '12345678-1234-5678-1234-567812345678';
  const namespaceBytes = Buffer.from(namespace.replace(/-/g, ''), 'hex');
  const nameBytes = Buffer.from(String(telegramId));
  
  const combined = Buffer.concat([namespaceBytes, nameBytes]);
  const hash = crypto.createHash('sha1').update(combined).digest();
  
  const bytes = Buffer.from(hash.slice(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  
  const hex = bytes.toString('hex');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20,32)}`;
}

module.exports = (req, res) => {
  const telegramId = req.query.id;
  
  if (!telegramId) {
    return res.status(400).send('Missing user id');
  }
  
  // Генерируем UUID - такой же как в боте
  const userUuid = generateUUID(telegramId);
  
  // Формируем VLESS-ссылки для всех серверов
  const links = servers.map(s => {
    const remark = encodeURIComponent(`${s.flag} ${s.country} | ${s.city} ⚡`);
    return `vless://${userUuid}@${s.host}:${s.port}` +
      `?type=tcp&security=reality&fp=chrome` +
      `&pbk=${s.pbk}&sni=${s.sni}&sid=${s.sid}` +
      `&flow=${s.flow}&encryption=none` +
      `#${remark}`;
  });
  
  // Инфо-строка
  const infoRemark = encodeURIComponent(`👤 ID: ${telegramId}`);
  links.unshift(`vless://00000000-0000-0000-0000-000000000000@127.0.0.1:1#${infoRemark}`);
  
  const subContent = links.join('\n');
  const base64 = Buffer.from(subContent).toString('base64');
  
  // Заголовки
  const title = `🚀 MyVPN`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Profile-Title', 'base64:' + Buffer.from(title).toString('base64'));
  res.setHeader('Profile-Update-Interval', '12');
  res.setHeader('Support-URL', 'https://t.me/yourchannel');
  
  res.status(200).send(base64);
};
