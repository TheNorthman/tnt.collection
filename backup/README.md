# TNT Collection - Versioned Backup System

## 🎯 THE OFFICIAL BACKUP SYSTEM

This is the **ONLY** backup system for TNT Collection. All previous backup approaches have been replaced by this versioned backup system.

### ✅ What Was Replaced
- **Old stable system** at `docs/development/stable/` → **REMOVED**
- **Single-file backups** → **Versioned backups with timestamps**
- **Manual procedures** → **Command-based automation**

## 📂 Backup Structure

This folder contains versioned backups of TNT Collection scripts with timestamps and incrementing numbers.

```
backup/
├── core/
│   ├── tnt.collection.core.2025-06-14.01.user.js
│   ├── tnt.collection.core.2025-06-14.02.user.js
│   └── tnt.collection.core.2025-06-15.03.user.js
├── dev/
│   ├── tnt.collection.dev.2025-06-14.01.user.js
│   ├── tnt.collection.dev.2025-06-14.02.user.js
│   └── tnt.collection.dev.2025-06-15.03.user.js
└── README.md (this file)
```

## 📋 Filename Format

`tnt.collection.{target}.{YYYY-MM-DD}.{NN}.user.js`

- **target**: `core` or `dev`
- **date**: When backup was created
- **number**: Auto-incrementing, never resets

## 🤖 Command System

### Create Backups
- `BACKUP CORE` - Create new Core backup
- `BACKUP DEV` - Create new Dev backup
- `BACKUP BOTH` - Create both backups

### List Backups
- `LIST BACKUPS CORE` - Show all Core backups
- `LIST BACKUPS DEV` - Show all Dev backups
- `LIST BACKUPS BOTH` - Show all backups

### Restore Backups
- `RESTORE CORE 03` - Restore from backup number 03
- `RESTORE DEV LATEST` - Restore from most recent Dev backup

## 🔢 Running Number Logic

- **Continuously incrementing**: 01 → 02 → 03 → 04...
- **Never resets**: Numbers keep growing across dates
- **Auto-detection**: System scans existing files to find next number
- **Cross-date**: Backup on 2025-06-15 continues from highest 2025-06-14 number

## 🛡️ Safety Features

- **Never overwrite**: Each backup gets unique number
- **Complete history**: All development stages preserved
- **Easy restore**: Restore any previous version
- **Validation**: System checks backup integrity

## 📊 Management Commands

- `VALIDATE BACKUPS` - Check all backups for issues
- `SIZE REPORT` - Show disk usage
- `CLEAN BACKUPS CORE 5` - Keep only last 5 Core backups
- `DIFF CORE 03 05` - Compare two backup versions

## 🗑️ Cleanup Status
- **✅ Old stable folder**: Removed (`docs/development/stable/`)
- **✅ Deprecated references**: Cleaned from documentation
- **✅ Command system**: Fully implemented and active
- **✅ Documentation**: Current and comprehensive

---

**This is the definitive backup system for TNT Collection.** All backup operations use this versioned approach with the command system interface.
