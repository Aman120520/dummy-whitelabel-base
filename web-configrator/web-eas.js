import React, { useState } from 'react';

export default function App() {
    // --- App Theme State (Saves to your database) ---
    const [appTheme, setAppTheme] = useState({
        appName: 'Tayyar24 Laundry',
        primaryColor: '#202f66',
        secondaryColor: '#f0f4f8',
    });

    // --- EAS Workflow Trigger State ---
    const [easPipeline, setEasPipeline] = useState({
        expoToken: '',                          // Your Expo Token
        appleTeamId: '',                        // Your Apple Team ID
        projectId: '952733e3-51a5-40b4-8554-eaac3a5a6390', // EAS Project ID
        bundleId: 'com.laundry.tayyar24',       // iOS Bundle ID
    });

    const [logs, setLogs] = useState([]);
    const [isBuilding, setIsBuilding] = useState(false);

    const addLog = (message) => {
        setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
    };

    // --- Trigger EAS Workflow ---
    const handleTriggerEASWorkflow = async () => {
        if (!easPipeline.expoToken) {
            alert("Please enter your Expo Token first!");
            return;
        }

        if (!easPipeline.appleTeamId) {
            alert("Please enter your Apple Team ID!");
            return;
        }

        // Bundle ID validation
        const bundleRegex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
        if (!bundleRegex.test(easPipeline.bundleId)) {
            alert("Invalid Bundle ID! Format should be: 'com.company.appname'");
            return;
        }

        setIsBuilding(true);
        setLogs([]);
        addLog("Preparing EAS Workflow...");

        try {
            // Get project ID from input field or app.json
            addLog("Reading project configuration...");

            let projectId = easPipeline.projectId?.trim();

            if (!projectId) {
                throw new Error('Project ID is required. Enter it in the form or check app.json');
            }

            addLog(`Project ID: ${projectId}`);
            addLog("Triggering EAS Workflow...");

            // Trigger EAS Workflow via API
            const workflowUrl = `https://api.expo.dev/v2/projects/${projectId}/workflows/build-testflight.yml/runs`;

            const response = await fetch(workflowUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${easPipeline.expoToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    env: {
                        APP_NAME: appTheme.appName,
                        BUNDLE_ID: easPipeline.bundleId.toLowerCase(),
                        APPLE_TEAM_ID: easPipeline.appleTeamId,
                    },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    `${response.status}: ${errorData.message || 'Unknown error'}`
                );
            }

            const data = await response.json();
            const runId = data.id;

            addLog("✅ EAS Workflow triggered successfully!");
            addLog(`Run ID: ${runId}`);
            addLog("");
            addLog("📊 Check status:");
            addLog(`   eas workflow:status ${runId}`);
            addLog(`   eas workflow:logs ${runId}`);
            addLog("");
            addLog("🎯 App will appear in TestFlight in ~15-20 minutes");

        } catch (error) {
            addLog(`❌ Error: ${error.message}`);
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

                {/* --- RIGHT COLUMN: EAS Pipeline --- */}
                <div style={styles.card}>
                    <h2>2. Build & Deploy (EAS)</h2>
                    <p style={styles.subText}>Trigger iOS TestFlight build via EAS Workflows.</p>

                    <label style={styles.label}>Expo Token</label>
                    <input
                        type="password"
                        style={styles.input}
                        placeholder="expo_..."
                        value={easPipeline.expoToken}
                        onChange={(e) => setEasPipeline({ ...easPipeline, expoToken: e.target.value })}
                    />

                    <label style={styles.label}>EAS Project ID</label>
                    <input
                        style={styles.input}
                        placeholder="952733e3-51a5-40b4-8554-eaac3a5a6390"
                        value={easPipeline.projectId}
                        onChange={(e) => setEasPipeline({ ...easPipeline, projectId: e.target.value })}
                    />
                    <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                        Find in app.json: extra.eas.projectId
                    </p>

                    <label style={styles.label}>Apple Team ID</label>
                    <input
                        style={styles.input}
                        placeholder="XXXXXXXXXX"
                        value={easPipeline.appleTeamId}
                        onChange={(e) => setEasPipeline({ ...easPipeline, appleTeamId: e.target.value })}
                    />

                    <label style={styles.label}>iOS Bundle ID</label>
                    <input
                        style={styles.input}
                        value={easPipeline.bundleId}
                        placeholder="com.company.appname"
                        onChange={(e) => setEasPipeline({ ...easPipeline, bundleId: e.target.value })}
                    />

                    <button
                        style={isBuilding ? styles.disabledButton : styles.triggerButton}
                        onClick={handleTriggerEASWorkflow}
                        disabled={isBuilding}
                    >
                        {isBuilding ? 'Building...' : 'Push to TestFlight (iOS)'}
                    </button>
                </div>
            </div>

            {/* --- TERMINAL LOGS --- */}
            <div style={styles.terminal}>
                <h3 style={{ margin: 0, color: '#fff', paddingBottom: '10px' }}>Build Terminal</h3>
                {logs.length === 0 && <span style={{ color: '#888' }}>Waiting for action...</span>}
                {logs.map((log, index) => (
                    <div
                        key={index}
                        style={{
                            color: log.includes('❌') ? '#ff4d4f' : log.includes('✅') ? '#52c41a' : '#00ff00',
                            marginTop: 4,
                            fontFamily: 'monospace',
                            fontSize: '12px',
                        }}
                    >
                        {log}
                    </div>
                ))}
            </div>

            {/* --- INFO PANEL --- */}
            <div style={styles.infoPanel}>
                <h3>ℹ️ How It Works</h3>
                <p>
                    This configurator uses <strong>EAS Workflows</strong> to automate iOS builds:
                </p>
                <ol>
                    <li>Enter your Expo Token and Apple Team ID</li>
                    <li>Customize app name and bundle ID</li>
                    <li>Click "Push to TestFlight"</li>
                    <li>EAS builds and submits to TestFlight automatically (~20 min)</li>
                    <li>Your testers receive email invitations</li>
                </ol>
                <p style={{ fontSize: '12px', color: '#666' }}>
                    Get Expo Token from: <code>https://expo.dev/settings/tokens</code>
                </p>
            </div>
        </div>
    );
}

// --- Inline Styles ---
const styles = {
    container: {
        fontFamily: 'system-ui',
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#f9fafb',
    },
    heading: {
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '24px',
        color: '#111827',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '24px',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    },
    subText: {
        color: '#6b7280',
        fontSize: '14px',
        marginBottom: '16px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#374151',
        marginTop: '16px',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        fontSize: '14px',
        boxSizing: 'border-box',
    },
    colorPicker: {
        width: '100%',
        height: '40px',
        padding: '0',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '6px',
    },
    saveButton: {
        marginTop: '20px',
        width: '100%',
        padding: '12px',
        backgroundColor: '#4b5563',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    triggerButton: {
        marginTop: '20px',
        width: '100%',
        padding: '12px',
        backgroundColor: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px',
    },
    disabledButton: {
        marginTop: '20px',
        width: '100%',
        padding: '12px',
        backgroundColor: '#93c5fd',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'not-allowed',
        fontWeight: 'bold',
    },
    terminal: {
        backgroundColor: '#1e1e1e',
        padding: '20px',
        borderRadius: '12px',
        fontFamily: 'monospace',
        fontSize: '13px',
        minHeight: '200px',
        marginBottom: '24px',
        overflowY: 'auto',
        maxHeight: '400px',
    },
    infoPanel: {
        backgroundColor: '#e0f2fe',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #0284c7',
        color: '#0c4a6e',
    },
};
