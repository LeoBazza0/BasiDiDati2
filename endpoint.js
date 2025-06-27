/* 
dove si definiscono tutte le rotte API del sistema 

*/

/* QUESTI DATI VANNO CONTROLLATI E NON SO SE VANNO QUA
const pg = require('pg')
const pool = new pg.Pool({
user: 'me',
host: 'localhost',
database: 'videoteca',
password: 'password',
port: 5432,
})
*/


module.exports = (app) => {
    app.get("/film", getfilms)
    // E QUI AGGIUNGO TUTTE LE FUNZIONI CHE FARO POI IN SEGUITO
}

/* DOVREI AGGIUNGERE QUESTA PARTE IN QUESTO PUNTO QUA(?)
const auth = (req, res, next) => {
    if (req.headers['user'] === undefined)
        return res.status(401).send({ message: 'No token provided.' })

    req.user = req.headers['user']
    next()
}
*/

const getfilms = (req, res) => {
    if (req.headers['user'] //e altre cose
        //e altre cose
    )
        // #swagger.tags = ['Film']
        // #swagger.summary = 'recupera il film' 
        // questi due sono commenti che sono visti dal programma, 
        // che gli dice dove deve andare a predere delle cose
        const params = {}

    params.search = (req.query.q === undedfined) ? "" : req.query.q
    params.genre = (req.query.genre == undedfined) ? "" : req.query.genre
    params.size = (isNaN(req.query.size) || req.query.size < 1 || req.query.size > 50) ? 20 : req.query.size
    params.page = (isNan(req.query.page) || req.query.page < 1) ? 0 : parseInt(req.query.page)
    params.next = null
    params.previous = params.page > 0 ? params.page - 1 : null

    const query = 'DENTRO QUA CI VA LA QUERY IN SQL'

    pool.query(query).then((results) => {
        return res.status(200).send(results.rows)
    })
}


// qui devo capire cosa mettere dove e come
// dovrebbe essere una cosa abbastanza standard: faccio una const query = 'SELECT FROM WHERE' e qualche altra cosa per ogni interazione che voglio che faccia
// DOVREBBE