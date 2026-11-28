import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "s554ongw9quh1xjs.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "q13f8abv2sdtm9f7",
    password: "xfkhxd8incyar7z0",
    database: "a5o0slxh0r8zlf40",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', async (req, res) => {
//    res.send('Hello Express app!')
    let sql = 'SELECT authorId, firstName, lastName \
               FROM q_authors \
               ORDER BY lastName, firstName';
    const [rows] = await pool.query(sql);

    sql = 'SELECT DISTINCT category \
               FROM q_quotes \
               ORDER BY category';
    const [categories] = await pool.query(sql);
    res.render('index', {"authors": rows, "categories": categories});
});

app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});//dbTest

app.get("/searchByKeyword", async(req, res) => {
    let keyword = req.query.keyword;
    let sql = 'SELECT quote, authorId, firstName, lastName, likes, category \
               FROM q_quotes \
               NATURAL JOIN q_authors \
               WHERE quote LIKE ?';
    let sqlParams = [`%${keyword}%`];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results",{"quotes": rows});
});//searchByKeyword

app.get("/searchByAuthor", async(req, res) => {
    let authorId = req.query.authorId.valueOf();
    let sql = 'SELECT quote, authorId, firstName, lastName, likes, category \
               FROM q_quotes \
               NATURAL JOIN q_authors \
               WHERE authorId = ?';
    let sqlParams = [authorId];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results",{"quotes": rows});
});//searchByAuthor

app.get("/searchByCategory", async(req, res) => {
    let category = req.query.categoryId;
    let sql = 'SELECT quote, authorId, firstName, lastName, likes, category \
               FROM q_quotes \
               NATURAL JOIN q_authors \
               WHERE category = ?';
    let sqlParams = [category];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results",{"quotes": rows});
});//searchByCategory

app.get("/searchByLikes", async(req, res) => {
    let minLikes = req.query.minLikes;
    let maxLikes = req.query.maxLikes;
    let sql = 'SELECT quote, authorId, firstName, lastName, likes, category \
               FROM q_quotes \
               NATURAL JOIN q_authors \
               WHERE likes BETWEEN ? AND ?';
    let sqlParams = [minLikes, maxLikes];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results",{"quotes": rows});
});//searchByLikes

app.get('/api/author/:id', async (req, res) => {
    let authorId = req.params.id;
    let sql = 'SELECT * \
               FROM q_authors \
               WHERE authorId = ?';
    const [rows] = await pool.query(sql, [authorId]);
    res.send(rows);
})

app.listen(3000, ()=>{
    console.log("Express server running")
})