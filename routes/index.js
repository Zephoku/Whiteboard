/*
 * GET Home Page.
 */

exports.whiteboard = function(req, res) {
  res.render('whiteboard', {title: 'Whiteboard'});
}
exports.index = function(req, res) {
  res.render('Index', {title: 'Whiteboard'});
}
