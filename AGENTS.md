# Directivas del proyecto chinito-cultura

Estas reglas valen para cualquier cambio futuro de este blog.

## Qué es
Blog local de las píldoras de cultura china publicadas por el agente Chinito_cultura. Se lee como una grilla de tarjetas y una vista de detalle por píldora.

## Ubicación
El proyecto vive en `/home/damian/Documentos/laboratorio/chinito-cultura`. No tocar los otros proyectos de `laboratorio`.

## Contenido
- Las píldoras se guardan en `pildoras.json`.
- La vista de detalle se genera de forma dinámica con JavaScript nativo, leyendo ese JSON.
- Cada píldora debe mencionar sus fuentes, con enlace cuando exista URL.
- No inventar datos ni fuentes. Si una fuente no se puede verificar, no se agrega la píldora.
- El texto está en español rioplatense, como las píldoras originales.
- El pie de página debe decir exactamente: `Contenido generado con IA`.

## Técnica
- HTML con etiquetas semánticas (`header`, `main`, `article`, `section`, `nav`, `footer`, `time`).
- Todo nativo: no usar librerías ni frameworks de CSS ni de JavaScript.
- Las transiciones entre la grilla y el detalle se hacen con CSS.
- El diseño es responsive (se adapta a celular y escritorio).
- Cada píldora tiene una imagen decorativa al estilo caricatura 3D de los videos de Chinito_videos. Cada imagen pesa 50 KB o menos.

## Cómo sumar una píldora
1. Agregar un objeto en `pildoras.json` con `id`, `date`, `category`, `title`, `emoji`, `body` (markdown simple), `image` y `sources`.
2. Guardar la imagen en `imagenes/` y comprimirla para que no supere los 50 KB.
3. Verificar que el `id` no se repita y que las fuentes tengan título y URL reales.
