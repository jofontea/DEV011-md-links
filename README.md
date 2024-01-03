# jofontea-md-links

`jofontea-md-links` es una biblioteca para extraer enlaces de archivos Markdown y realizar diversas operaciones como validación y estadísticas.
## Índice
- [Instalación](#instalación)
- [Uso](#uso)
  - [Obtener información de enlaces](#obtener-información-de-enlaces)
  - [Validar enlaces](#validar-enlaces)
  - [Estadísticas de enlaces](#estadísticas-de-enlaces)
  - [Validar enlaces y obtener estadísticas](#validar-enlaces-y-obtener-estadísticas)
- [Ejemplos de Resultados](#ejemplos-de-resultados)
  - [Resultado solo con la ruta](#resultado-solo-con-la-ruta)
  - [Resultado con --validate](#resultado-con-validate)
  - [Resultado con --stats](#resultado-con-stats)
  - [Resultado con --stats y --validate](#resultado-con-stats-y-validate)
- [Contribución](#contribución)

## Instalación
Para instalar `jofontea-md-links`, asegúrate de tener [Node.js](https://nodejs.org/) instalado en tu sistema. Luego, utiliza el siguiente comando:
```shell
npm install jofontea-md-links
```

# Uso

## Obtener información de enlaces

Para obtener información sobre los enlaces en un archivo Markdown, utiliza el siguiente comando:

```bash
jofontea-md-links "ruta/al/archivo.md"
```
El resultado será un array que muestra información sobre los enlaces, como el href (URL), el text (texto del enlace) y la file (ruta del archivo).

## Validar enlaces
Para validar el estado de los enlaces en un archivo Markdown, utiliza el siguiente comando:
```bash
jofontea-md-links "ruta/al/archivo.md" --validate
```
El resultado mostrará información adicional, como el status (código de estado HTTP) y el ok (estado de la validación).

## Estadísticas de enlaces
Para obtener estadísticas básicas sobre los enlaces en un archivo Markdown, utiliza el siguiente comando:
```bash
jofontea-md-links "ruta/al/archivo.md" --stats
```
El resultado mostrará el número total de enlaces y el número de enlaces únicos.

## Validar enlaces y obtener estadísticas
Para realizar una validación de enlaces y obtener estadísticas al mismo tiempo, utiliza el siguiente comando:
```bash
jofontea-md-links "ruta/al/archivo.md" --stats --validate
```
El resultado mostrará el número total de enlaces, el número de enlaces únicos, el número de enlaces activos y el número de enlaces rotos.

# Ejemplos de Resultados

## Resultado solo con la ruta
```bash
jofontea-md-links "fake-README.md"

Resultado links [
  {
    href: '#1-consideraciones-generales',
    text: '1. Consideraciones generales',
    file: 'ruta/al/archivo.md'
  },
]
```
## Resultado con --validate
```bash
jofontea-md-links "fake-README.md" --validate

Resultado de validación [
  {
    href: '#1-consideraciones-generales',
    text: '1. Consideraciones generales',
    file: 'ruta/al/archivo.md',
    status: 404,
    ok: 'fail'
  },
]
```
## Resultado con --stats
```bash
jofontea-md-links "fake-README.md" --stats

Estadísticas { total: 5, unique: 5 }
```

## Resultado con --stats y --validate
```bash
jofontea-md-links "fake-README.md" --stats --validate

Resultado de validación y estadísticas { total: 5, unique: 5, active: 2, broken: 3 }
```
## Contribución

¡Todas las contribuciones son bienvenidas! Si deseas colaborar en este proyecto, por favor sigue estos pasos:

1. Realiza un fork del repositorio.
2. Crea una rama con la nueva funcionalidad o solución a un problema.
3. Envía un pull request.

¡Gracias por contribuir!