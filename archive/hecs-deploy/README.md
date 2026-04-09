# Hecs Legacy Deployment (Docker Compose)

Этот контур предназначен для запуска legacy Django-сервиса `hecs` на `hecs.intdata.pro`.

## 1. Подготовка на сервере

```bash
sudo mkdir -p /opt/hecs
sudo chown -R $USER:$USER /opt/hecs
```

Скопируйте в `/opt/hecs` каталоги:
- `hecs` (из `archive/hecs`)
- `hecs-deploy` (из `archive/hecs-deploy`)

Ожидаемая структура:

```text
/opt/hecs/hecs
/opt/hecs/hecs-deploy
```

## 2. Runtime env

```bash
cd /opt/hecs/hecs-deploy
cp .env.example .env
```

Обязательно задайте уникальный `SECRET_KEY`.

## 3. Запуск контейнера

```bash
cd /opt/hecs/hecs-deploy
docker compose up -d --build
docker compose exec web python manage.py migrate
docker compose exec web python manage.py collectstatic --noinput
docker compose exec web python manage.py createsuperuser
docker compose ps
```

## 4. Nginx

```bash
sudo cp /opt/hecs/hecs-deploy/nginx-hecs.conf /etc/nginx/sites-available/hecs.intdata.pro.conf
sudo ln -sf /etc/nginx/sites-available/hecs.intdata.pro.conf /etc/nginx/sites-enabled/hecs.intdata.pro.conf
sudo nginx -t
sudo systemctl reload nginx
```

Создайте basic-auth файл для `/admin`:

```bash
sudo apt-get update && sudo apt-get install -y apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd-hecs-admin <admin_user>
sudo nginx -t && sudo systemctl reload nginx
```

## 5. TLS (certbot)

```bash
sudo certbot --nginx -d hecs.intdata.pro --redirect -m admin@intdata.pro --agree-tos --no-eff-email
```

Проверка автопродления:

```bash
systemctl status certbot.timer
```

## 6. Smoke checks

```bash
curl -I http://127.0.0.1:18080/healthz
curl -I https://hecs.intdata.pro/healthz
docker compose logs --tail=100 web
```
