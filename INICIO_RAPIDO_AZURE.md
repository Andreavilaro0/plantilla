# 🚀 Despliegue Rápido a Azure

## ✅ Todo está listo!

Ya he preparado todos los archivos necesarios para desplegar tu portfolio en Azure App Service.

---

## 📋 Opción 1: Despliegue Automático (Recomendado)

### Paso 1: Editar configuración

Abre el archivo `deploy-azure.sh` y edita estas líneas al inicio:

```bash
WEB_APP_NAME="mi-portfolio-web-2024"  # Cambia esto por un nombre único
```

El nombre debe ser único en todo Azure (ejemplo: `portfolio-andrea-2024`).

### Paso 2: Ejecutar el script

```bash
./deploy-azure.sh
```

Este script hará **todo automáticamente**:

- ✅ Login en Azure
- ✅ Crear Resource Group
- ✅ Crear App Service
- ✅ Construir tu aplicación
- ✅ Desplegarla

**¡Eso es todo!** Tu sitio estará en línea en unos minutos.

---

## 📋 Opción 2: Despliegue Manual Paso a Paso

Si prefieres hacerlo manualmente, sigue esta guía:

### 1. Login en Azure

```bash
az login
```

### 2. Crear recursos

```bash
# Resource Group
az group create --name mi-portfolio-rg --location westeurope

# App Service Plan (Gratis)
az appservice plan create \
  --name mi-portfolio-plan \
  --resource-group mi-portfolio-rg \
  --sku F1 \
  --is-linux

# Web App (cambia el nombre por uno único)
az webapp create \
  --name MI-NOMBRE-UNICO \
  --resource-group mi-portfolio-rg \
  --plan mi-portfolio-plan \
  --runtime "NODE:20-lts"
```

### 3. Construir y desplegar

```bash
# Build
npm run build

# Copiar web.config
cp web.config dist/

# Crear ZIP
cd dist && zip -r ../deploy.zip * && cd ..

# Desplegar
az webapp deployment source config-zip \
  --resource-group mi-portfolio-rg \
  --name MI-NOMBRE-UNICO \
  --src deploy.zip

# Limpiar
rm deploy.zip
```

---

## 🌐 Acceder a tu sitio

Tu portfolio estará disponible en:

```
https://TU-NOMBRE.azurewebsites.net
```

---

## 🔧 Comandos Útiles

### Ver logs en tiempo real

```bash
az webapp log tail --name TU-NOMBRE --resource-group mi-portfolio-rg
```

### Reiniciar la aplicación

```bash
az webapp restart --name TU-NOMBRE --resource-group mi-portfolio-rg
```

### Ver información de la app

```bash
az webapp show --name TU-NOMBRE --resource-group mi-portfolio-rg
```

### Eliminar todos los recursos (para empezar de nuevo)

```bash
az group delete --name mi-portfolio-rg
```

---

## 💰 Costos

- **Tier F1 (Gratis)**: $0/mes

  - 1 GB de RAM
  - 1 GB de almacenamiento
  - 60 minutos de CPU por día
  - Perfecto para portfolios y demos

- **Tier B1 (Básico)**: ~$13/mes
  - 1.75 GB de RAM
  - 10 GB de almacenamiento
  - Sin límite de CPU
  - Dominio personalizado con SSL

---

## ❓ Solución de Problemas

### Si el sitio muestra error 500:

1. Verifica los logs: `az webapp log tail --name TU-NOMBRE --resource-group mi-portfolio-rg`
2. Asegúrate de que `web.config` está en la carpeta dist
3. Reinicia la app: `az webapp restart --name TU-NOMBRE --resource-group mi-portfolio-rg`

### Si falta Azure CLI:

```bash
brew install azure-cli
```

### Si el nombre ya existe:

Cambia `WEB_APP_NAME` en `deploy-azure.sh` por algo más único, como:

- `portfolio-tunombre-2024`
- `tunombre-dev-portfolio`
- `portfolio-tunombre-fecha`

---

## 📚 Documentación Completa

Para más detalles y opciones avanzadas, consulta `DEPLOY_AZURE.md`

---

## 🎉 ¡Próximos Pasos!

Después de desplegar:

1. **Configura tu dominio personalizado** (opcional)
2. **Habilita SSL/HTTPS** (viene habilitado por defecto)
3. **Actualiza tu portfolio**: Solo ejecuta `./deploy-azure.sh` de nuevo

---

**¿Listo para desplegar?** Ejecuta:

```bash
./deploy-azure.sh
```
