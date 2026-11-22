import express from 'express';
import fetch from 'node-fetch';
const planets = (await import('npm-solarsystem')).default;
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

// app.get('/', (req, res) => {
//    res.send('Hello Express app!')
// });
app.get('/', async(req, res) => {
   let apiKey = "7756a1e81f817c186cf57294e1c19b37b49c54b8f34e7c499ee0ce5cd86cd16e";
   let url = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&featured=true&query=solar-system`;
   let response = await fetch(url);
   let data = await response.json();
   let randomImage = data.urls.full;
   res.render("index",{"image":randomImage})
});

app.get('/planet', (req, res) => {
   let planetName = req.query.planetName;
   let planetInfo = planets[`get${planetName}`]();
   res.render('planet', { planetInfo, planetName });
});

app.get('/earth', (req, res) => {
   let planetEarth = planets.getEarth();
   console.log(planetEarth);
   res.render('planet', { planetInfo: planetEarth, planetName: 'Earth' });
});

app.get('/mars', (req, res) => {
   let planetMars = planets.getMars();
   console.log(planetMars);
   res.render('planet', { planetInfo: planetMars, planetName: 'Mars' });
});

app.get('/nasa', async (req, res) => {
   try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(
         `https://science.nasa.gov/wp-json/wp/v2/apod-basic?date=${today}`
      );

      if (!response.ok) {
         throw new Error(`NASA API returned ${response.status}`);
      }

      const results = await response.json();
      if (!results.length) {
         throw new Error('NASA API returned no picture for today');
      }

      const nasaPicture = results[0];
      res.render('nasa', { nasaPicture });
   } catch (error) {
      console.error('Unable to load NASA Picture of the Day:', error);
      res.status(500).send('Unable to load NASA Picture of the Day.');
   }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`server started on port ${PORT}`);
});
