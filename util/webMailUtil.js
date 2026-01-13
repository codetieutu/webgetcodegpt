import Imap from 'imap';
import { simpleParser } from 'mailparser';
import "dotenv/config";

const getVerificationCode = async (recipient, subject = "Verification code") => {
    return new Promise((resolve, reject) => {
        const imapConfig = {
            user: process.env.IMAP_USER,
            password: process.env.IMAP_PASS,
            host: process.env.HOST,
            port: 993,
            tls: true,
            tlsOptions: { rejectUnauthorized: false },
        };

        const imap = new Imap(imapConfig);

        function openInbox(cb) {
            imap.openBox('INBOX', true, cb);
        }

        const WINDOW_MS = 5 * 60 * 1000; // 5 phút
        const now = Date.now();
        const cutoff = now - WINDOW_MS;

        imap.once('ready', function () {
            openInbox(function (err, box) {
                if (err) return reject(err);

                // Giới hạn phạm vi tìm trong 24h để nhanh hơn
                const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

                imap.search(['ALL', ['SINCE', since24h], ['SUBJECT', subject], ['TO', recipient]], function (err, results) {
                    if (err) return reject(err);
                    if (!results || results.length === 0) {
                        imap.end();
                        return resolve(null);
                    }

                    // Duyệt UID từ mới nhất về cũ
                    const uids = results.slice().sort((a, b) => b - a);

                    // Helper: fetch 1 uid và trả về { code, okWithinWindow }
                    function fetchOne(uid) {
                        return new Promise((res, rej) => {
                            const f = imap.fetch(uid, { bodies: '', struct: true });

                            let internalDate = null;
                            f.on('message', (msg) => {
                                msg.once('attributes', (attrs) => {
                                    // attrs.date hoặc attrs.internalDate (tùy server)
                                    internalDate = (attrs && (attrs.internalDate || attrs.date)) ? new Date(attrs.internalDate || attrs.date).getTime() : null;
                                });

                                msg.on('body', (stream) => {
                                    simpleParser(stream, (err, parsed) => {
                                        if (err) return rej(err);

                                        // Nếu server không trả internalDate, fallback sang header Date
                                        if (!internalDate && parsed.date) internalDate = new Date(parsed.date).getTime();

                                        const inWindow = internalDate && internalDate >= cutoff && internalDate <= now;

                                        // Tùy nội dung: lấy mã 6 chữ số
                                        let code = null;
                                        const text = parsed.text || parsed.html || '';
                                        const m = text && text.match(/\b\d{6}\b/);
                                        if (m) code = m[0];

                                        res({ code, inWindow, internalDate });
                                    });
                                });
                            });

                            f.once('error', rej);
                            f.once('end', () => {/* no-op */ });
                        });
                    }

                    (async () => {
                        try {
                            for (const uid of uids) {
                                const { code, inWindow } = await fetchOne(uid);
                                if (inWindow && code) {
                                    imap.end();
                                    return resolve(code);
                                }
                                // Nếu email đã quá cũ hơn 5 phút và danh sách đã đi đủ, tiếp tục duyệt tới khi gặp email còn mới
                                // Mẹo: khi gặp 1 email cũ hơn cutoff khá xa, có thể break sớm để tiết kiệm thời gian.
                            }
                            imap.end();
                            resolve(null);
                        } catch (e) {
                            imap.end();
                            reject(e);
                        }
                    })();
                });
            });
        });


        imap.once('error', function (err) {
            reject(err);
        });

        imap.connect();
    });
}

export {
    getVerificationCode
}