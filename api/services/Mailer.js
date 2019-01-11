module.exports.sendWelcomeMail = function(obj) {
 	sails.hooks.email.send(
 	"sentence", 
 	{
 		Sentence: obj.sentence
 	},
 	{
 		to: obj.email,
 		subject: "Bonjour"
 	},
 	function(err) {console.log(err || "Mail Sent!");}
 	)
}