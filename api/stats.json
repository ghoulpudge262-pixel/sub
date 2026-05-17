import { readFileSync } from 'fs';
import { join } from 'path';

const servers = JSON.parse(readFileSync(join(process.cwd(), 'data/servers.json'), 'utf-8'));
const users = JSON.parse(readFileSync(join(process.cwd(), 'data/users.json'), 'utf-8'));

export default function handler(req, res) {
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

  const availableServers = servers.filter(s => {
    if (user.plan === 'premium') return true;
    return s.tier === 'free';
  });

  const links = availableServers.map((s) => {
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

  const daysLeft = Math.floor((user.expire - now) / 86400);
  const gbLeft = ((user.traffic_limit - user.traffic_used) / 1024 ** 3).toFixed(1);
  const infoRemark = encodeURIComponent(
    `📊 Осталось: ${gbLeft} GB | ${daysLeft} дн.`
  );
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
}
