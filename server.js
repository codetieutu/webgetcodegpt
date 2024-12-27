const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 5500;
const cors = require('cors');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sggetgp_nhanguyen',
    password: 'Nha190605@&*',
    database: 'sggetgp_mail'
});

app.use(cors());
app.use(express.json());

function find(mail, callback) {
    const query = 'SELECT * FROM Mail WHERE email = ?';
    connection.query(query, [mail], (err, results) => {
        if (err) {
            console.error('Lỗi khi tìm dữ liệu:', err);
            callback(null, null, null, err);
            return;
        }
        if (results.length > 0) {
            const { email, token, client_id } = results[0];
            console.log("", mail);
            callback(email, token, client_id, null);
        } else {
            callback(null, null, null, "Không tìm thấy dữ liệu");
        }
    
    });
}
function update(data, callback) {
    const query = "INSERT INTO Mail (email, token, client_id, time) values (?,?,?, NOW());";
    connection.query(query, [data.email, data.token, data.client_id], (err) =>{
        if (err) {
            callback("error");
        }
        else {
            callback("done");
        }
    });
}
function uppass(data, callback) {
    const query="INSERT INTO verify (pass, times) values (?,?);";
    connection.query(query, [data.pass, data.times], (err) =>{
        if (err) {
            callback("error");
        }
        else {
            callback("done");
        }
    })

}
async function getcode(mail, token, client_id) {
    const url = 'https://tools.dongvanfb.net/api/get_messages_oauth2';
    if (client_id==null) {client_id="9e5f94bc-e8a4-4e73-b8be-63364c29d753"}
    const data = {
        client_id: client_id,
        email: mail,
        refresh_token: token
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        const subject = result.messages.find(message => message.subject.includes("code is"));
        return subject.subject;
        
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function deleteOldData() {
    const sql = `
      DELETE FROM Mail
      WHERE TIMESTAMPDIFF(DAY, time, NOW()) >= 30
    `;
  
    connection.query(sql, (error, results) => {
      if (error) {
        console.error('Lỗi khi xóa dữ liệu:', error);
      } else {
        console.log(`Đã xóa ${results.affectedRows} bản ghi.`);
      }
    });
}
  

setInterval(() => {

deleteOldData();
}, 86400000); 

// Endpoint xử lý yêu cầu POST đến đường dẫn /data
app.post('/data', (req, res) => {
    const data = req.body;
    
    // Dùng callback để lấy dữ liệu từ database
    find(data.email, (email, token, client_id, err) => {
        if (err!=null) {
            return res.status(500).json({ error: "Lỗi truy vấn database" +err });
        }
        if (email && token) {
            getcode(email, token, client_id).then(subject =>{
                res.status(200).json({ subject:subject });
            });
        } else {
            res.json({ message: "Không tìm thấy dữ liệu cho email này" });
        }
    });
});
app.post("/check", (req, res) =>{
    const data = req.body;
    find(data.email, (email,token,client_id,err) => {
        if (err!=null) {
            return res.status(500).json({err: "lỗi truy vấn dữ liệu"})
        } else if(email && token){
            return res.status(200).json({response:"done"})
        } else{
            return res.status(204).res.end();
        }
    });
});

app.post("/update", (req, res)=>{
    const data = req.body;
    if (!data.email || !data.token) {
        return res.status(400).json({ error: "Thiếu email hoặc token" });
    }
    update(data, (sta) =>{
        if (sta==='done'){
            return res.status(200).json({mess:'update done'});
        }else{
            return res.status(500).json({mess: 'update fail'});
        }
    });
});
app.post("/uppass", (req, res)=>{
    const data = req.body;
    if (!data.email || !data.token) {
        return res.status(400).json({ error: "Thiếu " });
    }
    uppass(data, (sta) =>{
        if (sta==='done'){
            return res.status(200).json({mess:'update done'});
        }else{
            return res.status(500).json({mess: 'update fail'});
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

process.on('exit', () => {
    connection.end();
});