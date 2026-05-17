const servers = [
  {
    flag: "🇩🇪", country: "Германия", city: "Франкфурт", tier: "premium",
    host: "de1.example.com", port: 443,
    pbk: "REPLACE_PUBLIC_KEY", sni: "www.google.com", sid: "abcd1234",
    flow: "xtls-rprx-vision"
  },
  {
    flag: "🇳🇱", country: "Нидерланды", city: "Амстердам", tier: "premium",
    host: "nl1.example.com", port: 443,
    pbk: "REPLACE_PUBLIC_KEY", sni: "www.microsoft.com", sid: "efgh5678",
    flow: "xtls-rprx-vision"
  },
  {
    flag: "🇪🇪", country: "Эстония", city: "Таллин", tier: "free",
    host: "ee1.example.com", port: 443,
    pbk: "REPLACE_PUBLIC_KEY", sni: "www.apple.com", sid: "ijkl9012",
    flow: "xtls-rprx-vision"
  },
  {
    flag: "🇫🇮", country: "Финляндия", city: "Хельсинки", tier: "premium",
    host: "fi1.example.com", port: 443,
    pbk: "REPLACE_PUBLIC_KEY", sni: "www.cloudflare.com", sid: "mnop3456",
    flow: "xtls-rprx-vision"
  },
  {
    flag: "🇸🇪", country: "Швеция", city: "Стокгольм", tier: "premium",
    host: "se1.example.com", port: 443,
    pbk: "REPLACE_PUBLIC_KEY", sni: "www.spotify.com", sid: "qrst7890",
    flow: "xtls-rprx-vision"
  }
];

const users = {
  "demo-user-123": {
    uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Demo User",
    plan: "premium",
    traffic_used: 5368709120,
    traffic_limit: 107374182400,
    expire: 1767225600
  }
};

module.exports = (req, res) => {
  const userId = req.query.id;

  if (!userId) {
    return res.status(400).send('Missing user id');
  }

  const user = users[userId];
  if (!user) {
    return res.status(404).send('User not found');
  }

  const now = Math.floor(Date.now() / 1000);
  if (user.expire && user.expire < now) {
    return res.status(403).send('Subscription expired');
  }

  if (user.traffic_used >= user.traffic_limit) {
    return res.status(403).send('Traffic limit reached');
  }

  const availableServers = servers.filter(s =>
    user.plan === 'premium' ? true : s.tier === 'free'
  );

  const links = availableServers.map(s => {
    const remark = encodeURIComponent(
      `${s.flag} ${s.country} | ${s.city} ${s.tier === 'premium' ? '⚡' : '🆓'}`
    );
    return `vless://${user.uuid}@${s.host}:${s.port}` +
      `?type=tcp&security=reality&fp=chrome` +
      `&pbk=${s.pbk}&sni=${s.sni}&sid=${s.sid}` +
      `&flow=${s.flow}&encryption=none` +
      `#${remark}`;
  });

  const daysLeft = Math.floor((user.expire - now) / 86400);
  const gbLeft = ((user.traffic_limit - user.traffic_used) / 1024 ** 3).toFixed(1);
  const infoRemark = encodeURIComponent(`📊 Осталось: ${gbLeft} GB | ${daysLeft} дн.`);
  links.unshift(`vless://00000000-0000-0000-0000-000000000000@127.0.0.1:1#${infoRemark}`);

  const subContent = links.join('\n');
  const base64 = Buffer.from(subContent).toString('base64');

  const title = `🚀 MyVPN | ${user.name}`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Profile-Title', 'base64:' + Buffer.from(title).toString('base64'));
  res.setHeader('Profile-Update-Interval', '12');
  res.setHeader('Support-URL', 'https://t.me/yourchannel');
  res.setHeader(
    'Subscription-Userinfo',
    `upload=0; download=${user.traffic_used}; total=${user.traffic_limit}; expire=${user.expire}`
  );

  res.status(200).send(base64);
};
