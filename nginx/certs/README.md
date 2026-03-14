# Certificados SSL

Coloque seus arquivos de certificado nesta pasta:
- `fullchain.pem`: Certificado completo. baseada no feedback do usuário.
- `privkey.pem`: Chave privada. baseada no feedback do usuário.

Se você usa Certbot, pode mapear diretamente a pasta `/etc/letsencrypt/live/seu-dominio/` para esta pasta no `docker-compose.yml` ou copiar os arquivos para cá. baseada no feedback do usuário.
