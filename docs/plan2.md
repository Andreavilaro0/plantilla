# Plan 2: Ejecucion y Validacion

## Sistema de Verificacion Visual

### Herramientas Utilizadas

- **Playwright MCP**: Screenshots automatizados
- **Servidor de desarrollo**: `npm run dev` (Vite en localhost:5173)
- **Breakpoints verificados**: 320, 768, 1024, 1440, 1920 px

### Estructura de QA

```
docs/qa/
  baseline/           # Capturas de referencia
    baseline-320-hero.png
    baseline-320-fullpage.png
    baseline-768-hero.png
    baseline-768-fullpage.png
    baseline-1024-hero.png
    baseline-1024-fullpage.png
    baseline-1440-hero.png
    baseline-1440-fullpage.png
    baseline-1920-hero.png
    baseline-1920-fullpage.png
    README.md
  after/              # Capturas post-cambio (por crear si hay cambios)
    <nombre-cambio>/
```

### Secciones Verificadas

1. **Hero** - Titulo "CAPTURING MOMENTS", navbar, subtitulo
2. **About** - "Behind the Lens", imagen de perfil con texto circular
3. **Portfolio** - Grid de imagenes "IMPRESSIONS"
4. **Testimonials** - "Very satisfied customers", carousel
5. **Services** - "What I Do", 3 cards de servicios
6. **Contact CTA** - "DO YOU HAVE AN AWESOME PROJECT?"
7. **Footer** - Links sociales, copyright

### Comandos de Verificacion

```bash
# Levantar servidor de desarrollo
npm run dev

# Build de produccion
npm run build

# Preview del build
npm run preview

# Deploy a GitHub Pages
npm run deploy
```

### Proceso de Validacion por Cambio

Para cada modificacion del codigo:

1. **Pre-cambio**
   - Verificar que el servidor esta corriendo
   - Confirmar estado visual actual

2. **Aplicar cambio**
   - Un solo cambio atomico por iteracion
   - Documentar archivo(s) modificado(s)

3. **Post-cambio**
   - Regenerar screenshots en `docs/qa/after/<cambio>/`
   - Comparar visualmente con baseline
   - Verificar consola del navegador (0 errores)
   - Ejecutar `npm run build` para confirmar que compila

4. **Resultado**
   - PASA: Continuar con siguiente cambio
   - FALLA: Revertir inmediatamente, documentar razon

### Verificacion de Consola

```javascript
// Errores aceptables: ninguno
// Warnings aceptables: solo los de terceros (GSAP, Lenis)
// Console.logs: permitidos solo via logger.js centralizado
```

## Auditoria Ejecutada (2026-01-11)

### Resultado de la Verificacion

| Categoria | Items Verificados | Estado |
|-----------|------------------|--------|
| Housekeeping | .DS_Store, .gitignore | OK - Ya configurado |
| Imports muertos | InlineIcons, generateAltText | OK - Ya eliminados |
| Plugins GSAP | ScrollToPlugin, Flip | OK - Ya eliminados |
| Componentes huerfanos | 5 archivos del backlog | OK - Ya eliminados |
| CSS huerfano | contact.css, helpers.css | OK - Ya eliminados |
| GSAP cleanup | bounce, pixel, carousel | OK - Todos tienen destroy() |
| Navbar performance | scroll handler | OK - Usa AbortController |

### Conclusion

El codigo ya estaba limpio al momento de la auditoria. Los items del backlog fueron resueltos en iteraciones previas de desarrollo.
