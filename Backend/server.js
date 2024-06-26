const path = require('path');
const { fileURLToPath } = require('url');

require('dotenv').config()

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const mongoose = require('mongoose')
const musicinfo = require('./musicinfo')
const fs = require('fs')
const express = require('express')
const songRoutes = require('./routes/songs')
const bodyParser = require('body-parser')
const multer = require('multer')
const http = require("http");
const { normalizePort, onError, onListening } = require("./portNormalization");

const userRoutes = require('./routes/user')

//express app
const app = express();

app.use(express.static(path.join(__dirname, '/Frontend/public')))


//app.get("*", (req, res) =>
//   res.sendFile(path.join(__dirname, "/Frontend/public/index.html"))
//);


// Read JSON file
function readJson(file_path) {
    const data = JSON.parse(fs.readFileSync(file_path, 'utf-8'));
    return data;
}


// Extract top ten most listened-to songs
/*function topTenSongs(data) {
    const songCounts = {};

    // Count occurrences of each song
    data.forEach(entry => {
        // Exclude entries with "Unknown Artist" or "Unknown Track"
        if (entry.artistName !== 'Unknown Artist' && entry.trackName !== 'Unknown Track') {
            const key = `${entry.artistName} - ${entry.trackName}`;
            songCounts[key] = (songCounts[key] || 0) + 1;
        }
    });

    // Sort by song counts
    const sortedSongs = Object.entries(songCounts)
                              .sort(([,countA], [,countB]) => countB - countA)
                              .slice(0, 10);

    return sortedSongs;
}*/

// Create top songs bar chart
async function createSongsBarChart(topSongs) {
    const width = 875;
    const height = 650;

    const chartCallback = (ChartJS) => {
        ChartJS.defaults.font.family = 'Arial';
        ChartJS.defaults.font.size = 18;
    };

    const chartCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

    const configuration = {
        type: 'bar',
        data: {
            labels: topSongs.map(([song, _]) => song),
            datasets: [{
                label: 'Number of Plays',
                data: topSongs.map(([_, count]) => count),
                backgroundColor: 'rgba(255, 215, 0, .75)',
                borderColor: 'rgba(255, 215, 0, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        color: 'black' // Change the color of the y-axis labels to black
                    },
                    grid: {
                        color: 'black' // Change the color of the y-axis grid lines to black
                    }
                },
                x: {
                    ticks: {
                        color: 'black' // Change the color of the x-axis labels to black
                    },
                    grid: {
                        color: 'black' // Change the color of the x-axis grid lines to black
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'black' // Change the color of the legend labels to black
                    }
                },
                animation: {
                    duration: 1500, // Duration of the animation in milliseconds
                    easing: 'easeInOutCirc', // Easing function for the animation
                    from: {
                        y: 'bottom' // Bars will flow in from the bottom
                    }
                }
            }
        }
    };

    const image = await chartCanvas.renderToBuffer(configuration);
    return image; // Return the image buffer
}

// Extract top ten most listened-to artists
/*function topTenArtists(data) {
    const artistCounts = {};

    // Count occurrences of each artist
    data.forEach(entry => {
        // Exclude entries with "Unknown Artist"
        if (entry.artistName !== 'Unknown Artist') {
            const artist = entry.artistName;
            artistCounts[artist] = (artistCounts[artist] || 0) + 1;
        }
    });

    // Sort by artist counts
    const sortedArtists = Object.entries(artistCounts)
                                  .sort(([,countA], [,countB]) => countB - countA)
                                  .slice(0, 10);

    return sortedArtists;
}*/

async function createArtistsBarChart(topArtists) {
    const width = 800;
    const height = 600;

    const chartCallback = (ChartJS) => {
        ChartJS.defaults.font.family = 'Arial';
        ChartJS.defaults.font.size = 18;
    };

    const chartCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

    const configuration = {
        type: 'bar',
        data: {
            labels: topArtists.map(([artist, _]) => artist),
            datasets: [{
                label: 'Number of Plays',
                data: topArtists.map(([_, count]) => count),
                backgroundColor: 'rgba(255, 215, 0, .75)', 
                borderColor: 'rgba(255, 215, 0, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        color: 'black' // Change the color of the y-axis labels to black
                    },
                    grid: {
                        color: 'black' // Change the color of the y-axis grid lines to black
                    }
                },
                x: {
                    ticks: {
                        color: 'black' // Change the color of the x-axis labels to black
                    },
                    grid: {
                        color: 'black' // Change the color of the x-axis grid lines to black
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'black' // Change the color of the legend labels to black
                    }
                },
                animation: {
                    duration: 1500, // Duration of the animation in milliseconds
                    easing: 'easeInOutCirc', // Easing function for the animation
                    from: {
                        y: 'bottom' // Bars will flow in from the bottom
                    }
                }
            }
        }
    };

    const image = await chartCanvas.renderToBuffer(configuration);
    return image; // Return the image buffer
}

