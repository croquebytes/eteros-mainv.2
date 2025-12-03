// ===== File System Structure =====
// Maps the game's dungeons to a virtual file system
// Used by Quest Explorer for navigation

export const FILE_SYSTEM = {
    name: 'root',
    type: 'root',
    children: [
        {
            name: 'C:',
            type: 'drive',
            children: [
                {
                    name: 'Windows',
                    type: 'folder',
                    children: [
                        {
                            name: 'System32',
                            type: 'folder',
                            children: [
                                { name: 'kernel_panic.exe', type: 'file', dungeonId: 'boss_raid_kernel_panic', icon: '💀' },
                                { name: 'registry_corruption.log', type: 'file', dungeonId: 'story_node_2', icon: '📄' },
                                { name: 'drivers.sys', type: 'file', dungeonId: 'story_node_10', icon: '⚙️' }
                            ]
                        },
                        { name: 'startup_errors.log', type: 'file', dungeonId: 'story_node_1', icon: '⚠️' },
                        { name: 'boot.ini', type: 'file', dungeonId: 'story_node_1', icon: '⚙️' }
                    ]
                },
                {
                    name: 'Program Files',
                    type: 'folder',
                    children: [
                        {
                            name: 'SpamFilter',
                            type: 'folder',
                            children: [
                                { name: 'breakdown.exe', type: 'file', dungeonId: 'story_node_5', icon: '🛡️' },
                                { name: 'quarantine.db', type: 'file', dungeonId: 'story_node_5', icon: '🔒' }
                            ]
                        },
                        {
                            name: 'CoreSystem',
                            type: 'folder',
                            children: [
                                { name: 'source.code', type: 'file', dungeonId: 'story_node_20', icon: '⚛️' }
                            ]
                        }
                    ]
                },
                {
                    name: 'Users',
                    type: 'folder',
                    children: [
                        {
                            name: 'Admin',
                            type: 'folder',
                            children: [
                                {
                                    name: 'Documents',
                                    type: 'folder',
                                    children: [
                                        { name: 'admin_tomb.docx', type: 'file', dungeonId: 'story_node_15', icon: '📝' },
                                        { name: 'passwords.txt', type: 'file', dungeonId: 'story_node_15', icon: '🔑' }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: 'D:',
            type: 'drive',
            children: [
                {
                    name: 'Mining',
                    type: 'folder',
                    children: [
                        { name: 'crypto_cluster.bat', type: 'file', dungeonId: 'farming_node_gold', icon: '💰' }
                    ]
                },
                {
                    name: 'Simulations',
                    type: 'folder',
                    children: [
                        { name: 'training_server.iso', type: 'file', dungeonId: 'farming_node_xp', icon: '🎓' }
                    ]
                },
                {
                    name: 'Repository',
                    type: 'folder',
                    children: [
                        { name: 'loot_network.db', type: 'file', dungeonId: 'farming_node_items', icon: '📦' }
                    ]
                }
            ]
        },
        {
            name: 'Z:',
            type: 'drive',
            children: [
                {
                    name: 'Firewall',
                    type: 'folder',
                    children: [
                        { name: 'no_heal_protocol.sh', type: 'file', dungeonId: 'challenge_no_healing', icon: '🚫' }
                    ]
                },
                {
                    name: 'SpeedTest',
                    type: 'folder',
                    children: [
                        { name: 'speed_run.exe', type: 'file', dungeonId: 'challenge_speed_run', icon: '⏱️' }
                    ]
                },
                {
                    name: 'Archive',
                    type: 'folder',
                    children: [
                        { name: 'boss_rush.zip', type: 'file', dungeonId: 'challenge_boss_rush', icon: '📚' },
                        { name: 'infinite_loop.bat', type: 'file', dungeonId: 'boss_raid_infinite_loop', icon: '♾️' }
                    ]
                }
            ]
        },
        {
            name: 'N:',
            type: 'drive',
            children: [] // Populated dynamically by Quest Explorer
        }
    ]
};

// Helper to find a node by path
export function getFileSystemNode(path) {
    const parts = path.split('/').filter(p => p);
    let current = FILE_SYSTEM;

    for (const part of parts) {
        if (current.children) {
            const found = current.children.find(c => c.name === part);
            if (found) {
                current = found;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    return current;
}
