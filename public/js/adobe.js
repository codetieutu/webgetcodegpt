$(document).ready(function () {
    let isPolling = false;
    let pollTimeoutId = null;
    let countdownId = null;
    const duration = 6;

    function stopAll(originalBtnText) {
        isPolling = false;
        $("#spinner").hide();
        $(".btn").prop("disabled", false).text(originalBtnText);
        if (pollTimeoutId) { clearTimeout(pollTimeoutId); pollTimeoutId = null; }
        if (countdownId) { clearInterval(countdownId); countdownId = null; } // NEW
    }

    $(".btn").on("click", function () {
        if (isPolling) return;

        const mail = $(".mail").val();
        if (!mail) {
            $("#code").text("Please enter email").css("color", "red");
            return;
        }

        isPolling = true;

        const $btn = $(".btn");                         // NEW
        const originalBtnText = $btn.text().trim() || "Get Code"; // NEW
        $btn.prop("disabled", true);
        $("#code").text("").css("color", "");
        $("#spinner").show();

        const deadline = Date.now() + 60 * 1000;

        // NEW: đếm ngược ngay trong nút
        function updateCountdown() {
            const left = Math.max(0, deadline - Date.now());
            const s = Math.ceil(left / 1000);
            $btn.text(`${originalBtnText} (${s}s)`);
            if (left <= 0) {
                clearInterval(countdownId);
                countdownId = null;
            }
        }
        updateCountdown();
        countdownId = setInterval(updateCountdown, 1000);

        function poll() {
            if (Date.now() >= deadline) {
                $("#code").text("verify code not found, please try again later.").css("color", "red");
                stopAll(originalBtnText); // NEW
                return;
            }

            $.ajax({
                url: "/api/verify-email",
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({ email: mail }),
                success: function (data) {
                    if (data && data.code != null && data.code !== "") {
                        $("#code").text(data.code).css("color", "green");
                        stopAll(originalBtnText); // NEW
                    } else {
                        pollTimeoutId = setTimeout(poll, duration * 1000);
                    }
                },
                error: function () {
                    pollTimeoutId = setTimeout(poll, 2000);
                }
            });
        }

        poll();
    });


    // kiểm tra email có tồn tại chưa
    let timer = null;
    let sentRecently = false;
    const WAIT = 2000;

    $("#mail").on("input", async function () {

        const mail = this.value.trim();
        clearTimeout(timer);

        if (!sentRecently) {
            sentRecently = true;
            $.ajax({
                url: "/api/check-email",
                method: "post",
                contentType: "application/json",
                data: JSON.stringify({ mail }),
                dataType: "json",
                success: function (data) {
                    if (data.exists) {
                        $("#notice").text("Valid email").css("color", "green");
                    } else {
                        $("#notice").text("Invalid email").css("color", "red");
                    }
                },
                error: function () {
                    $("#notice").text("Error checking email").css("color", "red");
                }
            })

        }

        timer = setTimeout(() => {
            sentRecently = false;
            console.log("check 2: ", mail);
        }, WAIT);
    });
});
