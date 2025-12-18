# Despliegue en Azure App Service

Este documento contiene las instrucciones para desplegar tu portfolio en Azure App Service.

## Prerequisitos

1. **Cuenta de Azure**: Necesitas una cuenta activa de Azure
2. **Azure CLI**: Instalado en tu sistema

### Instalar Azure CLI (si no lo tienes)

**En macOS:**

```bash
brew install azure-cli
```

**O descarga desde:** https://aka.ms/installazureclimacos

## Pasos para Desplegar

### 1. Construir la aplicación localmente (opcional, para verificar)

```bash
npm run build
```

Esto creará una carpeta `dist` con los archivos compilados.

### 2. Iniciar sesión en Azure

```bash
az login
```

Esto abrirá tu navegador para que inicies sesión en Azure.

### 3. Crear un Resource Group (si no tienes uno)

```bash
az group create --name mi-portfolio-rg --location westeurope
```

### 4. Crear el App Service Plan

```bash
az appservice plan create \
  --name mi-portfolio-plan \
  --resource-group mi-portfolio-rg \
  --sku F1 \
  --is-linux
```

**Nota:** `F1` es el tier gratuito. Puedes cambiarlo a `B1` (básico) o superior si necesitas más recursos.

### 5. Crear la Web App

```bash
az webapp create \
  --name mi-portfolio-web \
  --resource-group mi-portfolio-rg \
  --plan mi-portfolio-plan \
  --runtime "NODE:20-lts"
```

**IMPORTANTE:** Cambia `mi-portfolio-web` por un nombre único (debe ser único en todo Azure).

### 6. Configurar despliegue desde Git local

```bash
# Inicializar git si no lo has hecho
git init
git add .
git commit -m "Initial commit"

# Configurar despliegue
az webapp deployment user set \
  --user-name <tu-usuario-deploy> \
  --password <tu-password-deploy>

# Obtener URL de Git
az webapp deployment source config-local-git \
  --name mi-portfolio-web \
  --resource-group mi-portfolio-rg
```

### 7. Desplegar la aplicación

```bash
# Agregar Azure como remote
git remote add azure <URL-que-obtuviste-en-paso-anterior>

# Hacer push a Azure
git push azure main
```

**O si tu rama principal es `master`:**

```bash
git push azure master
```

## Método Alternativo: Despliegue ZIP

Si prefieres un método más simple:

### 1. Construir la aplicación

```bash
npm run build
```

### 2. Crear un archivo ZIP del contenido de dist

```bash
cd dist
zip -r ../deploy.zip *
cd ..
```

### 3. Desplegar el ZIP

```bash
az webapp deployment source config-zip \
  --resource-group mi-portfolio-rg \
  --name mi-portfolio-web \
  --src deploy.zip
```

## Método más Simple: VS Code + Azure Extension

1. Instala la extensión "Azure App Service" en VS Code
2. Haz clic derecho en la carpeta `dist` (después de hacer `npm run build`)
3. Selecciona "Deploy to Web App"
4. Sigue las instrucciones en pantalla

## Verificar el Despliegue

Una vez desplegado, tu aplicación estará disponible en:

```
https://mi-portfolio-web.azurewebsites.net
```

## Configuración Adicional (Opcional)

### Configurar dominio personalizado

```bash
az webapp config hostname add \
  --webapp-name mi-portfolio-web \
  --resource-group mi-portfolio-rg \
  --hostname www.tudominio.com
```

### Habilitar HTTPS

```bash
az webapp update \
  --name mi-portfolio-web \
  --resource-group mi-portfolio-rg \
  --set httpsOnly=true
```

### Ver logs en tiempo real

```bash
az webapp log tail \
  --name mi-portfolio-web \
  --resource-group mi-portfolio-rg
```

## Comandos Útiles

### Ver estado de la aplicación

```bash
az webapp show \
  --name mi-portfolio-web \
  --resource-group mi-portfolio-rg
```

### Reiniciar la aplicación

```bash
az webapp restart \
  --name mi-portfolio-web \
  --resource-group mi-portfolio-rg
```

### Eliminar recursos (cuando ya no los necesites)

```bash
az group delete --name mi-portfolio-rg
```

## Solución de Problemas

### Si la aplicación no carga correctamente:

1. Verifica los logs:

```bash
az webapp log tail --name mi-portfolio-web --resource-group mi-portfolio-rg
```

2. Asegúrate de que `web.config` está en la carpeta dist

3. Verifica que el build se completó correctamente

### Si aparece error de Node version:

Configura la versión específica de Node:

```bash
az webapp config appsettings set \
  --name mi-portfolio-web \
  --resource-group mi-portfolio-rg \
  --settings WEBSITE_NODE_DEFAULT_VERSION=20-lts
```

## Notas Importantes

- ✅ Los archivos `web.config`, `.deployment` y `deploy.sh` ya están configurados
- ✅ El script de despliegue automáticamente copia `web.config` a la carpeta `dist`
- ⚠️ Recuerda cambiar los nombres de los recursos por nombres únicos
- 💡 El tier gratuito (F1) tiene limitaciones, considera upgradearlo para producción
