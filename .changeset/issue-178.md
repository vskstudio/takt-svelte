---
'@vskstudio/takt-svelte': minor
---

Aligne le wrapper sur `@vskstudio/takt-core` 0.9.0 (issue vskstudio/takt#178).

- Nouvelle option `debug` : prop `<Takt debug>` et attribut booléen `debug` sur `<takt-analytics>`, transmis à `createTakt`.
- Le no-op renvoyé par `useTakt()` avant le montage de `<Takt />` délègue désormais `optOut()` et `optIn()` aux fonctions module du cœur (localStorage `takt_ignore`) au lieu de les ignorer, et expose `isOptedOut()`.
- `optOut`, `optIn` et `isOptedOut` sont réexportés depuis la racine du paquet ; `./actions` ajoute `isOptedOut`.
- `scrubUrl` s'applique aussi au `props.url` des clics sortants et des téléchargements (comportement du cœur 0.9.0).
- Le peer `@vskstudio/takt-core` passe à `>=0.9.0`.
