module.exports = function (app) {
    app.get('/', function (req, res) {
        res.redirect('/main');
    });
    app.use('/main', require('./main'));
    app.use('/zhoou',require('./zhoou'));

    // 404 page
    app.use(function (req, res) {
        if (!res.headersSent) {
            res.render('404');
        }
    });
}