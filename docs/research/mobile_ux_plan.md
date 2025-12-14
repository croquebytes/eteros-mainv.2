# Mobile UI/UX Implementation Plan

## Overview
The goal is to transition ReincarnOS from a desktop-only interface to a fully responsive, mobile-first experience without losing the "hacker/cyberpunk" aesthetic.

## Current status
- **Viewport:** Window resizing is now handled, resizing maximized windows dynamically.
- **Quest Explorer:** Adapted for mobile (stacking views, hidden sidebars).
- **Icons:** Grid size is responsive (handled in `desktopState.js`).

## Proposed Features

### 1. Mobile Taskbar & Navigation
*   **Problem:** The bottom taskbar with tiny icons is hard to use on touch.
*   **Solution:** Convert to a "Bottom Sheet" or "Dock" style on mobile.
    *   **Home Button:** Triggers an App Drawer overlay (like Android/iOS).
    *   **Back Button:** Already integrated with browser history, but a visual "Back" button in the OS UI would be clearer.
    *   **Task Switcher:** A simple "Tabs" view to switch between open windows (since we only show one at a time on mobile).

### 2. Window Management (Mobile Mode)
*   **Behavior:**
    *   Windows always open **Maximized** (minus nav bar).
    *   Titlebars should be simplified or hidden to save vertical space.
    *   "Close" button should be a prominent floating action button (FAB) or swipe gesture (swipe down to close).
*   **Gestures:**
    *   Swipe Left/Right to switch active apps.
    *   Swipe Down to close/minimize.

### 3. Touch Interactions
*   **Touch Targets:** All interactive elements (buttons, list items) must be at least 44x44px.
*   **Hover States:** Remove reliance on `:hover`. Important actions hidden behind hover (like the "Play" button on dungeon cards) must be always visible or accessible via a menu. (Partially addressed in `questExplorer` CSS).

### 4. Specific App Adaptations
*   **Mail Client:** Two-pane layout -> Master-Detail view (List view first, tap to see email).
*   **Skill Tree:** Pan/Zoom interface needs to be touch-friendly (pinch transparency).
*   **Terminal:** Virtual Keyboard handling is critical. Ensure text input doesn't get covered by the OS keyboard.

## Technical Roadmap
1.  **CSS Framework:** Introduce a utility-first approach for spacing/sizing (e.g., `p-4`, `flex-col`) if not using Tailwind, to speed up responsive tweaks.
2.  **`mobileMode` State:** Fully leverage the `isMobileMode` flag in `desktopState.js` to conditionally render different React/JS components, not just CSS changes.
3.  **Service Worker:** Implement PWA capabilities (Manifest, Offline support) so it can be installed as an App.

## Immediate Next Steps
*   Refine the "App Drawer" concept.
*   Implement Swipe gestures for the Window Manager.
