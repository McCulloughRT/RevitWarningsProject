var Schema = require('./warning');

exports.SendEmail = SendEmail;

function SendEmail(emailField, club) {
  var email = new Schema.EmailDB({
    name: emailField,
    club: club
  });

  email.save(function(err){
    if (err) throw err;
    console.log('email saved');
  });
}
