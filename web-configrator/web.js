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
        owner: 'Aman120520',
        repo: 'dummy-whitelabel-base',
        pat: '',
        clientId: '4565',
        bundleId: 'com.laundry.tayyar24',
        androidPackage: 'com.laundry.tayyar24',
        easProjectId: '952733e3-51a5-40b4-8554-eaac3a5a6390', // Client-specific EAS project
    });

    const [logs, setLogs] = useState([]);
    const [isBuilding, setIsBuilding] = useState(false);
    const [buildOption, setBuildOption] = useState('testflight'); // 'testflight', 'apk', or 'both'

    const addLog = (message) => {
        setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
    };

    // --- Map build options to platform values ---
    const getBuildPlatform = () => {
        switch (buildOption) {
            case 'testflight': return 'ios';
            case 'apk': return 'android';
            case 'both': return 'both';
            default: return 'ios';
        }
    };

    // --- Trigger GitHub Actions Workflow ---
    const handleTriggerPipeline = async () => {
        if (!pipeline.pat) {
            alert("Please enter your GitHub PAT first!");
            return;
        }

        const packageRegex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;

        if (buildOption === 'testflight' || buildOption === 'both') {
            if (!packageRegex.test(pipeline.bundleId)) {
                alert("Invalid iOS Bundle ID! Format should be reverse-DNS: 'com.company.appname'\n\n❌ Only letters, numbers, hyphens (-), and periods (.) are allowed.");
                return;
            }
        }

        if (buildOption === 'apk' || buildOption === 'both') {
            if (!packageRegex.test(pipeline.androidPackage)) {
                alert("Invalid Android Package ID! Format should be reverse-DNS: 'com.company.appname'\n\n❌ Only letters, numbers, hyphens (-), and periods (.) are allowed.");
                return;
            }
        }

        const cleanPat = pipeline.pat.trim().replace(/[^\x20-\x7E]/g, '');

        setIsBuilding(true);
        setLogs([]);
        addLog("Preparing build request...");

        const githubApiUrl = `https://api.github.com/repos/${pipeline.owner}/${pipeline.repo}/actions/workflows/build-all-platforms.yml/dispatches`;

        try {
            addLog(`Connecting to GitHub: ${pipeline.owner}/${pipeline.repo}`);
            addLog(`Build Type: ${buildOption.toUpperCase()}`);
            addLog(`Client ID: ${pipeline.clientId}`);

            const platform = getBuildPlatform();
            const inputs = {
                platform,
                clientId: pipeline.clientId,
                appName: appTheme.appName,
                easProjectId: pipeline.easProjectId
            };

            if (platform === 'ios' || platform === 'both') {
                inputs.bundleId = pipeline.bundleId.toLowerCase();
                addLog(`iOS Bundle ID: ${pipeline.bundleId}`);
            }

            if (platform === 'android' || platform === 'both') {
                inputs.androidPackage = pipeline.androidPackage.toLowerCase();
                addLog(`Android Package: ${pipeline.androidPackage}`);
            }

            addLog(`App Name: ${appTheme.appName}`);
            addLog(`EAS Project ID: ${pipeline.easProjectId}`);

            addLog("Sending workflow dispatch request...");

            const response = await fetch(githubApiUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'Authorization': `Bearer ${cleanPat}`,
                    'X-GitHub-Api-Version': '2022-11-28',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ref: 'main', inputs }),
            });

            if (response.ok) {
                addLog("✅ Workflow dispatched successfully!");
                addLog("");

                if (buildOption === 'testflight') {
                    addLog("📱 Building iOS App for TestFlight");
                    addLog("⏱️  Estimated time: 15-20 minutes");
                    addLog("1️⃣  EAS will build the native iOS project");
                    addLog("2️⃣  Auto-submit to TestFlight");
                    addLog("3️⃣  Notify testers in TestFlight");
                } else if (buildOption === 'apk') {
                    addLog("🤖 Building Android APK");
                    addLog("⏱️  Estimated time: 10-15 minutes");
                    addLog("1️⃣  Gradle assembles the Android release APK");
                    addLog("2️⃣  APK available in GitHub Actions artifacts");
                    addLog("3️⃣  Download and distribute manually");
                } else {
                    addLog("⚡ Building BOTH iOS & Android in Parallel");
                    addLog("📱 iOS: 15-20 minutes → TestFlight");
                    addLog("🤖 Android: 10-15 minutes → APK download");
                    addLog("Both builds run simultaneously!");
                }

                addLog("");
                addLog("📊 Track progress: https://github.com/" + pipeline.owner + "/" + pipeline.repo + "/actions");
            } else {
                const errorData = await response.json();
                addLog(`❌ Error ${response.status}: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            addLog(`❌ Failed: ${error.message}`);
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

                {/* --- RIGHT COLUMN: Build Options --- */}
                <div style={styles.card}>
                    <h2>2. Build & Deploy</h2>
                    <p style={styles.subText}>Choose what to build and configure deployment.</p>

                    <label style={styles.label}>📦 Select Build Type</label>
                    <div style={styles.buildOptions}>
                        <button
                            style={{
                                ...styles.buildOptionButton,
                                backgroundColor: buildOption === 'testflight' ? '#059669' : '#e5e7eb',
                                color: buildOption === 'testflight' ? '#fff' : '#374151',
                                borderColor: buildOption === 'testflight' ? '#059669' : '#d1d5db',
                            }}
                            onClick={() => setBuildOption('testflight')}
                        >
                            <div style={{ fontSize: '20px', marginBottom: '4px' }}>📱</div>
                            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>TestFlight</div>
                            <div style={{ fontSize: '11px', opacity: 0.8 }}>iOS Build</div>
                        </button>
                        <button
                            style={{
                                ...styles.buildOptionButton,
                                backgroundColor: buildOption === 'apk' ? '#dc2626' : '#e5e7eb',
                                color: buildOption === 'apk' ? '#fff' : '#374151',
                                borderColor: buildOption === 'apk' ? '#dc2626' : '#d1d5db',
                            }}
                            onClick={() => setBuildOption('apk')}
                        >
                            <div style={{ fontSize: '20px', marginBottom: '4px' }}>🤖</div>
                            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>APK</div>
                            <div style={{ fontSize: '11px', opacity: 0.8 }}>Android Build</div>
                        </button>
                        <button
                            style={{
                                ...styles.buildOptionButton,
                                backgroundColor: buildOption === 'both' ? '#7c3aed' : '#e5e7eb',
                                color: buildOption === 'both' ? '#fff' : '#374151',
                                borderColor: buildOption === 'both' ? '#7c3aed' : '#d1d5db',
                            }}
                            onClick={() => setBuildOption('both')}
                        >
                            <div style={{ fontSize: '20px', marginBottom: '4px' }}>⚡</div>
                            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Both</div>
                            <div style={{ fontSize: '11px', opacity: 0.8 }}>Parallel</div>
                        </button>
                    </div>

                    <div style={styles.divider}></div>

                    <label style={styles.label}>🔧 GitHub Configuration</label>
                    <label style={styles.label}>Repo Owner</label>
                    <input
                        style={styles.input}
                        value={pipeline.owner}
                        onChange={(e) => setPipeline({ ...pipeline, owner: e.target.value })}
                    />

                    <label style={styles.label}>Repo Name</label>
                    <input
                        style={styles.input}
                        value={pipeline.repo}
                        onChange={(e) => setPipeline({ ...pipeline, repo: e.target.value })}
                    />

                    <label style={styles.label}>Client ID</label>
                    <input
                        style={styles.input}
                        value={pipeline.clientId}
                        onChange={(e) => setPipeline({ ...pipeline, clientId: e.target.value })}
                    />

                    <label style={styles.label}>EAS Project ID</label>
                    <input
                        style={styles.input}
                        value={pipeline.easProjectId}
                        onChange={(e) => setPipeline({ ...pipeline, easProjectId: e.target.value })}
                        placeholder="952733e3-51a5-40b4-8554-eaac3a5a6390"
                    />
                    <p style={{ ...styles.subText, marginTop: '4px' }}>Use client's own EAS project for separate TestFlight app</p>

                    <label style={styles.label}>GitHub PAT (Token)</label>
                    <input
                        type="password"
                        style={styles.input}
                        placeholder="ghp_xxxxxxxxxxxx"
                        value={pipeline.pat}
                        onChange={(e) => setPipeline({ ...pipeline, pat: e.target.value })}
                    />

                    <div style={styles.divider}></div>
                    <label style={styles.label}>📱 App Configuration</label>

                    <label style={styles.label}>App Name</label>
                    <input
                        style={styles.input}
                        value={appTheme.appName}
                        onChange={(e) => setAppTheme({ ...appTheme, appName: e.target.value })}
                        placeholder="My App Name"
                    />

                    {(buildOption === 'testflight' || buildOption === 'both') && (
                        <>
                            <label style={styles.label}>iOS Bundle ID</label>
                            <input
                                style={styles.input}
                                value={pipeline.bundleId}
                                onChange={(e) => setPipeline({ ...pipeline, bundleId: e.target.value })}
                                placeholder="com.company.appname"
                            />
                        </>
                    )}

                    {(buildOption === 'apk' || buildOption === 'both') && (
                        <>
                            <label style={styles.label}>Android Package ID</label>
                            <input
                                style={styles.input}
                                value={pipeline.androidPackage}
                                onChange={(e) => setPipeline({ ...pipeline, androidPackage: e.target.value })}
                                placeholder="com.company.appname"
                            />
                        </>
                    )}

                    <button
                        style={isBuilding ? styles.disabledButton : styles.triggerButton}
                        onClick={handleTriggerPipeline}
                        disabled={isBuilding}
                    >
                        {isBuilding ? '⏳ Building...' : `🚀 ${buildOption === 'testflight' ? 'Build to TestFlight' : buildOption === 'apk' ? 'Build APK' : 'Build Both'}`}
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
    triggerButton: { marginTop: '20px', width: '100%', padding: '14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
    disabledButton: { marginTop: '20px', width: '100%', padding: '14px', backgroundColor: '#93c5fd', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'not-allowed', fontWeight: 'bold', fontSize: '16px' },
    buildOptions: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '12px', marginBottom: '16px' },
    buildOptionButton: { padding: '16px 12px', borderRadius: '8px', border: '2px solid', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', textAlign: 'center' },
    divider: { height: '1px', backgroundColor: '#e5e7eb', margin: '20px 0' },
    terminal: { backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '13px', minHeight: '150px' }
};