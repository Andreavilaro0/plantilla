#!/bin/bash

# Script para actualizar la aplicación ya desplegada en Azure
# Úsalo después del primer despliegue para subir cambios

set -e

# ============================================
# CONFIGURACIÓN - Debe coincidir con deploy-azure.sh
# ============================================
RESOURCE_GROUP="mi-portfolio-rg"
WEB_APP_NAME="mi-portfolio-web-2024"  # DEBE SER EL MISMO QUE USASTE

# ============================================
# COLORES
# ============================================
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Actualizando Portfolio en Azure${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Build
echo -e "${GREEN}[1/4] Construyendo aplicación...${NC}"
npm run build

# Copiar web.config
echo -e "${GREEN}[2/4] Copiando archivos de configuración...${NC}"
cp web.config dist/

# Crear ZIP
echo -e "${GREEN}[3/4] Creando paquete...${NC}"
cd dist
zip -r ../deploy.zip * > /dev/null
cd ..

# Desplegar
echo -e "${GREEN}[4/4] Desplegando a Azure...${NC}"
az webapp deployment source config-zip \
  --resource-group $RESOURCE_GROUP \
  --name $WEB_APP_NAME \
  --src deploy.zip

# Limpiar
rm deploy.zip

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}  ¡Actualización Completada!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "Tu aplicación actualizada está en:"
echo -e "${BLUE}https://${WEB_APP_NAME}.azurewebsites.net${NC}"
echo ""
