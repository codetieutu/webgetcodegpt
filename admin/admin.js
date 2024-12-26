function add() {
    const textarea = document.getElementById("input").value.trim();
    
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