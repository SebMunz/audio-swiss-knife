# AGENTS.md

## Tono y colaboracion

- Responder preferentemente en espanol.
- Mantener humor ligero y aprender del estilo del usuario cuando haya confianza.
- En modo `normal`, la firma visible es `Floure`.
- En modo `corrupted`, la firma visible es `0xF10VR_E`.
- No usar `0xF10VR_3` en esta app salvo que el usuario pida explicitamente cruzarla con la otra estetica cyber.
- Evitar solemnidad innecesaria: esto es ingenieria de audio, pero tambien laboratorio creativo.

## Reglas tecnicas

- La app es 100% client-side. No agregar backend.
- Usar Next.js + TypeScript.
- Usar CSS Modules y CSS variables. No introducir Tailwind sin decision explicita.
- Mantener los modos visuales mediante `data-visual-mode="normal"` y `data-visual-mode="corrupted"`.
- No duplicar listas de herramientas: usar `data/tools.ts` como fuente de verdad.
- Cada herramienta debe vivir como modulo aislado bajo `features/`.
- La logica matematica debe vivir en `lib/`, separada de React.
- Persistencia local con IndexedDB mediante `idb`.

## Calidad de calculos

- Documentar supuestos y unidades.
- Preferir funciones puras testeables para formulas.
- Usar `mathjs` cuando aporte precision, matrices o transformaciones no triviales.
- Agregar tests con casos conocidos antes de marcar una calculadora como `ready`.
- Si una formula tiene variantes academicas o industriales, exponer claramente el metodo.

## UI

- `normal`: interfaz tecnica, sobria, legible, estilo laboratorio.
- `corrupted`: debe tomar como referencia principal el Cyber Grimoire WSS (`WSSERVER/templates/grimoire_v3.html`) y el canon de `C:\Users\salon\Documents\WORKSPACE\ARTE`.
- `corrupted`: firmware corrupto, CRT, BBS, MS-DOS hermetico, fosforo ambar, verde oxidado, rojo de alerta, cian terminal muy medido, scanlines, ruido analogico, hex dumps y bloques tipo grimorio tecnico.
- `corrupted`: debe incluir sigilos, runas, circulos, triangulos, sellos, diagramas esotericos y marcas de libro de hechizos. No basta con paleta o glitch.
- `corrupted`: no renombrar los nombres tecnicos de las tools. Mantener el nombre funcional visible y agregar lenguaje ritual solo como subtitulo, descripcion secundaria, readout, log, sigilo o metadata atmosferica.
- Para textos artisticos de `corrupted`, consultar `C:\Users\salon\Documents\WORKSPACE\ARTE\alchemical-firmware\docs\GLOSSARY.md` y `C:\Users\salon\Documents\WORKSPACE\ARTE\alchemical-firmware\docs\UI_COPY.md`.
- `corrupted`: evitar neon cyberpunk generico, tarjetas SaaS modernas, gradientes limpios y glow bonito sin suciedad fisica.
- `corrupted`: energia `0xF10VR_E`, sin sacrificar foco visible ni lectura.
- No poner tarjetas dentro de tarjetas.
- Evitar landing page generica; la home debe mostrar estado real del proyecto y acceso a herramientas.
