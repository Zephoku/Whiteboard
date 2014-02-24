/*
 * GET Home Page.
 */

exports.index = function(req, res) {
  res.render('whiteboard', {title: 'Whiteboard'});
}
