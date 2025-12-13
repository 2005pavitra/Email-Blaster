import { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
    const [stats, setStats] = useState({ totalSent: 0, recentLogs: [] });

    useEffect(() => {
        fetchStats();
        // Refresh stats every 5 seconds
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/stats`);
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        }
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'Arial' }}>
            <h1>Admin Dashboard</h1>

            <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '30px' }}>
                <h2>Total Emails Sent: {stats.totalSent}</h2>
            </div>

            <h3>Recent Logs</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr style={{ background: '#333', color: 'white' }}>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Time</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Sender</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Target</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Subject</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.recentLogs.map((log, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{new Date(log.timestamp).toLocaleString()}</td>
                            <td style={{ padding: '10px' }}>{log.senderEmail || 'N/A'}</td>
                            <td style={{ padding: '10px' }}>{log.targetEmail}</td>
                            <td style={{ padding: '10px' }}>{log.subject}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Admin;
