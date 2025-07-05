# Dev Script Backups

This folder contains versioned backups of the Dev script (`tnt.collection.dev.user.js`).

## Backup Files

Dev script backups follow the naming pattern:
```
tnt.collection.dev.YYYY-MM-DD.NN.user.js
```

## Commands

- `BACKUP DEV` - Create new backup here
- `LIST BACKUPS DEV` - Show all files in this folder
- `RESTORE DEV [number]` - Restore from specific backup
- `RESTORE DEV LATEST` - Restore from highest numbered backup

## Auto-increment Logic

The system scans this folder for existing backups, finds the highest running number, and uses the next number for new backups.

---
**Dev script backups are created here by the AI command system.**
