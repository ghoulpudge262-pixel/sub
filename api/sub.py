from http.server import BaseHTTPRequestHandler
import base64
import time

# ===== ТВОИ VLESS ССЫЛКИ =====
VLESS_LINKS = [
    "vless://29fd1aa4-b0a3-4cf6-9df8-071b3eb521be@de6.joybang.site:443?encryption=none&flow=xtls-rprx-vision&fp=chrome&pbk=Xh2KakYrLA2ob_ldEk76FbT8PKILpuT3rTJj8wKhizY&security=reality&sid=0880&sni=kion.ru&spx=%2FJK1t2ttc9manJEz&type=tcp#🇩🇪_Germany_Arbizz"
"vless://c186e71d-630d-480a-82e5-8c5535f47c3d@ee3.joybang.site:443?encryption=none&flow=xtls-rprx-vision&fp=chrome&pbk=sPX1OEUYYV3jtT1087zuVu7xmWQJ3O6X2FdYAQeg-3w&security=reality&sid=49bc&sni=kinopoisk.ru&spx=%2FP5Fs6G7WmlPAdwE&type=tcp#🇪🇪_Estonia_Arbizz"
"vless://99fdf061-2937-4668-8793-de6a4d2c6703@chz.joybang.site:443?encryption=none&flow=xtls-rprx-vision&fp=chrome&pbk=-eIeMbJt8qFvc-kCbUYg1ZOHzOHi5gCaSGAembG6MXo&security=reality&sid=85327f2e12&sni=epicgames.com&spx=%2F1U9OcpLiD0rwweg&type=tcp#🇨🇭_Switzerland_Arbizz"
"vless://6e6e8c17-085f-4361-9bee-aea20a5a3ea4@nl5.joybang.site:443?encryption=none&flow=xtls-rprx-vision&fp=chrome&pbk=oCiHWE6jMqYcn7GNyTYC7T-JuzuiJI74IthRpWe0uXo&security=reality&sid=33941f&sni=web.max.ru%3A443&spx=%2FKh7QNCUYgGd3nE7&type=tcp#🇳🇱_Netherlands_Arbizz"
"vless://078cf2f4-6b99-4272-a9a8-695f0ecf716e@se2.joybang.site:443?encryption=none&flow=xtls-rprx-vision&fp=chrome&pbk=K6KGrP9bSGdE1fse-ViNiSiWQLyaBBkbVzhj7f6KvjM&security=reality&sid=99d6cb3488333e31&sni=rutube.ru&spx=%2FxSuMFOfhXg3x4Qu&type=tcp#🇸🇪_Sweden_Arbizz"
"vless://88e770d3-dc35-421b-b80a-a506ae35444f@rus5.joybang.site:443?encryption=none&flow=xtls-rprx-vision&fp=chrome&pbk=FzrQfH8_NTfiFJW2Vy79EAudFH9-I-zkKk2PSr8vm3A&security=reality&sid=1d&sni=cloudcdn-m9-15.cdn.yandex.net&spx=%2FYOYYieobaztP7gn&type=tcp#🇷🇺_Russia_Arbizz"
"vless://7d8c30e0-e44d-4767-b5ac-b9eecf9bbf7e@fl3.joybang.site:443?encryption=none&flow=xtls-rprx-vision&fp=chrome&pbk=yfsqWoE6tbG-DgP_KeHHgLmivFLBGKJBAIwsUSYT5hE&security=reality&sid=c81b906d1366&sni=kaspersky.ru&spx=%less://c186e71d-630d-480a-82e5-8c5535f47c3d@ee3.joybang.site:443?encryption=none&flow=xtls-rprx-vision&fp=chrome&pbk=sPX1OEUYYV3jtT1087zuVu7xmWQJ3O6X2FdYAQeg-3w&security=reality&sid=49bc&sni=kinopoisk.ru&spx=%2FP5Fs6G7WmlPAdwE&type=tcp#🇪🇪%20Эстония%20—%20Premium"
]

# ===== НАЗВАНИЕ ПОДПИСКИ В ПРИЛОЖЕНИИ =====
PROFILE_TITLE = "🎉 ARBIZ VPN"

# Срок действия (в днях)
EXPIRE_DAYS = 30


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Объединяем ссылки и кодируем в Base64
        plain_text = "\n".join(VLESS_LINKS)
        encoded = base64.b64encode(plain_text.encode()).decode()

        # Срок действия
        expire_timestamp = int(time.time()) + (EXPIRE_DAYS * 86400)

        # Кодируем название в Base64 для emoji
        title_encoded = base64.b64encode(PROFILE_TITLE.encode()).decode()

        # Отправляем ответ
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Profile-Title", f"base64:{title_encoded}")
        self.send_header("Profile-Update-Interval", "24")
        self.send_header(
            "Subscription-Userinfo",
            f"upload=0; download=0; total=107374182400; expire={expire_timestamp}"
        )
        self.send_header("Support-URL", "https://t.me/ArbizzVPNbot")
        self.end_headers()
        self.wfile.write(encoded.encode())
        return
