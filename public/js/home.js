$(document).ready(function () {
    let pass = $(".password").val();
    let times = 0;
    let timeoutId = null;
    const timeOut = 1500;
    let sentRecently = false;
    $(".form-container").hide();
    $('#mail').on('input', function () {
        const email = $(this).val().trim();
        clearTimeout(timeoutId);
        if (!sentRecently) {
            sentRecently = true;
            $.ajax({
                url: '/api/check-email',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ mail: email }),
                success: function (res) {
                    console.log(res.exists);

                    if (res.exists) $('#notice').text('valid email').css('color', '#39d633');
                    else
                        $('#notice').text('unvalid email').css('color', '#e3684f');
                },
                error: function () {
                    $('#notice').text('unvalid email').css('color', '#e3684f');
                }
            });
        }
        timeoutId = setTimeout(() => {
            sentRecently = false;
            $.ajax({
                url: '/api/check-email',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ mail: email }),
                success: function (res) {
                    if (res.exists) $('#notice').text('valid email').css('color', '#39d633');
                    else
                        $('#notice').text('unvalid email').css('color', '#e3684f');
                },
                error: function () {
                    $('#notice').text('unvalid email').css('color', '#e3684f');
                }
            });
        }, timeOut);

    });
    $(".verify").click(function () {
        pass = $("#password-input").val();
        $.ajax({
            url: `/api/verify-password`, // Example API
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ password: pass }),
            success: function (data) {
                $(".form-container").show();
                $(".password-overlay").hide();
                times = data.times;
                $(".turn").text(` Turn: ${data.times}`);
            },
            error: function (xhr, status, error) {
                $("#error-message").text("Password error, please try again!");
                $("#error-message").css("color", "red");
            }
        });

    });
    // $(".password-overlay").hide();
    $(".btn").on("click", function () {
        let secret = $(".mail").val();
        $('#loading').show();
        $.ajax({
            url: `/api/2fa`, // Example API
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ email: secret, password: pass }),
            success: function (data) {
                times--;
                $(".turn").text(` Turn: ${times}`);
                $('#loading').hide();
                if (data.token == null) {

                    $('#code').text("Error: Token not found");
                    $('#code').css("color", "red");
                }
                $('#code').text(data.token);
                $('#code').css("color", "green");
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            }
        });

    });

});