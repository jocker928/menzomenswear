# MENZO Menswear

Responsive, static storefront for MENZO Menswear. No build step is required.

## Preview

From this folder:

```powershell
python -m http.server 8080
```

Open `http://localhost:8080`.

## Deploy to your own Windows server

1. Install IIS and enable the **Static Content** feature.
2. Copy this entire folder to `V:\Sites\menzomenswear`.
3. In IIS Manager, add a website whose physical path is that folder.
4. Bind ports 80 and 443 to `menzomenswear.com` and `www.menzomenswear.com`.
5. Point the domain's `A` record to the server's public IP.
6. Install a TLS certificate (for example with win-acme/Let's Encrypt) and force HTTPS.

Your server needs a public/static IP, inbound ports 80/443, and router port forwarding. A V: drive alone cannot make a site public.

## Google Search

After the public HTTPS site works, add the domain to Google Search Console, verify DNS ownership, and submit:

`https://www.menzomenswear.com/sitemap.xml`

## Branded email

`hello@menzo.com` requires ownership of `menzo.com` plus an email host. Add the provider's MX, SPF, DKIM and DMARC DNS records. The website currently links to this address but does not create the mailbox.

## Before taking orders

Replace placeholder policies and social links, connect a real commerce backend/payment provider, add verified business address/GST details, and connect the newsletter form to an email service.
