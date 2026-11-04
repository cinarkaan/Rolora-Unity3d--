(function () {
    document.addEventListener("DOMContentLoaded", function () {
      const logoImg = document.getElementById("mainLogo");

      function trimImageAlpha(imgElement) {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imgElement.src;

        img.onload = function () {
          try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;

            let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
            let hasContent = false;

            for (let y = 0; y < canvas.height; y++) {
              for (let x = 0; x < canvas.width; x++) {
                const alpha = data[(y * canvas.width + x) * 4 + 3];
                if (alpha > 0) {
                  if (x < minX) minX = x;
                  if (x > maxX) maxX = x;
                  if (y < minY) minY = y;
                  if (y > maxY) maxY = y;
                  hasContent = true;
                }
              }
            }

            if (hasContent) {
              const cutWidth = maxX - minX + 1;
              const cutHeight = maxY - minY + 1;

              const trimmedCanvas = document.createElement("canvas");
              const trimmedCtx = trimmedCanvas.getContext("2d");

              trimmedCanvas.width = cutWidth;
              trimmedCanvas.height = cutHeight;

              trimmedCtx.drawImage(
                canvas,
                minX, minY, cutWidth, cutHeight,
                0, 0, cutWidth, cutHeight
              );

              imgElement.src = trimmedCanvas.toDataURL();
            }
          } catch (e) {
            console.warn("CORS/Canvas kısıtlaması nedeniyle resim orijinal haliyle bırakıldı:", e);
          } finally {
            imgElement.style.opacity = "1";
          }
        };

        img.onerror = function() {
          imgElement.style.opacity = "1";
        };
      }

      trimImageAlpha(logoImg);
    });
})();