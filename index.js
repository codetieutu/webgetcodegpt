function butAction(){
    var email = document.getElementById("email").value;
    postData(email);
}
// Hàm gửi yêu cầu POST từ client đến server
async function postData(email) {
    try {
      const response = await fetch('localhost/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email})  // Dữ liệu cần gửi
      });
      
      // Đọc dữ liệu phản hồi từ server
      const data = await response.json();
      document.getElementById("code").textContent = data.subject;
      console.log("POST Response:", data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  