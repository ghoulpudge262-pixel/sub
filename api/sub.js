import servers from '../data/servers.json' assert { type: 'json' };
import users from '../data/users.json' assert { type: 'json' };

export default function handler(req, res) {
  const userId = req.query.id;

  if (!userId) {
    return res.status(400).send('Missing user id');
  }

  const user = users[userId];
  if (!user) {
    return res.status(404).send('User not found');
  }

  // Проверка срока действия
  const now = Math.floor(Date.now() / 1000);
  if (user.expire && user.expire < now) {
    return res.status(403).send('Subscription expired');
  }

  // Проверка трафика
  if (user.traffic_used >= user.traffic_limit) {
    return res.status(403).send('Traffic limit reached');
  }

  // Фильтрация серверов по тарифу
  const availableServers = servers.filter(s => {
    if (user.plan === 'premium') return true;
    return s.tier === 'free';
  });

  // Генерация ссылок
  const links = availableServers.map((s, index) => {
    const num = String(index + 1).padStart(2, '0');
    const remark = encodeURIComponent(
      `${s.flag} ${s.country} | ${s.city} ${s.tier === 'premium' ? '⚡' : '🆓'}`
    );

    if (s.type === 'reality') {
      return `vless://${user.uuid}@${s.host}:${s.port}` +
        `?type=tcp&security=reality&fp=chrome` +
        `&pbk=${s.pbk}&sni=${s.sni}&sid=${s.sid}` +
        `&flow=${s.flow}&encryption=none` +
        `#${remark}`;
    }

    return `vless://${user.uuid}@${s.host}:${s.port}` +
      `?type=tcp&security=tls&sni=${s.sni}&encryption=none` +
      `#${remark}`;
  });

  // Информационный "сервер" с балансом и сроком
  const daysLeft = Math.floor((user.expire - now) / 86400);
  const gbLeft = ((user.traffic_limit - user.traffic_used) / 1024 ** 3).toFixed(1);
  const infoRemark = encodeURIComponent(
    `📊 Осталось: ${gbLeft} GB | ${daysLeft} дн.`
  );
  links.unshift(`vless://00000000-0000-0000-0000-000000000000@127.0.0.1:1#${infoRemark}`);

  const subContent = links.join('\n');
  const base64 = Buffer.from(subContent).toString('base64');

  // Красивые заголовки
  const title = `🚀 MyVPN | ${user.name}`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Profile-Title', 'base64:' + Buffer.from(title).toString('base64'));
  res.setHeader('Profile-Update-Interval', '12');
  res.setHeader('Support-URL', 'https://t.me/yourchannel');
  res.setHeader('Profile-Web-Page-Url', `https://${req.headers.host}/sub/${userId}`);
  res.setHeader(
    'Subscription-Userinfo',
    `upload=0; download=${user.traffic_used}; total=${user.traffic_limit}; expire=${user.expire}`
  );

  res.status(200).send(base64);
}