async function createArtistsPieChart(topArtists) {
    const width = 800;
    const height = 600;

    const chartCallback = (ChartJS) => {
        ChartJS.defaults.font.family = 'Arial';
        ChartJS.defaults.font.size = 18;
    };

    const chartCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

    // Generate 25 different sets of colors
    const backgroundColors = generateRandomColors(25, 0.75);
    const borderColors = generateRandomColors(25, 1);

    const configuration = {
        type: 'pie',
        data: {
            labels: topArtists.map(([artist, _]) => artist),
            datasets: [{
                label: 'Number of Plays',
                data: topArtists.map(([_, count]) => count),
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: 'black' // Change the color of the legend labels to black
                    }
                }
            }
        }
    };

    const image = await chartCanvas.renderToBuffer(configuration);
    return image; // Return the image buffer
}

// Function to generate random colors
function generateRandomColors(count, alpha) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const color = `rgba(${getRandomNumber(0, 255)}, ${getRandomNumber(0, 255)}, ${getRandomNumber(0, 255)}, ${alpha})`;
        colors.push(color);
    }
    return colors;
}

// Function to generate a random number within a range
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



console.log(__dirname);
// Middleware
app.use(express.json());

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

//routes for loginsignup nerms
app.use('/api/user', userRoutes)

//middleware (Use request.render to render pages, if you dont )
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

// disable CORS
app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
    );
    console.log('Middleware');
    next();
  })

//Multer middleware setup for handling file uploads. Uploads/ is temporary, actual destination will need to be included.
// Multer middleware setup for handling file uploads
const upload = multer({ dest: 'uploads/' })


// Route to render the upload form
app.get('/upload', (req, res) => {
   res.send(`
       <h1>Upload JSON File</h1>
       <form action="/api/upload-json" method="post" enctype="multipart/form-data">
           <input type="file" name="jsonFile">
           <button type="submit">Upload</button>
       </form>
   `);
});


// Route to handle file upload
app.post('/api/upload-json', upload.single('jsonFile'), async (req, res) => {
   try {
       // Check if file was uploaded
       if (!req.file) {
           return res.status(400).send('No file uploaded.');
       }


       // Read uploaded JSON file
       const jsonData = fs.readFileSync(req.file.path, 'utf8');
      
       // Parse JSON data
       const parsedData = JSON.parse(jsonData);


       // Save parsed data into MongoDB
       await musicinfo.insertMany(parsedData);

       res.json({ redirectUrl: '/' });
   } catch (error) {
       console.error('Error uploading JSON file and saving data to MongoDB:', error);
       res.status(500).send('Internal Server Error');
   }
});


