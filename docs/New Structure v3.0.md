# TNT Collection Tools
### Architecture & Structure Report *(Foundation Specification)*

---

## 1. Purpose & Vision
TNT Collection Tools is a userscript platform for the game Ikariam, not a single feature script.
Its purpose is to provide:

- A runtime shell
- A single authoritative Ikariam integration
- A modular first‑party feature system (Modules)
- A third‑party extension ecosystem (Plugins)

> By default, TNT Collection Tools does nothing. All functionality is opt‑in.

---

## 2. High‑Level Structural Model

The system is built around clear authority boundaries and trust levels.

```
┌─────────────────────────────────────────┐
│              Plugins (External)         │
│  - Stand‑alone scripts                  │
│  - Optional TNT integration             │
└─────────────────────────────────────────┘
                ▲
┌─────────────────────────────────────────┐
│              Modules (First‑party)      │
│  - Integrated features                  │
│  - Must use Ikariam module for data     │
└─────────────────────────────────────────┘
                ▲
┌─────────────────────────────────────────┐
│              Ikariam Module             │
│  - Single source of game truth          │
│  - Owns parsing, state, events          │
└─────────────────────────────────────────┘
                ▲
┌─────────────────────────────────────────┐
│                  Core                   │
│  - Loads, enables, orchestrates         │
│  - No feature logic                     │
└─────────────────────────────────────────┘
```

---

## 3. Core Responsibilities *(Locked)*

Core is intentionally minimal and inert.

**Core does:**

- Initialize shared services
- Initialize the Ikariam module
- Load module registry
- Load plugin metadata
- Enable / disable modules
- Provide minimal configuration UI

**Core does NOT:**

- Access Ikariam data
- Contain feature logic
- Parse responses
- Read or mutate game state

> If Core grows complex, the architecture has been violated.

---

## 4. Extension Types

### 4.1 Modules *(First‑party, Integrated)*

**Definition**

- Shipped with TNT Collection Tools
- Always present in the codebase
- Can be enabled or disabled

**Hard rule** *(policy, not code‑enforced)*

Modules must use the Ikariam module for all Ikariam data delivery.

**Modules may**

- Subscribe to events
- Read data from the Ikariam public API
- Maintain internal state
- Provide UI and options

**Modules must NOT**

- Hook ajax
- Parse Ikariam responses
- Scrape DOM for game state
- Access Ikariam globals directly

**Governance**

A feature may only be promoted to a Module if it obeys these rules.


---

### 4.2 Plugins *(Third‑party, External)*

**Definition**

- Independent userscripts by other authors
- Represented via metadata (e.g. `plugins.json`)
- May be dynamically loaded or installed separately

**Plugins may**

- Be fully stand‑alone
- Collect their own data
- Maintain their own storage
- Hook Ikariam directly

**Optional TNT integration**

- Register options
- Subscribe to TNT events
- Read Ikariam data via TNT's Ikariam API

> Plugins are guests, not citizens. TNT offers integration, not enforcement.

---

## 5. Ikariam Module *(Single Source of Truth)*

The Ikariam module is the only authority on Ikariam data.

**Responsibilities**

- Hook ajax / responders
- Parse Ikariam responses
- Maintain internal normalized state
- Emit semantic events
- Expose read‑only public API

**Non‑responsibilities**

- No UI
- No feature logic
- No module awareness
- No storage exposure

---

## 6. Ikariam Public API Design *(Key Decisions)*

### 6.1 Branch‑Style Naming *(Locked)*

The API uses short, hierarchical branches.

✅ **Preferred:**
```javascript
tnt.ikariam.get.city.resources(id)
```

❌ **Rejected:**
```javascript
tnt.ikariam.getCityResources(id)
```

**Rationale**

- API will grow large
- Branches scale better than flat names
- Improves discoverability
- Prevents function name explosion

---

### 6.2 Object‑Returning, Domain‑Scoped Getters *(Locked)*

The API returns objects, not individual values, but never “everything”.

**Rule:** One getter = one domain concept = one object

✅ **Allowed:**
```javascript
tnt.ikariam.get.city.core(id)
tnt.ikariam.get.city.resources(id)
tnt.ikariam.get.city.production(id)
tnt.ikariam.get.city.buildings(id, options)
```

❌ **Not allowed:**
```javascript
tnt.ikariam.get.city(id)   // implicit everything
tnt.ikariam.get.all()      // no semantic boundary
```

---

### 6.3 Options *(Explicitly Supported)*

Getters may accept an options object.

**Example:**
```javascript
tnt.ikariam.get.city.buildings(id, {
  types: ["warehouse", "dump"],
  includeConstruction: true
});
```
**Options may control**

- Shape of returned data
- Filtering / narrowing
- Depth / computational cost

**Options must NOT**

- Change domain meaning
- Switch domains
- Act as "include everything"
- Hide semantics behind vague modes

**Mental model:** Getter = noun, Options = adjectives

---

### 6.4 Immutability *(Locked)*

All data returned from the Ikariam API must be cloned, frozen, or immutable by convention.

Consumers must never be able to mutate internal Ikariam state.

---

## 7. Events vs Data *(Strict Separation)*

**Principle**

- Events tell *when* something changed
- Getters tell *what* the current state is

**Example:**
```javascript
events.on("ikariam:city.updated", ({ cityId }) => {
  const resources = tnt.ikariam.get.city.resources(cityId);
});
```

The Ikariam API does not emit events directly; events flow through the shared event system.

---

## 8. Governance vs Enforcement

**Enforced by architecture**

- Single Ikariam integration
- Read‑only public API
- Core has no feature logic
- Context‑based dependency injection

**Enforced by policy**

- Module adoption rules
- Code review
- Documentation

This distinction is intentional and correct.

---

## 9. Explicitly Out of Scope *(For Now)*

- Plugin marketplace UI
- Plugin signing / trust verification
- Cross‑plugin communication
- Remote hot‑loading of first‑party modules
- Backwards compatibility guarantees

These are future concerns, not blockers.

---

## 10. Open Design Holes *(Must Be Filled Before Coding)*

### 10.1 Ikariam Event Vocabulary *(Highest Priority)*

- Canonical event list
- Naming conventions
- Payload structure
- Emission guarantees

**Examples:**
- `ikariam:city.updated`
- `ikariam:view.changed`
- `ikariam:resources.updated`

### 10.2 Ikariam API v1 Surface

- Exact list of getters in v1
- Default option values
- Deferred domains

This should be frozen early.

### 10.3 Module Lifecycle Definition

- `init()` / `destroy()` semantics
- Re‑enable behavior
- Event unsubscription guarantees

### 10.4 Plugin Loading Strategy

- Dynamic load vs external install
- Error isolation
- Capability boundaries

A direction should be chosen, even if implementation is deferred.

---

## 11. Recommended Next Step *(Clear Action)*

> Do not start coding yet.

✅ **Next step:** Design the Ikariam Event Vocabulary (v1)

Once events are defined:

- API usage becomes concrete
- Modules can be refactored safely
- Implementation can begin without rework

---

## 12. Final Summary

- TNT Collection Tools is a platform, not a feature script
- Authority boundaries are explicit and intentional
- Modules and Plugins have different rules and trust levels
- Ikariam integration is centralized and sealed
- The API is domain‑driven, scalable, and immutable
- Governance is as important as code

---

> This document represents the foundation.
> Implementation should not begin until the remaining holes are filled.
