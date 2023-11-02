# HT2023 DT162G Datateknik GR (B), Javascriptbaserad webbutveckling, 7,5 hp (distans) - Moment 2 | maka2207/WKL

## Moment 2 - NodeJS

### KOMMA IGÅNG lokalt

1. Dra hem repo med git clone.

2. Kör `npm install` i Terminalen för att installera allt.

3. Kör `npm start` för att starta lokalt och besök sedan: http://localhost:3000/ alternativt http://localhost:3000/courses

### ENDPOINTS MED MERA

_BRA ATT VETA:_ Meddelanden från REST API-webbtjänsten visas under rubriken "Lägg till ny kurs" i webbklienten via `message:`-JSON-objektegenskapen.

- Endpoints (när data hämtas via REST API Webbtjänst):

  - GET http://localhost:3000/api/courses - Hämta all kurser
  - POST http://localhost:3000/api/courses - Lägg till ny kurs
  - GET http://localhost:3000/api/courses/:id - Hämta kurs med :id = \_id
  - PUT http://localhost:3000/api/courses/:id - Uppdatera kurs med :id = \_id
  - DELETE http://localhost:3000/api/courses/:id - Radera kurs med :id = \_id

- Endpoints i webbläsaren (när du skriver in direkt i webbläsarens adressfält):
  - http://localhost:3000/courses/ - Hämta alla kurser
  - http://localhost:3000/courses/:id - Visa enbart kursen med :id

Skulle en kurs inte finnas som försöker kommas åt i webbläsaren så meddelas det där med samma felmeddelande som ges via `/api/`-endpoints.

_OBS:_ När du lägger till, raderar eller modifierar enbart en visad kurs så kommer den att ladda om alla övriga tillgängliga kurser på nytt dock!

**\_VIKTIGT:** I webbläsaren kan du lägga till ny kurs, radera befintliga kurser, återställa allt (raderar `courses.json` och kopierar `courses-BACKUP.json` till ny `courses.json`), och redigera befintliga kurser genom att skriva i deras `contentEditable`-fält och sedan lämna/byta fokus från dem (dessa gäller kolumnerna Kurskod, Kursnamn och Period).

Mycket nöje!

Mycket Varma VinterHälsningar,
maka2207/WebbKodsLärlingen
