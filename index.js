function butAction(){
    var email = document.getElementById("email").value;
    alert("từ từ rồi nó chạy ahaha")
    // postData(email);
}
// Hàm gửi yêu cầu POST từ client đến server
async function postData(email) {
    try {
      const response = await fetch('http://localhost:5500/data', {
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
  

// async function getData() {
//     try {
//       const response = await fetch('http://localhost:5500');
//       const data = await response.text();
//       console.log("GET Response:", data);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   }
  
//   // Hàm thực hiện POST request
//   async function postData() {
//     try {
//       const response = await fetch('http://localhost:5500/data', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name: 'John Doe', age: 30 })
//       });
//       const data = await response.json();
//       console.log("POST Response:", data);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   }
  