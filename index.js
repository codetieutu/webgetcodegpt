let typingTimer;
let turn=0;
const delay = 300; // Thời gian chờ 0.3s
const email = document.getElementById("email");
const notice = document.getElementById("notice");
function butAction(){
    var emaildata = email.value.trim();
    if(emaildata == ''){
      notice.style.display="block";
      notice.textContent="email empty";
    }else if (turn == 0){
      notice.style.display = "block";
      notice.textContent = "Out of turn to get code";
    }else {
      codeLabel = document.getElementById("code");
      codeLabel.textContent="Please, wait a minute";
      codeLabel.style.display="inline-block"
      document.getElementById("loading").style.display="block";
      postData(emaildata);
    }
}

email.addEventListener("input", function() {
  notice.style.display="block"
  clearTimeout(typingTimer);
  // Đặt lại timer mới
  typingTimer = setTimeout(check, delay);
});

function verify(){
  var pass = document.getElementById("password").value;
  console.log(""+pass);
  if(pass != "" && pass=='1234'){
    document.getElementById("verify-screen").style.display="none";
    document.getElementById("main-screen").style.display="block";
  }else{
    document.getElementById("error").textContent="wrong password";
  }
}
// Hàm gửi yêu cầu POST từ client đến server
async function postData(email) {
    try {
      const response = await fetch('/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email})  // Dữ liệu cần gửi
      });
      
      // Đọc dữ liệu phản hồi từ server
      const data = await response.json();
      document.getElementById("code").textContent = data.subject;
      document.getElementById("loading").style.display = "none" ;
      console.log("POST Response:", data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
async function check(){
  var email = document.getElementById("email").value.trim();
  var notice = document.getElementById("notice");
//   if(email==''){
//     notice.style.display = "none";
//     return ;
//   }
  try {
    const response = await fetch('/check', {
      method : "POST",
      headers : {'Content-Type': 'application/json'},
      body: JSON.stringify({ email: email})
    });
    if (response.status == 200) {
      notice.textContent = "valid email";
      notice.style.color="#39d633";
    } else{
      notice.textContent = "unvalid email";
      notice.style.color = "#e3684f";
    }
  } catch (error) {
    console.log("error: ", error);
  }
}