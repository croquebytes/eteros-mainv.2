import { windowManager } from './windowManager.js';
import { soundManager } from './soundManager.js';
import { getDesktopState } from './desktopState.js';

// Mobile UI Manager
export const mobileUI = {
    navEl: null,
    drawerEl: null,
    overlayEl: null,
    isDrawerOpen: false,

    init(desktopEl) {
        this.createBottomNav(desktopEl);
        this.createAppDrawer(desktopEl);
        this.setupMobileWindowBehavior();
    },

    createBottomNav(parentEl) {
        const nav = document.createElement('div');
        nav.className = 'mobile-bottom-nav';

        const items = [
            { id: 'home', icon: 'apps', label: 'Apps', action: () => this.toggleDrawer() },
            { id: 'tasks', icon: 'layers', label: 'Tasks', action: () => this.showTaskSwitcher() },
            { id: 'quest', icon: 'swords', label: 'Quest', action: () => windowManager.openWindow('questExplorer') },
            { id: 'shop', icon: 'shopping_cart', label: 'Shop', action: () => windowManager.openWindow('soulwareStore') }
        ];

        items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'mobile-nav-item';
            btn.innerHTML = `
        <span class="material-icons">${item.icon}</span>
        <span class="mobile-nav-label">${item.label}</span>
      `;

            // Material Icons fallback if not loaded (using emoji for now as backup)
            if (item.icon === 'apps') btn.innerHTML = `<span class="nav-icon">📱</span>`;
            if (item.icon === 'layers') btn.innerHTML = `<span class="nav-icon">❐</span>`;
            if (item.icon === 'swords') btn.innerHTML = `<span class="nav-icon">⚔️</span>`;
            if (item.icon === 'shopping_cart') btn.innerHTML = `<span class="nav-icon">🛒</span>`;

            btn.addEventListener('click', () => {
                soundManager.play('click');
                // Reset active states
                nav.querySelectorAll('.mobile-nav-item').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                item.action();
            });
            nav.appendChild(btn);
        });

        this.navEl = nav;
        parentEl.appendChild(nav);
    },

    createAppDrawer(parentEl) {
        // Overlay
        this.overlayEl = document.createElement('div');
        this.overlayEl.className = 'mobile-drawer-overlay';
        this.overlayEl.addEventListener('click', () => this.closeDrawer());
        parentEl.appendChild(this.overlayEl);

        // Drawer
        this.drawerEl = document.createElement('div');
        this.drawerEl.className = 'mobile-app-drawer';

        const handle = document.createElement('div');
        handle.className = 'drawer-handle';
        this.drawerEl.appendChild(handle);

        const grid = document.createElement('div');
        grid.className = 'drawer-grid';
        this.drawerEl.appendChild(grid);

        // Populate with apps (we'll need the APPS list, passing it in or importing)
        // For now, we'll grab them from the DOM or state if possible, 
        // but cleaner to pass them or export APPS from desktop.js.
        // Let's assume we can get them from the desktop icons for now to avoid circular deps.

        setTimeout(() => {
            const desktopIcons = document.querySelectorAll('.desktop-icon');
            desktopIcons.forEach(icon => {
                const clone = icon.cloneNode(true);
                clone.classList.remove('desktop-icon');
                clone.classList.add('drawer-icon');

                // Remove drag listeners from clone
                const newClone = clone.cloneNode(true);

                newClone.addEventListener('click', () => {
                    const appId = newClone.dataset.appId;
                    soundManager.play('click');
                    windowManager.openWindow(appId);
                    this.closeDrawer();
                });

                grid.appendChild(newClone);
            });
        }, 100); // Wait for desktop to render

        parentEl.appendChild(this.drawerEl);
    },

    toggleDrawer() {
        if (this.isDrawerOpen) {
            this.closeDrawer();
        } else {
            this.openDrawer();
        }
    },

    openDrawer() {
        this.isDrawerOpen = true;
        this.drawerEl.classList.add('open');
        this.overlayEl.classList.add('visible');
        soundManager.play('open');
    },

    closeDrawer() {
        this.isDrawerOpen = false;
        this.drawerEl.classList.remove('open');
        this.overlayEl.classList.remove('visible');
        soundManager.play('close');
    },

    showTaskSwitcher() {
        // Simple implementation: Minimize all windows to show desktop/wallpaper
        // In a real mobile OS, this would show a card stack.
        // For now, let's just toggle between "Show Desktop" and "Restore Last App"
        const state = getDesktopState();
        const openWindows = state.taskbar.runningWindowIds;

        if (openWindows.length === 0) return;

        const allMinimized = openWindows.every(id => windowManager.isWindowMinimized(id));

        if (allMinimized) {
            // Restore last active
            if (windowManager.activeWindowId) {
                windowManager.restoreWindow(windowManager.activeWindowId);
            } else {
                // Restore all? Or just the last one? Let's restore the last one in the list
                const lastId = openWindows[openWindows.length - 1];
                windowManager.restoreWindow(lastId);
            }
        } else {
            // Minimize all
            openWindows.forEach(id => windowManager.minimizeWindow(id));
        }
    },

    setupMobileWindowBehavior() {
        // Add specific mobile behaviors to window manager if needed
        // Most is handled by CSS media queries
    }
};
