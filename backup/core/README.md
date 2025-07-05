# Core Script Backups

This folder contains versioned backups of the Core script (`tnt.collection.core.user.js`).

## Backup Files

Core script backups follow the naming pattern:
```
tnt.collection.core.YYYY-MM-DD.NN.user.js
```

## Commands

- `BACKUP CORE` - Create new backup here
- `LIST BACKUPS CORE` - Show all files in this folder
- `RESTORE CORE [number]` - Restore from specific backup
- `RESTORE CORE LATEST` - Restore from highest numbered backup

## Auto-increment Logic

The system scans this folder for existing backups, finds the highest running number, and uses the next number for new backups.

---
**Core script backups are created here by the AI command system.**
