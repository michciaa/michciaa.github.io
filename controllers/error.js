

exports.get401 = (req, res, next) => {

    const err = req.query.errApi == 1 ? 'Podano niewłaściwy klucz API. Spróbuj ponownie (Problem w komunikacji z API OpenAI)' : '';
    const errData = req.query.data ? req.query.data : '';

    res.status(401).render('401', {
        pageTitle: 'OpenAI API Text-toArticle-Converter',
        path: '/500',
        error: err,
        errorInfo: JSON.stringify(errData)
    });
}
exports.get404 = (req, res, next) => {

    res.status(404).render('404', {
        pageTitle: 'OpenAI API Text-toArticle-Converter',
        path: '/404',
    });
}
exports.get500 = (req, res, next) => {

    const message = req.flash('error');
    res.status(500).render('500', {
        pageTitle: 'OpenAI API Text-toArticle-Converter',
        path: '/500',
    });



}