$(document).ready(function(){
  let pass = $(".password").val();
  let times = 0;
  $(".form-container").hide();
  
  $(".verify").click(function(){
    pass = $("#password-input").val();
    $.ajax({
      url: `http://localhost:8080/checkpass`, // Example API
      type: 'post',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({pass: pass}),
      success: function(data) {
        $(".form-container").show();
        $(".password-overlay").hide();
        times = data.times;
        $(".turn").text(` Turn: ${data.times}`);
      },
      error: function(xhr, status, error) {
        $("#error-message").text("Password error, please try again!");
        $("#error-message").css("color", "red");
      }
    });
    
  });
  // $(".password-overlay").hide();
  $(".btn").on("click", function(){
    let secret = $(".mail").val();
    $('#loading').show();
    $.ajax({
      url: `http://localhost:8080/get2fa`, // Example API
      type: 'post',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({mail: secret, pass: pass}),
      success: function(data) {
        times--;
        $(".turn").text(` Turn: ${times}`);
        $('#loading').hide();
        if(data.token == null){
          
          $('#code').text("Error: Token not found");
          $('#code').css("color", "red");
        }
        $('#code').text(data.token);
        $('#code').css("color", "green");
      },
      error: function(xhr, status, error) {
          console.error("Error:", error);
      }
  });
    
  });

});