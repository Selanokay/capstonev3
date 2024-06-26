import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Import the CSS file for styling

const SongBillboard = () => {
    const [top100Songs, setTop100Songs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopSongs = async () => {
            try {
                const response = await axios.get('/api/top-artists-list');
                if (response.status === 200) {
                    setTop100Songs(response.data);
                    setLoading(false);
                } else {
                    throw new Error('Failed to fetch top songs');
                }
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchTopSongs();

        // Cleanup function
        return () => {
            // Cleanup logic if needed
        };
    }, []);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ backgroundColor: 'black', padding: '20px', display: 'flex', justifyContent: 'center', width: 'fit-content', margin: 'auto' }}>
            <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'lightgreen', borderRadius: '15px', padding: '20px', color: 'black' }}>
                <center>
                    <h2>Top 100 Artists</h2>
                </center>
                <table style={{ margin: 'auto', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center', border: '1px solid black', padding: '8px' }}>Rank</th>
                            <th style={{ textAlign: 'center', border: '1px solid black', padding: '8px' }}>Artist</th>
                            <th style={{ textAlign: 'center', border: '1px solid black', padding: '8px' }}>Total Listens</th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: 'center' }}>
                        {top100Songs.map((artist, index) => (
                            (artist.artist !== 'Unknown Artist' && artist.song !== 'Unknown Track') && (
                                <tr key={index}>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>#{index + 1}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{artist.artist}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{artist.count}</td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SongBillboard;