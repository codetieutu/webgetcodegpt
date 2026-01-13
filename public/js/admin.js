$(document).ready(function () {
    $('#updateOption').change(function () {
        let selectedValue = $(this).val();

        // Thêm xử lý tương ứng ở đây
        if (selectedValue === 'email') {
            $('.data').attr('placeholder', 'email|token|client_id|secret');
        } else if (selectedValue === 'password') {
            $('.data').attr('placeholder', 'pass|times');
        } else if (selectedValue === 'adobe') {
            $('.data').attr('placeholder', 'email|secret');
        }
    });
    $(".main-screen").hide();

    $(".verify").click(function () {
        const password = $("#password-input").val();
        $.ajax({
            url: "/api/admin/verify",
            type: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({ password }),
            success: function (response) {
                if (response.login) {
                    $(".password-overlay").hide();
                    $(".main-screen").show();
                } else {
                    $("#error-message").text("Mật khẩu không đúng, vui lòng thử lại!");
                }
            },
            error: function () {
                $("#error-message").text("Đã xảy ra lỗi, vui lòng thử lại!");
            }
        });
    });
    $(".save").click(async function () {
        let selectedValue = $('#updateOption').val();
        const data = $(".data").val();
        let done = 0;

        if (selectedValue === 'email') {
            const lines = data.split('\n');

            for (const row of lines) {
                const [email, token, client_id, secret] = row.split('|');

                if (!email || !token || !client_id) {
                    console.error("Dữ liệu không hợp lệ:", row);
                    continue;
                }

                try {
                    await $.ajax({
                        url: `/api/admin/mail`,
                        type: 'post',
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify({ email, token, client_id, secret })
                    });
                    console.log("Success:", email);
                    done++;
                } catch (error) {
                    console.error("Error:", error);
                }
            }

            alert(`add done ${done} mail`);
        } else if (selectedValue === 'password') {
            const lines = data.split('\n');

            for (const row of lines) {
                const [pass, times] = row.split('|');

                if (!pass || !times) {
                    console.error("Dữ liệu không hợp lệ:", row);
                    continue;
                }

                try {
                    await $.ajax({
                        url: `/api/admin/password`,
                        type: 'post',
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify({ password: pass, times })
                    });
                    done++;
                } catch (error) {
                    console.error("Error:", error);
                }
            }

            alert(`add done ${done} pass`);
        } else if (selectedValue === 'adobe') {
            const lines = data.split('\n');

            for (const row of lines) {
                const [email, secret] = row.split('|');

                if (!email || !secret) {
                    console.error("Dữ liệu không hợp lệ:", row);
                    continue;
                }

                try {
                    await $.ajax({
                        url: `http://localhost:8080/addAdobe`,
                        type: 'post',
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify({ email, secret })
                    });
                    done++;
                } catch (error) {
                    console.error("Error:", error);
                }
            }

            alert(`add done ${done} adobe secret`);
        }
    });


});