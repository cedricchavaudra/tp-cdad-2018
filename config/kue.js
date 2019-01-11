var kue = require('kue');
console.log('working');
var kue_engine = kue.createQueue({
  prefix: 'kue',
  redis: process.env.REDIS_URL
  // redis: {
  // 	host: '172.19.0.3',
  // 	port: '5432'
  // }
});


process.once('SIGTERM', function (sig) {
  kue_engine.shutdown( 5000, function(err) {
    console.log( 'Kue shutdown: ', err||'' );
    process.exit( 0 );
  });
});

module.exports.kue = kue_engine;