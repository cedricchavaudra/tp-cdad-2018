/**
 * CowsayController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var cowsay = require('cowsay');

module.exports = {
  /**
   * `CowsayController.say()`
   */
  say: async function (req, res) {
    let count = await Sentences.count();
    console.debug('Got '+count+' sentences in database');
    let s = await Sentences.find().limit(1).
      skip(Math.floor(Math.random() * Math.floor(count)));
    let sentence = "Random Message";
    if(s.length > 0) {
      sentence = s[0].sentence;
    }
    return res.view('cowsay', { cow: cowsay.say({
      f: process.env.COW || 'stegosaurus',
      text : sentence,
      e : 'oO',
      T : 'U '
    })});
  },

  add: async function (req, res) {
    return res.view('add');
  },

  addPicture: async function (req, res) {
    return res.view('addPicture');
  },

  updatePicture: async function (req, res) {
    req.file('picture').upload(
    {
      adapter: require('skipper-better-s3'),
      key: 'AKIAJOCSBD4KTGNIE2YQ',
      secret: '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',
      bucket: 'lp-cdad-2018',
      region: 'eu-west-3',
      saveAs: 'chavaudra_vache.jpg',
      s3params: { 
        ACL: 'public-read'
      }
    }
    ,function whenDone(err, uploadedFiles) {
      if (err) {
        return res.serverError(err);
      }
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }
      //return res.send(uploadedFiles);
      return res.redirect('/say');
    });
  },

  create: async function(req, res) {
    await Sentences.create({ sentence: req.param('sentence') });

    // La queue ne fonctionne pas, le container ajouté au docker-compose.yml n'arrive pas à communiquer avec le container redis

    // var kue_engine = sails.config.kue;
    // kue_engine.create('delete_verified_email', {sentence:req.param('sentence'),email:'cedric.chavaudra@etu.unistra.fr'})
    //   .priority('medium')
    //   .attempts(1)
    //   .save();
    Mailer.sendWelcomeMail({sentence:req.param('sentence'),email:req.param('email')});
    return res.redirect('/say');
  },
};

