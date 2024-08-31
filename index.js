const express=require("express");
const mysql=require("mysql2");
const path=require("path");
const multer=require("multer");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const secretKey = '1234567890'; 

const app=express();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

const PORT=8080;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'stores',
    password: '5958@Kvreddy'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL');
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.redirect('/login');
        }

        req.user = user; 
        next();
    });
}



app.get('/',(req,res)=>{
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});



app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';

    connection.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Error checking credentials:', err.stack);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            const user = results[0];
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (isPasswordMatch) {
                const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
                res.cookie('token', token, { httpOnly: true });
                return res.redirect('/home');
            }
        }

        res.status(401).send('Invalid username or password');
    });
});


app.get('/register', (req, res) => {
    res.render('register');
});


app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); 

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    connection.query(query, [username, hashedPassword], (err, results) => {
        if (err) {
            console.error('Error registering user:', err.stack);
            return res.status(500).send('Internal Server Error');
        }

        res.redirect('/login');
    });
});


app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});


app.get('/home',  authenticateToken,(req, res) => {
    const query = 'SELECT * FROM stores';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching stores:', err.stack);
            return res.status(500).send('Internal Server Error');
        }

        res.render('index.ejs', { stores: results });
    });
});

app.get('/store/:id', authenticateToken,(req, res) => {
    const storeId = req.params.id;
    const query = 'SELECT * FROM stores WHERE id = ?';

    connection.query(query, [storeId], (err, results) => {
        if (err) {
            console.error('Error fetching store details:', err.stack);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            return res.status(404).send('Store not found');
        }

        res.render('store.ejs', { store: results[0] });
    });
});

app.get('/add-store',authenticateToken, (req, res) => {
    res.render('add_store.ejs');
});

app.post('/add-store',authenticateToken, upload.single('image'), (req, res) => {
    const { name, location, contact_number, available_products, website, open_at, close_at } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : null;

    const query = `INSERT INTO stores (name, location, contact_number, available_products, website, open_at, close_at, image)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(query, [name, location, contact_number, available_products, website, open_at, close_at, image], (err, results) => {
        if (err) {
            console.error('Error adding new store:', err.stack);
            return res.status(500).send('Internal Server Error');
        }

        res.redirect('/home');
    });
});

app.get('/update-store/:id', authenticateToken,(req, res) => {
    const storeId = req.params.id;
    const query = 'SELECT * FROM stores WHERE id = ?';

    connection.query(query, [storeId], (err, results) => {
        if (err) {
            console.error('Error fetching store details:', err.stack);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            return res.status(404).send('Store not found');
        }

        res.render('update_store', { store: results[0] });
    });
});


app.post('/update-store/:id',authenticateToken, upload.single('image'), (req, res) => {
    const storeId = req.params.id;
    const { name, location, contact_number, available_products, website, open_at, close_at } = req.body;
    let image = req.file ? `/images/${req.file.filename}` : req.body.current_image;

    const query = `UPDATE stores SET name = ?, location = ?, contact_number = ?, available_products = ?, website = ?, open_at = ?, close_at = ?, image = ? WHERE id = ?`;

    connection.query(query, [name, location, contact_number, available_products, website, open_at, close_at, image, storeId], (err, results) => {
        if (err) {
            console.error('Error updating store:', err.stack);
            return res.status(500).send('Internal Server Error');
        }

        res.redirect(`/store/${storeId}`);
    });
});


app.post('/delete-store/:id',authenticateToken, (req, res) => {
    const storeId = req.params.id;
    const query = 'DELETE FROM stores WHERE id = ?';

    connection.query(query, [storeId], (err, results) => {
        if (err) {
            console.error('Error deleting store:', err.stack);
            return res.status(500).send('Internal Server Error');
        }

        res.redirect('/home');
    });
});



app.listen(PORT,()=>{
    console.log("server is listening");
});
