(function() {
    const bypassForMe = false; 

    if (bypassForMe) {
        console.log("Geliştirici modu aktif: Engelleme pas geçildi.");
        return;
    }
    // ERİŞİMİNE İZİN VERİLEN ÖZEL IP ADRESLERİ (Beyaz Liste)
    // Türkiye filtresine takılmamak için kendi IP adreslerini buraya yazmalısın.

    // IP TABANLI KONTROLLER
    fetch('https://ip-api.com/json/')
        .then(response => response.json())
        .then(data => {

            // 2. ADIM: Sen değilsen, TIMEZONE kontrolü yap (Türkiye saat dilimindeyse engelle)
            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (userTimeZone === 'Europe/Istanbul' || userTimeZone === 'Asia/Istanbul') {
                blockAccess("TR_TIMEZONE");
                return;
            }

            // 3. ADIM: Sen değilsen, LOKASYON kontrolü yap (Türkiye IP'siyse engelle)
            if (data.countryCode === 'TR' || data.country === 'Turkey') {
                blockAccess("TR_LOCATION");
                return;
            }
        })
        .catch(err => {
            // API'ye ulaşılamazsa güvenlik önlemi olarak (VPN ile engelleme vb.) siteyi kapatıyoruz
            // Not: Eğer kendi IP'nizle giriyorsanız ve API çökerse siz de engellenebilirsiniz. 
            // Bu durumda geçici olarak bypassForMe = true yapabilirsiniz.
            blockAccess("SECURITY_CHECK_FAILED");
        });

    // Sayfayı tamamen yok eden fonksiyon
    function blockAccess(reason) {
        window.stop(); // Sayfa yüklenmesini durdur
        
        const checkAndBlock = () => {
            document.documentElement.innerHTML = `
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Access Denied</title>
                    <style>
                        * {
                            box-sizing: border-box;
                        }
                        body { 
                            background-color: #0b0f17; 
                            color: #f0f6fc; 
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
                            display: flex; 
                            justify-content: center; 
                            align-items: center; 
                            height: 100vh; 
                            margin: 0; 
                            padding: 20px;
                            overflow: hidden;
                        }
                        .error-card {
                            background: #161b22;
                            border: 1px solid #30363d;
                            border-radius: 12px;
                            padding: 40px 30px;
                            max-width: 450px;
                            width: 100%;
                            text-align: center;
                            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                            animation: fadeIn 0.4s ease-out;
                        }
                        .icon {
                            font-size: 3rem;
                            margin-bottom: 20px;
                            display: inline-block;
                            animation: pulse 2s infinite;
                        }
                        h1 {
                            font-size: 1.5rem;
                            margin: 0 0 15px 0;
                            color: #ff7b72;
                            font-weight: 600;
                        }
                        p {
                            font-size: 0.95rem;
                            color: #8b949e;
                            line-height: 1.6;
                            margin: 0 0 25px 0;
                        }
                        .badge {
                            display: inline-block;
                            background: rgba(240, 246, 252, 0.05);
                            border: 1px solid rgba(240, 246, 252, 0.1);
                            padding: 6px 12px;
                            border-radius: 20px;
                            font-size: 0.75rem;
                            color: #6e7681;
                            font-family: monospace;
                            letter-spacing: 0.5px;
                        }
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        @keyframes pulse {
                            0% { transform: scale(1); }
                            50% { transform: scale(1.05); }
                            100% { transform: scale(1); }
                        }
                    </style>
                </head>
                <body>
                    <div class="error-card">
                        <div class="icon">📍</div>
                        <h1>403 | Content Unavailable</h1>
                        <p>
                            Sorry, this website is currently under regional restrictions and is not accessible from your location.
                        </p>
                        <div class="badge">ERROR_CODE: BLOCKED_${reason}</div>
                    </div>
                </body>
                </html>
            `;
        };

        if (document.body) {
            checkAndBlock();
        } else {
            document.addEventListener("DOMContentLoaded", checkAndBlock);
        }
        
        throw new Error("Execution stopped due to restriction: " + reason);
    }
})();