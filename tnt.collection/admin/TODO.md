# TNT Collection - TODO List

## 📋 **Core Features**

- [ ] Use Ikariam's own tooltips:
- [ ] Auto hide tables:
    - Have an option to make the tables visible on hover only (Same effect as clicking min/max button)
- [ ] The ability to set different triggers on buildings
    - The idea: You can set a max level on a building and it will make the collapse the Upgrade building box
- [ ] Building table navigation: Click on building level sends user to the city the building is in and opens the building's dialog (Could be extended with build option. Depends a little on 1. Use Ikariam's own tooltips)
- [ ] Building sorting options:
    - [ ] Sort by Ikariam's custom sorting (Ikariam -> Options -> Game Options)
    - [ ] Sort by resource type
    - [ ] Sort alphabetically
- [ ] Detect rebellion:
    - [ ] Make the city column cell red, to show they are angry. Maybe have to be based on wine $storage / $usage 

---

## 🐛 **Current Issues**
**Issues have been moved to [ISSUES.md](ISSUES.md) for better tracking and organization.**

---

## 🤖 **AI Assistant Architectural Suggestions**

### **Code Organization & Performance**
- [ ] **Extract building detection logic into utilities**
    - [X] ✅ Approved - [ ] ❌ Rejected - [ ] 💬 Discuss
    - **Details**: Building detection/parsing logic is duplicated across `scanAllBuildings()`, level extraction, and construction detection. Could extract into `tnt.utils.buildingParser` module.

- [ ] **Centralize city data object creation**
    - [X] ✅ Approved - [ ] ❌ Rejected - [ ] 💬 Discuss
    - **Details**: City data structure creation in `collectOwnCityData()` and `collectForeignCityData()` follows same pattern. Could create `tnt.utils.createCityDataObject(baseData, additionalProps)` function.

- [ ] **Standardize safe DOM access patterns**
    - [X] ✅ Approved - [ ] ❌ Rejected - [ ] 💬 Discuss
    - **Details**: Many manual try/catch blocks exist alongside `safeGet()` utility. Could expand `safeGet()` to handle more patterns or create additional safe access utilities.

### **City Switcher Optimizations**
- [ ] **Investigate Ikariam's internal ready states**
    - [X] ✅ Approved - [ ] ❌ Rejected - [ ] 💬 Discuss
    - **Details**: Research `ikariam.model`, `ajax.Responder`, and view change events to find native ready indicators instead of using fixed timeouts.

- [ ] **Implement hybrid timing approach**
    - [X] ✅ Approved - [ ] ❌ Rejected - [ ] 💬 Discuss
    - **Details**: Combine Ikariam ready state checks with conservative timeout fallbacks (e.g., 100ms intervals + 1000ms maximum wait).

### **User Experience Improvements**  
- [ ] **Add visual feedback for long operations**
    - [ ] ✅ Approved - [ ] ❌ Rejected - [X] 💬 Discuss
    - **Details**: Show progress indicators, city counts, or operation status during city switching and data collection.
        `RJJ`: We already show the green idicators on City Switcher, but could be a thing for when we auto start. And it may be usefull with other long running functions.

- [ ] **Improve error recovery mechanisms**
    - [ ] ✅ Approved - [ ] ❌ Rejected - [x] 💬 Discuss
    - **Details**: Better handling of failed city switches, network timeouts, and partial data collection scenarios.
        `RJJ`: Only if we need it. But you may convince me otherwise.

### **Technical Debt Reduction**
- [ ] **Consolidate duplicate event handler patterns**
    - [x] ✅ Approved - [ ] ❌ Rejected - [ ] 💬 Discuss
    - **Details**: Event attachment in `attachEventHandlers()` follows repetitive patterns that could be abstracted into helper functions.

- [ ] **Extract common table cell generation logic**
    - [x] ✅ Approved - [ ] ❌ Rejected - [ ] 💬 Discuss
    - **Details**: HTML generation in table builders has repetitive cell creation patterns that could use utility functions for common cell types.

---

**Legend:**
- [ ] Not started
- [x] Completed
- ✅ Approved for implementation
- ❌ Rejected - not pursuing
- 💬 Discuss - needs further discussion

---

**Others**
- `RJJ` Ronny's comments
