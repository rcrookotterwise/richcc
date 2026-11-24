import express from 'express';
import { UAParser } from 'ua-parser-js';
import si from 'systeminformation';

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

async function getReleaseLifecycles() {
   const windows = await getReleaseLifecycle('Windows', 'windows');
   const ubuntu = await getReleaseLifecycle('Ubuntu', 'ubuntu');
   const macos = await getReleaseLifecycle('macOS', 'macos');

   return [windows, ubuntu, macos];
}

async function getReleaseLifecycle(name, slug) {
   const response = await fetch(`https://endoflife.date/api/${slug}.json`);
   if (!response.ok) {
      throw new Error(`endoflife.date returned ${response.status} for ${slug}`);
   }

   const releases = await response.json();
   if (!Array.isArray(releases)) {
      throw new Error(`endoflife.date returned invalid release data for ${slug}`);
   }

   const formattedReleases = [];
   for (const release of releases.slice(0, 5)) {
      let label = release.releaseLabel;
      if (!label) {
         label = release.cycle;
         if (release.codename) {
            label += ` ${release.codename}`;
         }
      }

      let supportDate = null;
      if (typeof release.support === 'string') {
         supportDate = release.support;
      } else if (typeof release.eol === 'string') {
         supportDate = release.eol;
      }

      let supportStatus = 'No end date listed';
      if (supportDate) {
         if (Date.parse(`${supportDate}T23:59:59Z`) >= Date.now()) {
            supportStatus = `Supported through ${supportDate}`;
         } else {
            supportStatus = `Support ended ${supportDate}`;
         }
      }

      const eol = typeof release.eol === 'string' ? release.eol : 'Not listed';
      const extendedSupport = typeof release.extendedSupport === 'string'
         ? release.extendedSupport
         : 'Not listed';

      formattedReleases.push({
         label,
         latest: release.latest || 'Not listed',
         supportStatus,
         eol,
         extendedSupport
      });
   }

   return { name, releases: formattedReleases };
}

app.get('/', function (req, res) {
   res.render('index', {
      title: 'Operating Systems | Overview',
      currentPage: 'overview'
   });
});

app.get('/how-it-works', function (req, res) {
   res.render('how-it-works', {
      title: 'How an Operating System Works',
      currentPage: 'how-it-works'
   });
});

app.get('/os-families', function (req, res) {
   res.render('os-families', {
      title: 'Operating-System Families',
      currentPage: 'os-families'
   });
});

app.get('/os-history', function (req, res) {
   res.render('os-history', {
      title: 'A Brief History of Operating Systems',
      currentPage: 'os-history'
   });
});

app.get('/os-recent-oses', async function (req, res) {
   try {
      const supportFamilies = await getReleaseLifecycles();
      res.render('os-recent-oses', {
         title: 'Recent OS Release Lifecycles',
         currentPage: 'os-recent-oses',
         supportFamilies
      });
   } catch (error) {
      console.error('Unable to load OS release information:', error);
      res.status(500).send('Unable to load OS release information.');
   }
});

app.get('/host-os', async function (req, res) {
   try {
      const os = await si.osInfo();
      const cpu = await si.cpu();
      const memory = await si.mem();
      const time = await si.time();

      res.render('host-os', {
         title: 'Host OS',
         currentPage: 'host-os',
         systemInfo: { os, cpu, memory, time }
      });
   } catch (error) {
      console.error('Unable to load host OS information:', error);
      res.status(500).send('Unable to load host OS information.');
   }
});

app.get('/browser', function (req, res) {
   const userAgent = req.get('user-agent') || '';
   const browserInfo = UAParser(userAgent);

   res.render('browser', {
      title: 'Browser',
      currentPage: 'browser',
      browserInfo
   });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
   console.log(`server started on port ${PORT}`);
});
