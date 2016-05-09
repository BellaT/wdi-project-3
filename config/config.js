model.exports = {
  port: process.env.PORT || 3000;
  databse: process.env.MONGOLAB_URI || "mongodb://localhost/world-trails"
}