async function getcode(mail, token) {
    const url = 'https://tools.dongvanfb.net/api/get_messages_oauth2';
    const client_id = "9e5f94bc-e8a4-4e73-b8be-63364c29d753";

    const data = {
        client_id: client_id,
        email: mail,
        refresh_token: token
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result && result.messages && result.messages.length > 0) {
            const subject = result.messages[0].subject;
            const code = subject.match(/\b\d{6}\b/);
            return code ? code[0] : null; // Trả về mã xác nhận hoặc null nếu không tìm thấy
        } else {
            throw new Error("Không có tin nhắn nào.");
        }
    } catch (error) {
        console.error('Error:', error.message);
        return null; // Trả về null nếu có lỗi
    }
}

// Cách sử dụng hàm getcode
mail='ekuahmosena@hotmail.com'
token='M.C503_SN1.0.U.-CqUV!OvwJ40WZECb7gc2paAkoXTxVRQqV*iLzSbwblRyPoFAWynBr3kiub9tlWn1KGttgpEVF7mA!fHOM4oTmIvkFeclbASR4tAnKjKcgT9SMz7UOx9yHaz09z2OwqiKvtyveOykJ*Ol9O4WUP2odi97ZdwJcIhQkfWxXdWcpVOzTsjuvOCBWjZvqZ5b72DNI4hVOr9DeKYr6CfW735FzCLJR0p1aGuyk0VJlHtbp9uu6yOke3wKSYuLcDjL2BrH!zsTqOD7!hHi*ZqtvuwY*fxH*XKgwcGWGkjMr3LXZDCSQVgf4VxdprE6N6LBQjPVJmm*gNz8FHoZaC!KfiBOC4ERPCh5rbP5GqXFVBmXvuCwetzRPOqMrw6vkH80*k9hoUSdg5TtiQFZO9GiecIjFrC1ocd54Tc5GcNU1s6zr!WR|9e5f94bc-e8a4-4e73-b8be-63364c29d753';
getcode(mail, token).then(code => {
    if (code) {
        console.log("Verification code:", code);
    } else {
        console.log("Không tìm thấy mã xác nhận.");
    }
});
