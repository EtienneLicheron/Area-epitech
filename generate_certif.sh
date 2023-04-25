#!/usr/bin/env bash
# Generate a self-signed certificate for a https server
# Usage: generate_certif.sh <domain_name>
# Example: generate_certif.sh localhost
#

DOMAIN=$1
if [ -z "$DOMAIN" ]; then
    echo "Usage: generate_certif.sh <domain_name>"
    exit 1
fi

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
  echo "Error: certbot is not installed"
  exit 1
fi

# Check is drectory certificates/ exists
if [ ! -d "certificates" ]; then
  mkdir certificates
fi

# Generate certificate
sudo certbot certonly --standalone -d $DOMAIN --agree-tos --register-unsafely-without-email --no-eff-email --expand --rsa-key-size 4096 --cert-name $DOMAIN

# Copy certificate and key to certificates/
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem certificates/$DOMAIN.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem certificates/$DOMAIN.key

echo "Created certificate for $DOMAIN: certificates/$DOMAIN.pem ; certificates/$DOMAIN.key"
