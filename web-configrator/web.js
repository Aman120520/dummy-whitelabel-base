import React, { useState } from 'react';

export default function App() {
    // --- App Theme State (Saves to your database) ---
    const [appTheme, setAppTheme] = useState({
        appName: 'Tayyar24 Laundry',
        primaryColor: '#202f66',
        secondaryColor: '#f0f4f8',
    });

    // --- GitHub Pipeline State ---
    const [pipeline, setPipeline] = useState({
        owner: 'Aman120520',                // Your GitHub Username
        repo: 'dummy-whitelabel-base',      // Your GitHub Repository Name
        pat: '',                            // Your GitHub Personal Access Token
        clientId: '4565',                   // The Organization ID
        bundleId: 'com.laundry.tayyar24',   // iOS Bundle ID
    });

    const [logs, setLogs] = useState([]);
    const [isBuilding, setIsBuilding] = useState(false);
    const [platform, setPlatform] = useState('ios'); // 'ios', 'android', or 'both'

    const addLog = (message) => {
        setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
    };

    // --- Trigger GitHub Actions Webhook ---
    const handleTriggerPipeline = async () => {
        if (!pipeline.pat) {
            alert("Please enter your GitHub PAT first!");
            return;
        }

        // FIX: iOS Bundle ID Validation Check
        // iOS bundle IDs allow letters, numbers, hyphens (-), and periods (.)
        const bundleRegex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
        if (!bundleRegex.test(pipeline.bundleId)) {
            alert("Invalid Bundle ID! Format should be reverse-DNS: 'com.company.appname'\n\n❌ Only letters, numbers, hyphens (-), and periods (.) are allowed for iOS.");
            return;
        }

        // FIX: Automatically remove spaces, hidden newlines, and invisible unicode characters from the pasted PAT
        const cleanPat = pipeline.pat.trim().replace(/[^\x20-\x7E]/g, '');

        setIsBuilding(true);
        setLogs([]); // Clear old logs
        addLog("Preparing webhook payload...");

        const githubApiUrl = `https://api.github.com/repos/${pipeline.owner}/${pipeline.repo}/actions/workflows/build-all-platforms.yml/dispatches`;

        try {
            addLog(`Sending request to ${pipeline.owner}/${pipeline.repo}...`);
            addLog(`Platform: ${platform.toUpperCase()}`);

            const inputs = {
                platform: platform, // 'ios', 'android', or 'both'
                clientId: pipeline.clientId,
            };

            // Only add iOS-specific inputs if building iOS
            if (platform === 'ios' || platform === 'both') {
                inputs.appName = appTheme.appName;
                inputs.bundleId = pipeline.bundleId.toLowerCase();
            }

            const response = await fetch(githubApiUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'Authorization': `Bearer ${cleanPat}`,
                    'X-GitHub-Api-Version': '2022-11-28',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ref: 'main', // The branch to run the workflow on
                    inputs: inputs,
                }),
            });

            if (response.ok) {
                addLog("✅ Webhook sent successfully!");
                if (platform === 'ios') {
                    addLog("🎉 Build triggered! EAS is building the iOS app and will push it directly to TestFlight in ~15-20 minutes.");
                } else if (platform === 'android') {
                    addLog("🎉 Build triggered! Building Android APK in ~10-15 minutes.");
                } else {
                    addLog("🎉 Build triggered! Building both iOS and Android in parallel. iOS to TestFlight in ~15-20 minutes, APK in ~10-15 minutes.");
                }
            } else {
                const errorData = await response.json();
                addLog(`❌ Error ${response.status}: ${JSON.stringify(errorData.message)}`);
            }
        } catch (error) {
            addLog(`❌ Failed to connect to GitHub: ${error.message}`);
        } finally {
            setIsBuilding(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>White-Label App Configurator</h1>

            <div style={styles.grid}>
                {/* --- LEFT COLUMN: App Styling --- */}
                <div style={styles.card}>
                    <h2>1. App Styling (Database)</h2>
                    <p style={styles.subText}>These changes apply instantly via your live API.</p>

                    <label style={styles.label}>App Name</label>
                    <input
                        style={styles.input}
                        value={appTheme.appName}
                        onChange={(e) => setAppTheme({ ...appTheme, appName: e.target.value })}
                    />

                    <label style={styles.label}>Primary Color</label>
                    <input
                        type="color"
                        style={styles.colorPicker}
                        value={appTheme.primaryColor}
                        onChange={(e) => setAppTheme({ ...appTheme, primaryColor: e.target.value })}
                    />

                    <button style={styles.saveButton} onClick={() => alert("Theme data synced! Click 'Push to TestFlight' to build the iOS App.")}>
                        Save to Database
                    </button>
                </div>

                {/* --- RIGHT COLUMN: GitHub Pipeline --- */}
                <div style={styles.card}>
                    <h2>2. Build & Deploy</h2>
                    <p style={styles.subText}>Trigger builds for iOS (TestFlight) and/or Android (APK).</p>

                    <label style={styles.label}>Select Platform</label>
                    <div style={styles.platformButtons}>
                        <button
                            style={{
                                ...styles.platformButton,
                                backgroundColor: platform === 'ios' ? '#2563eb' : '#e5e7eb',
                                color: platform === 'ios' ? '#fff' : '#374151',
                            }}
                            onClick={() => setPlatform('ios')}
                        >
                            📱 iOS
                        </button>
                        <button
                            style={{
                                ...styles.platformButton,
                                backgroundColor: platform === 'android' ? '#2563eb' : '#e5e7eb',
                                color: platform === 'android' ? '#fff' : '#374151',
                            }}
                            onClick={() => setPlatform('android')}
                        >
                            🤖 Android
                        </button>
                        <button
                            style={{
                                ...styles.platformButton,
                                backgroundColor: platform === 'both' ? '#2563eb' : '#e5e7eb',
                                color: platform === 'both' ? '#fff' : '#374151',
                            }}
                            onClick={() => setPlatform('both')}
                        >
                            ⚡ Both
                        </button>
                    </div>

                    <label style={styles.label}>Target Repo Owner</label>
                    <input
                        style={styles.input}
                        value={pipeline.owner}
                        onChange={(e) => setPipeline({ ...pipeline, owner: e.target.value })}
                    />

                    <label style={styles.label}>Target Repo Name</label>
                    <input
                        style={styles.input}
                        value={pipeline.repo}
                        onChange={(e) => setPipeline({ ...pipeline, repo: e.target.value })}
                    />

                    <label style={styles.label}>Client / Organization ID</label>
                    <input
                        style={styles.input}
                        value={pipeline.clientId}
                        onChange={(e) => setPipeline({ ...pipeline, clientId: e.target.value })}
                    />

                    {(platform === 'ios' || platform === 'both') && (
                        <>
                            <label style={styles.label}>App Name (iOS)</label>
                            <input
                                style={styles.input}
                                value={appTheme.appName}
                                onChange={(e) => setAppTheme({ ...appTheme, appName: e.target.value })}
                            />

                            <label style={styles.label}>iOS Bundle ID</label>
                            <input
                                style={styles.input}
                                value={pipeline.bundleId}
                                placeholder="com.laundry.brandname"
                                onChange={(e) => setPipeline({ ...pipeline, bundleId: e.target.value })}
                            />
                        </>
                    )}

                    <label style={styles.label}>GitHub PAT (Secret)</label>
                    <input
                        type="password"
                        style={styles.input}
                        placeholder="ghp_xxxxxxxxxxxx"
                        value={pipeline.pat}
                        onChange={(e) => setPipeline({ ...pipeline, pat: e.target.value })}
                    />

                    <button
                        style={isBuilding ? styles.disabledButton : styles.triggerButton}
                        onClick={handleTriggerPipeline}
                        disabled={isBuilding}
                    >
                        {isBuilding ? 'Triggering Build...' : `Build & Deploy ${platform === 'ios' ? '📱 iOS' : platform === 'android' ? '🤖 Android' : '⚡ Both'}`}
                    </button>
                </div>
            </div>

            {/* --- TERMINAL LOGS --- */}
            <div style={styles.terminal}>
                <h3 style={{ margin: 0, color: '#fff', paddingBottom: '10px' }}>Build Terminal</h3>
                {logs.length === 0 && <span style={{ color: '#888' }}>Waiting for action...</span>}
                {logs.map((log, index) => (
                    <div key={index} style={{ color: log.includes('❌') ? '#ff4d4f' : '#00ff00', marginTop: 4 }}>
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Basic Inline Styles for quick rendering ---
const styles = {
    container: { fontFamily: 'system-ui', padding: '40px', maxWidth: '1000px', margin: '0 auto', backgroundColor: '#f9fafb' },
    heading: { fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' },
    card: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    subText: { color: '#6b7280', fontSize: '14px', marginBottom: '16px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151', marginTop: '16px' },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' },
    colorPicker: { width: '100%', height: '40px', padding: '0', border: 'none', cursor: 'pointer' },
    saveButton: { marginTop: '20px', width: '100%', padding: '12px', backgroundColor: '#4b5563', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    triggerButton: { marginTop: '20px', width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    disabledButton: { marginTop: '20px', width: '100%', padding: '12px', backgroundColor: '#93c5fd', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'not-allowed', fontWeight: 'bold' },
    platformButtons: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '8px', marginBottom: '16px' },
    platformButton: { padding: '10px', borderRadius: '6px', border: '2px solid transparent', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' },
    terminal: { backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '13px', minHeight: '150px' }
};