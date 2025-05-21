# ✅ Configuración DNS para Antojo24 (Producción y Staging)

Este archivo detalla todos los registros necesarios en Hostinger para asegurar el correcto funcionamiento de los entornos de producción y staging en Netlify.

---

## 🌐 Producción

### Dominios:
- `antojo24.com`
- `www.antojo24.com`

### Registros DNS requeridos:

| Tipo  | Nombre | Valor                    | TTL   | Descripción                                     |
|-------|--------|--------------------------|--------|-------------------------------------------------|
| A     | @      | 75.2.60.5                | 14400 | Requerido para que Netlify sirva el root domain |
| CNAME | www    | antojo24.netlify.app     | 300    | Redirección de www hacia Netlify                |

---

## 🚧 Staging

### Dominio:
- `stg.antojo24.com`

### Registros DNS requeridos:

| Tipo  | Nombre | Valor                    | TTL   | Descripción                                |
|-------|--------|--------------------------|--------|--------------------------------------------|
| CNAME | stg    | antojo24.netlify.app     | 300    | Enlace directo a sitio de Netlify (staging) |

---

## 🔐 Certificados SSL (Let's Encrypt)

### Registros CAA requeridos (compartidos para prod y staging):

| Tipo | Nombre | Bandera | Etiqueta | Dominio           | TTL   | Descripción                         |
|------|--------|---------|----------|--------------------|--------|-------------------------------------|
| CAA  | @      | 0       | issue    | letsencrypt.org    | 14400 | Necesario para que Netlify emita SSL |
| CAA  | @      | 0       | issue    | globalsign.com     | 14400 | Opcional adicional                   |
| CAA  | @      | 0       | issue    | digicert.com       | 14400 | Opcional adicional                   |
| CAA  | @      | 0       | issue    | sectigo.com        | 14400 | Opcional adicional                   |

> ⚠️ Evitar usar `issuewild`, `comodoca.com` o `pki.goog` si no son necesarios, ya que pueden interferir con la validación SSL automática.

---

## ✅ Checklist final

- [x] `antojo24.com` responde con HTTPS
- [x] `www.antojo24.com` redirige correctamente
- [x] `stg.antojo24.com` está protegido con certificado válido
- [x] Todos los registros están propagados
- [x] Certificados Let’s Encrypt activos en ambos entornos

---

Última actualización: `2025-05-20`
