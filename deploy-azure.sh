#!/bin/bash

# Script de despliegue rápido a Azure
# Asegúrate de haber editado las variables antes de ejecutar

set -e

# ============================================
# CONFIGURACIÓN - EDITA ESTAS VARIABLES
# ============================================
RESOURCE_GROUP="mi-portfolio-rg"
APP_SERVICE_PLAN="mi-portfolio-plan"
WEB_APP_NAME="mi-portfolio-web-2024"  # DEBE SER ÚNICO EN TODO AZURE
LOCATION="westeurope"
SKU="F1"  # F1=Gratis, B1=Básico, S1=Standard

# ============================================
# COLORES PARA OUTPUT
# ============================================
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Despliegue de Portfolio a Azure${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Verificar que Azure CLI está instalado
if ! command -v az &> /dev/null; then
    echo -e "${YELLOW}Azure CLI no está instalado.${NC}"
    echo "Instálalo con: brew install azure-cli"
    exit 1
fi

# Login a Azure
echo -e "${GREEN}[1/7] Iniciando sesión en Azure...${NC}"
az login

# Crear Resource Group
echo -e "${GREEN}[2/7] Creando Resource Group...${NC}"
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION \
  --output table

# Crear App Service Plan
echo -e "${GREEN}[3/7] Creando App Service Plan...${NC}"
az appservice plan create \
  --name $APP_SERVICE_PLAN \
  --resource-group $RESOURCE_GROUP \
  --sku $SKU \
  --is-linux \
  --output table

# Crear Web App
echo -e "${GREEN}[4/7] Creando Web App...${NC}"
az webapp create \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --runtime "NODE:20-lts" \
  --output table

# Configurar para aplicaciones SPA
echo -e "${GREEN}[5/7] Configurando aplicación...${NC}"
az webapp config appsettings set \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings WEBSITE_NODE_DEFAULT_VERSION=20-lts \
  --output table

# Habilitar HTTPS
echo -e "${GREEN}[6/7] Habilitando HTTPS...${NC}"
az webapp update \
  --name $WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --set httpsOnly=true \
  --output table

# Build y despliegue
echo -e "${GREEN}[7/7] Construyendo y desplegando aplicación...${NC}"
echo "Ejecutando npm run build..."
npm run build

# Copiar web.config a dist
cp web.config dist/

# Crear ZIP
echo "Creando archivo ZIP..."
cd dist
zip -r ../deploy.zip * > /dev/null
cd ..

# Desplegar
echo "Desplegando a Azure..."
az webapp deployment source config-zip \
  --resource-group $RESOURCE_GROUP \
  --name $WEB_APP_NAME \
  --src deploy.zip

# Limpiar
rm deploy.zip

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  ¡Despliegue Completado!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "Tu aplicación está disponible en:"
echo -e "${BLUE}https://${WEB_APP_NAME}.azurewebsites.net${NC}"
echo ""
echo "Comandos útiles:"
echo "  Ver logs:     az webapp log tail --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP"
echo "  Reiniciar:    az webapp restart --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP"
echo "  Eliminar:     az group delete --name $RESOURCE_GROUP"
echo ""
