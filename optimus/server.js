const express = require('express');
  const bodyParser = require('body-parser')
  const path = require('path');
  const app = express();
  app.disable('x-powered-by');
  app.use(express.static(path.join(__dirname, 'dist')));
  // need to declare a "catch all" route on your express server
  // that captures all page requests and directs them to the client
  // the react-router do the route part
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
  app.listen(
    process.env.PORT || 8001,
    function () {
      console.log(`Frontend start on http://localhost:8001`)
    }
  );


