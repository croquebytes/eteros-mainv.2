
let activeMenu = null;
let hideTimeout = null;
let activeTarget = null;

export function showSnapLayoutMenu(targetBtn, onSelect) {
    console.log('showSnapLayoutMenu called', targetBtn);
    // If menu is already open for this target, cancel hide
    if (activeMenu && activeTarget === targetBtn) {
        console.log('Menu already open for this target');
        cancelHideTimer();
        return;
    }


    // Close any existing menu
    hideSnapLayoutMenu(0);

    activeTarget = targetBtn;

    // Create menu container
    const menu = document.createElement('div');
    menu.className = 'snap-layout-menu';

    // Prevent menu from closing when hovering over it
    menu.addEventListener('mouseenter', () => {
        cancelHideTimer();
    });

    menu.addEventListener('mouseleave', () => {
        hideSnapLayoutMenu(300);
    });

    // Define layouts with relative coordinates (0-1)
    const layouts = [
        {
            name: 'half',
            zones: [
                { id: 'left', label: 'Left Half', icon: '◧', x: 0, y: 0, w: 0.5, h: 1 },
                { id: 'right', label: 'Right Half', icon: '◨', x: 0.5, y: 0, w: 0.5, h: 1 }
            ]
        },
        {
            name: 'primary-stack',
            zones: [
                { id: 'primary', label: 'Primary Left', icon: '◳', x: 0, y: 0, w: 0.5, h: 1 },
                { id: 'side-top', label: 'Side Top', icon: '◩', x: 0.5, y: 0, w: 0.5, h: 0.5 },
                { id: 'side-bottom', label: 'Side Bottom', icon: '◪', x: 0.5, y: 0.5, w: 0.5, h: 0.5 }
            ]
        },
        {
            name: 'thirds',
            zones: [
                { id: 'third-left', label: 'Left Third', icon: 'wl', x: 0, y: 0, w: 0.333, h: 1 },
                { id: 'third-center', label: 'Center Third', icon: 'wc', x: 0.333, y: 0, w: 0.334, h: 1 },
                { id: 'third-right', label: 'Right Third', icon: 'wr', x: 0.667, y: 0, w: 0.333, h: 1 }
            ]
        },
        {
            name: 'quarters',
            zones: [
                { id: 'top-left', label: 'Top Left', icon: '⌜', x: 0, y: 0, w: 0.5, h: 0.5 },
                { id: 'top-right', label: 'Top Right', icon: '⌝', x: 0.5, y: 0, w: 0.5, h: 0.5 },
                { id: 'bottom-left', label: 'Bottom Left', icon: '⌞', x: 0, y: 0.5, w: 0.5, h: 0.5 },
                { id: 'bottom-right', label: 'Bottom Right', icon: '⌟', x: 0.5, y: 0.5, w: 0.5, h: 0.5 }
            ]
        }
    ];

    // Build layout options
    layouts.forEach(layout => {
        const group = document.createElement('div');
        group.className = `snap-layout-group snap-layout-${layout.name}`;

        layout.zones.forEach(zone => {
            const zoneBtn = document.createElement('div');
            zoneBtn.className = `snap-zone snap-zone-${zone.id}`;
            zoneBtn.title = zone.label;

            zoneBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (onSelect) onSelect(zone);
                hideSnapLayoutMenu(0);
            });

            group.appendChild(zoneBtn);
        });

        menu.appendChild(group);
    });

    // Position menu
    const rect = targetBtn.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 10}px`;

    // Calculate right position to align with button but stay on screen
    // Default to aligning right edge of menu with right edge of button
    // We need to append first to get width, or guess.
    // Let's append and then adjust if needed.
    document.body.appendChild(menu);

    const menuRect = menu.getBoundingClientRect();
    const rightOverflow = (rect.left + menuRect.width) - window.innerWidth;

    if (rightOverflow > 0) {
        menu.style.left = `${rect.right - menuRect.width}px`;
    } else {
        menu.style.left = `${rect.left}px`; // Align lefts by default
    }

    // If it goes off right edge (e.g. button is far right), align right edges
    if (rect.right > window.innerWidth - 100) {
        menu.style.left = 'auto';
        menu.style.right = `${window.innerWidth - rect.right}px`;
    }

    activeMenu = menu;

    // Animate in
    requestAnimationFrame(() => {
        menu.classList.add('visible');
    });
}

export function hideSnapLayoutMenu(delay = 0) {
    cancelHideTimer();

    if (delay > 0) {
        hideTimeout = setTimeout(() => {
            performHide();
        }, delay);
    } else {
        performHide();
    }
}

function performHide() {
    if (activeMenu) {
        activeMenu.classList.remove('visible');
        const menuToRemove = activeMenu;
        activeMenu = null;
        activeTarget = null;

        // Wait for transition
        setTimeout(() => {
            if (menuToRemove.parentNode) {
                menuToRemove.remove();
            }
        }, 200);
    }
}

function cancelHideTimer() {
    if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
    }
}
