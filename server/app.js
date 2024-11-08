async function getcode(mail, pass, token) {
    const url = 'https://tools.dongvanfb.net/api/get_messages_oauth2';
    const data = {
        client_id: "9e5f94bc-e8a4-4e73-b8be-63364c29d753",
        email: "diameliuka@hotmail.com",
        pass: "czYPpKShZCA1Ig",
        refresh_token: token//"M.C531_SN1.0.U.-CqahwhCrCcnpgdSpKkIyzaJibqSxyFz8fuPzWfO*uZlijx30zeCE5cLl!Z6eP97p4x8iSybs40Zf7RzpO8ZvnlEC7P5e*qIz3vqnl0LRDTJ6VT4rxuMnPqz4lyl9ZCOUJZ07W12Niki8pTizhAQe4LzihFoRssSLKiHHgypKTelFR59NKebIpac*y*PsfK2iZOgww8ntI9n3*6ZQNAeb8vOB*lELJvwpfjT4hBKt7*sE7KcRExwCaJYLEGot2R5DvruufJXWH9NIbH8!0KDRIIek1t5SfHrrkToR9gg2CotmIGXeSh!jwqJ9*a7bMzMi!h7sPY6iangZC6EMnaRDOA8LHfV!CAJ**U7EoE5sS5Q9vwLK*U*hVhUoIjSAlkxSal5v1*X54FMYsPwg6I2diDiq8aWWPnYGKIUOPPzCtpDd"                 
    };
    const options = {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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
        // const subject = result.messages[0].subject;
        // const code = subject.match(/\b\d{6}\b/);
        return result;
        // return code ? code[0] : null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
var mail="diameliuka@hotmail.com";
var pass = "czYPpKShZCA1Ig"
var token="M.C531_SN1.0.U.-CqahwhCrCcnpgdSpKkIyzaJibqSxyFz8fuPzWfO*uZlijx30zeCE5cLl!Z6eP97p4x8iSybs40Zf7RzpO8ZvnlEC7P5e*qIz3vqnl0LRDTJ6VT4rxuMnPqz4lyl9ZCOUJZ07W12Niki8pTizhAQe4LzihFoRssSLKiHHgypKTelFR59NKebIpac*y*PsfK2iZOgww8ntI9n3*6ZQNAeb8vOB*lELJvwpfjT4hBKt7*sE7KcRExwCaJYLEGot2R5DvruufJXWH9NIbH8!0KDRIIek1t5SfHrrkToR9gg2CotmIGXeSh!jwqJ9*a7bMzMi!h7sPY6iangZC6EMnaRDOA8LHfV!CAJ**U7EoE5sS5Q9vwLK*U*hVhUoIjSAlkxSal5v1*X54FMYsPwg6I2diDiq8aWWPnYGKIUOPPzCtpDd|9e5f94bc-e8a4-4e73-b8be-63364c29d753";
getcode(mail, pass, token).then(code =>{
    console.log("", code);
});