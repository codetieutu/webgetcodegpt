function change(){
    document.getElementById("input-data").style.display = "block";
    document.getElementById("input-pass").style.display = "none";
}
function change2(){
    document.getElementById("input-data").style.display = "none";
    document.getElementById("input-pass").style.display = "block";
}
function verify(){
    const passwordInput = document.getElementById("password-input").value;
    const errorMessage = document.getElementById("error-message");

    if (passwordInput === 'pass:abcd1234') {
        console.log("password is corect");
        document.getElementById("password-screen").style.display = "none";
        document.getElementById("main-screen").style.display = "block";
    } else {
        errorMessage.textContent = "Mật khẩu không đúng, vui lòng thử lại!";
    }
}

function addData() {
    const textarea = document.getElementById("input-mail").value.trim();
    
    const datas = textarea.split("\n");
    const jsonArray = [];

    for (const data of datas) {
        const [email, token, id] = data.split('|').map(item => item.trim());

        if (!email || !token || !id) {
            console.error(`"${data}" không hợp lệ\n`);
            continue;
        }

        const datajson = {
            email: email,
            token: token,
            client_id: id
        };
        update(datajson);
    }

}

function update(data) {
    const response = fetch("/update", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: data
    });
    if(response.status == 200) {
        console.log(data, " done");
    } else{
        console.log(data," fail");
    }
}

function addPass() {
    const textarea = document.getElementById("input-pass").value.trim();
    
    const datas = textarea.split("\n");

    for (const data of datas) {
        const [pass, times] = data.split('|').map(item => item.trim());

        if (!pass || !times) {
            console.error(`"${data}" không hợp lệ\n`);
            continue;
        }

        const datajson = {
            pass: pass,
            times: times,
        };
        upPass(datajson);
    }

}
function upPass(data) {
    const response = fetch("/uppass", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: data
    });
    if(response.status == 200) {
        console.log(data, " done");
    } else{
        console.log(data," fail");
    }
}