// Route to fetch all music info from MongoDB listed by most minutes played
app.get('/api/allsongs', async (req, res) => {
    try {
        const allMusicInfo = await musicinfo.find().sort({ msPlayed: -1 });
        res.status(200).json(allMusicInfo);
    } catch (error) {
        console.error('Error fetching all music info:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to generate and send top artists chart
app.get('/api/top-artists-chart', async (req, res) => {
    try {
        // Get all music info from MongoDB
        const allMusicInfo = await musicinfo.find();

        // Filter out entries with "Unknown Artist"
        const filteredData = allMusicInfo.filter(entry => entry.artistName !== 'Unknown Artist');

        // Get top artists from filtered data
        const topArtists = filteredData.reduce((artistCounts, entry) => {
            artistCounts[entry.artistName] = (artistCounts[entry.artistName] || 0) + 1;
            return artistCounts;
        }, {});

        // Sort and limit to top 10 artists
        const sortedArtists = Object.entries(topArtists)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 10);

        // Extract artist names and counts
        const topArtistsData = sortedArtists.map(([artist, count]) => [artist, count]);

        // Generate bar chart image
        const chartImage = await createArtistsBarChart(topArtistsData);

        // Send the image as response
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': chartImage.length
        });
        res.end(chartImage);
    } catch (error) {
        console.error('Error generating top artists chart:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to generate and send top songs chart
app.get('/api/top-songs-chart', async (req, res) => {
    try {
        // Get all music info from MongoDB
        const allMusicInfo = await musicinfo.find();

        // Filter out entries with "Unknown Artist" and "Unknown Track"
        const filteredData = allMusicInfo.filter(entry => entry.artistName !== 'Unknown Artist' && entry.trackName !== 'Unknown Track');

        // Get top songs from filtered data
        const topSongs = filteredData.reduce((songCounts, entry) => {
            const key = `${entry.artistName} - ${entry.trackName}`;
            songCounts[key] = (songCounts[key] || 0) + 1;
            return songCounts;
        }, {});

        // Sort and limit to top 10 songs
        const sortedSongs = Object.entries(topSongs)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 10);

        // Extract song names and counts
        const topSongsData = sortedSongs.map(([song, count]) => [song, count]);

        // Generate bar chart image
        const chartImage = await createSongsBarChart(topSongsData);

        // Send the image as response
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': chartImage.length
        });
        res.end(chartImage);
    } catch (error) {
        console.error('Error generating top songs chart:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to generate and send top artists pie chart
app.get('/api/top-artists-pie-chart', async (req, res) => {
    try {
        // Get all music info from MongoDB
        const allMusicInfo = await musicinfo.find();

        // Filter out entries with "Unknown Artist"
        const filteredData = allMusicInfo.filter(entry => entry.artistName !== 'Unknown Artist');

        // Get top artists from filtered data
        const topArtists = filteredData.reduce((artistCounts, entry) => {
            artistCounts[entry.artistName] = (artistCounts[entry.artistName] || 0) + 1;
            return artistCounts;
        }, {});

        // Sort and limit to top 25 artists
        const sortedArtists = Object.entries(topArtists)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 25);

        // Extract artist names and counts
        const topArtistsData = sortedArtists.map(([artist, count]) => [artist, count]);

        // Generate pie chart image
        const chartImage = await createArtistsPieChart(topArtistsData);

        // Send the image as response
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': chartImage.length
        });
        res.end(chartImage);
    } catch (error) {
        console.error('Error generating top artists pie chart:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to get top 100 songs by count
app.get('/api/top-songs-list', async (req, res) => {
    try {
      // Aggregate pipeline to group by artist and track name and count occurrences
      const topSongs = await musicinfo.aggregate([
        {
          $group: {
            _id: { artistName: '$artistName', trackName: '$trackName' },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 } // Sort by count in descending order
        },
        {
          $limit: 100 // Limit to top 100 songs
        },
        {
          $project: {
            _id: 0, // Exclude _id field from the result
            artist: '$_id.artistName',
            song: '$_id.trackName',
            count: 1
          }
        }
      ]);
  
      res.json(topSongs);
    } catch (error) {
      console.error('Error fetching top songs list:', error);
      res.status(500).send('Internal Server Error');
    }
  });

app.get('/api/top-artists-list', async (req, res) => {
    try {
        // Get all music info from MongoDB
        const allMusicInfo = await musicinfo.find();

        // Filter out entries with "Unknown Artist"
        const filteredData = allMusicInfo.filter(entry => entry.artistName !== 'Unknown Artist');

        // Get top artists from filtered data
        const topArtists = filteredData.reduce((artistCounts, entry) => {
            artistCounts[entry.artistName] = (artistCounts[entry.artistName] || 0) + 1;
            return artistCounts;
        }, {});

        // Sort and limit to top 100 artists
        const sortedArtists = Object.entries(topArtists)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 100);

        // Extract artist names and counts
        const topArtistsData = sortedArtists.map(([artist, count]) => ({ artist, count }));

        // Return the top 100 artists
        res.json(topArtistsData);
        
    } catch (error) {
        console.error('Error generating top artists list:', error);
        res.status(500).send('Internal Server Error');
    }
});


const port = normalizePort(process.env.PORT || "4000");
app.set("port", port); // Setting the port for the Express application

// Separate function to start the server
const startServer = () => {
    const server = http.createServer(app); // Creating an HTTP server using the Express application
    server.on("error", onError);
    server.on("listening", () => onListening(server));
    server.listen(port); // Listening on the specified port
    console.log('Listening on port:', port)
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        startServer(); // Start the server after successful MongoDB connection
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error);
    });
