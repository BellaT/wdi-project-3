var Marker = require('../models/marker');

function markersIndex(req, res) {
  Marker.find(function(err, markers){
    if (err) return res.status(404).json({ message: 'Something went wrong.' });
    res.status(200).json({ markers: markers });
  });
}

module.exports = {
  index:  markersIndex
}