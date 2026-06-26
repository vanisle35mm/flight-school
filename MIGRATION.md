# Flight School React Migration

This workspace is the React/Vite migration shell for the legacy single-file Flight School app.

## Preserved data contract

- Current localStorage key: `groundschool_v496`
- Older fallback key: `groundschool_v47`
- Storage helpers live in `src/lib/storage.ts` and normalize legacy data before saving it back to `groundschool_v496`.

## Feature structure

- `src/features/dashboard`: dashboard summary, stat cards, study status, weather placement.
- `src/features/weather`: CYYJ constants, METAR.Live link, Open-Meteo dashboard snapshot helper.
- `src/features/notes`: class/session notes migration surface.
- `src/features/tasks`: todo migration surface and due-soon behavior.
- `src/features/flashcards`: imported class flashcards plus PSTAR deck summary.
- `src/features/pstar`: first PSTAR practice scaffold using a seed question bank.
- `src/data/pstarQuestions.ts`: seed PSTAR data; next migration step is replacing this with the full legacy question bank.

## Next migration steps

1. Move the full legacy `TC_PSTAR_QUESTIONS` and `TC_PSTAR_MORE_QUESTIONS` arrays into `src/data/pstarQuestions.ts`.
2. Replace placeholder note/task add flows with editable forms matching the old app.
3. Add imported flashcard review controls and practice scoring history.
4. Decide whether weather should stay as external METAR.Live plus Open-Meteo snapshot or regain the old local helper API route.
