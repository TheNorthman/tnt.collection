# TNT Collection - Known Issues

## 🐛 **Active Issues**

### **#001 Premium trader and resource shop keeps coming back**
- **Status**: 🔍 Under Investigation
- **Priority**: Medium
- **Description**: Premium trader and resource shop elements reappear despite being hidden. Must have something to do with background updates.
- **Affected**: City view
- **Workaround**: None currently
- **Notes**: Related to AJAX background updates possibly re-adding elements

### **#002 Resource indicators don't work**
- **Status**: 🔍 Under Investigation  
- **Priority**: Medium
- **Description**: Resource indicators are not functioning as expected. No background colors are seen in the resource table.
- **Affected**: Resource display system
- **Workaround**: None currently
- **Notes**: Min/max is solved. Still need to look at tnt_storage_danger (storage_danger is used by Ikariam)

### **#003 Population/Citizen should be shown as Integer in the total row**
- **Status**: 📋 Confirmed
- **Priority**: Low
- **Description**: Total row shows population/citizen values with decimals instead of whole numbers
- **Affected**: Resource table totals
- **Workaround**: None needed
- **Notes**: Simple formatting fix needed in totals calculation

### **#004 Control buttons should be align correctly**
- **Status**: 📋 Confirmed
- **Priority**: Low  
- **Description**: Control buttons (minimize/maximize, toggle, refresh) alignment issues
- **Affected**: External control styling
- **Workaround**: None needed
- **Notes**: CSS alignment adjustment needed

---

## 📋 **Issue Status Legend**
- 🔍 **Under Investigation** - Actively researching cause
- 📋 **Confirmed** - Issue reproduced and understood
- 🔧 **In Progress** - Currently being fixed
- ✅ **Resolved** - Fixed and tested
- ❌ **Closed** - Not fixing (duplicate, won't fix, etc.)

## 🚀 **Priority Levels**
- **High** - Breaks core functionality
- **Medium** - Affects user experience
- **Low** - Minor cosmetic or convenience issues

## 📝 **Resolved Issues**
*Issues will be moved here when completed*

---

**Last Updated**: 2025-06-18  
**Total Active Issues**: 4
