const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const uploadInput = document.getElementById('upload');
let uploadedImage = null;

// 處理圖檔上傳
uploadInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // 手機性能優化：縮放大圖
                if (img.width > 1000 || img.height > 1000) {
                    const scale = Math.min(1000 / img.width, 1000 / img.height);
                    img.width *= scale;
                    img.height *= scale;
                }
                uploadedImage = img;
                console.log("圖片已載入！");
            };
            img.onerror = function() {
                console.error("圖片載入失敗！");
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// 生成圖檔函數
function generateImage() {
    if (!ctx) {
        console.error("無法獲取 Canvas 2D 上下文！");
        return;
    }

    // 清除畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 設置白色背景
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 設置文字樣式（支援中文）
    ctx.font = '55px Arial, "Microsoft YaHei", sans-serif';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 繪製公司資訊標題
    ctx.fillText('連程實業有限公司 新北市林口區寶林路106-5號 TEL: 02-2602-9016 FAX: 02-2602-9015', 
                 canvas.width / 2, 54);

    // 繪製左側格子
    const leftLabels = ['訂單編號', '客戶', '材料別', '顏色', '其他細項'];
    const leftInputsBelow = [
        document.getElementById('order-number-below').value || '',
        document.getElementById('customer-below').value || '',
        document.getElementById('material-type-below').value || '',
        document.getElementById('color-below').value || '',
        document.getElementById('other-details-below').value || ''
    ];
    const leftX = 40;
    let leftY = 50;
    const titleBoxWidth = 500;
    const titleBoxHeight = 80;
    const contentBoxWidth = 500;
    const contentBoxHeight = 180;
    const bottomYStart = canvas.height - 500; // 接單日期上緣
    const specialBoxHeight = bottomYStart - (titleBoxHeight * 5 + contentBoxHeight * 4) - 30; // 保持 830px
    ctx.font = '55px Arial, "Microsoft YaHei", sans-serif';
    leftLabels.forEach((label, index) => {
        const titleXCenter = leftX - 20 + titleBoxWidth / 2;
        const titleYCenter = leftY - 30 + titleBoxHeight / 2;
        ctx.strokeRect(leftX - 20, leftY - 30, titleBoxWidth, titleBoxHeight);
        ctx.fillText(label, titleXCenter, titleYCenter);

        const belowY = leftY + titleBoxHeight;
        const currentBoxHeight = (index === leftLabels.length - 1) ? specialBoxHeight : contentBoxHeight;
        const contentXCenter = leftX - 20 + contentBoxWidth / 2;
        const contentYCenter = belowY - 30 + currentBoxHeight / 2;
        ctx.strokeRect(leftX - 20, belowY - 30, contentBoxWidth, currentBoxHeight);
        if (index === leftLabels.length - 1) { // 其他細項空白框內新增內容
            ctx.font = '50px Arial, "Microsoft YaHei", sans-serif';
            const lineHeight = 110; // 每行約 110px，高 660px，上下留 85px
            const startY = belowY - 30 + 85; // 從框頂部 +85px 開始

            // 第一列：水槽配件 有 □ 無 □
            ctx.fillText('水槽配件', leftX + 80, startY); // 保持往左 200px
            ctx.strokeRect(leftX + 240, startY - 40, 80, 80); // 有 勾選框 保持 x = 240
            ctx.fillText('有', leftX + 210, startY);
            ctx.strokeRect(leftX + 400, startY - 40, 80, 80); // 無 勾選框 保持 x = 400
            ctx.fillText('無', leftX + 370, startY);

            // 第二列：代訂 □
            ctx.fillText('代訂', leftX + 300, startY + lineHeight); // 居中
            ctx.strokeRect(leftX + 380, startY + lineHeight - 40, 80, 80); // 保持往右 50px

            // 第三列：指送 □
            ctx.fillText('指送', leftX + 300, startY + lineHeight * 2); // 居中
            ctx.strokeRect(leftX + 380, startY + lineHeight * 2 - 40, 80, 80); // 保持往右 50px

            // 第四列：自取 □
            ctx.fillText('自取', leftX + 300, startY + lineHeight * 3); // 居中
            ctx.strokeRect(leftX + 380, startY + lineHeight * 3 - 40, 80, 80); // 保持往右 50px

            // 第五列：□ 打勾崁金牌
            ctx.strokeRect(leftX + 70, startY + lineHeight * 4 + 100 - 40, 80, 80); // 保持往下 100px
            ctx.fillText('打勾崁金牌', leftX + 330, startY + lineHeight * 4 + 100); // 保持往下 100px

            // 第六列：□ 需附保證書
            ctx.strokeRect(leftX + 70, startY + lineHeight * 5 + 100 - 40, 80, 80); // 保持往下 100px
            ctx.fillText('需附保證書', leftX + 330, startY + lineHeight * 5 + 100); // 保持往下 100px

            ctx.font = '55px Arial, "Microsoft YaHei", sans-serif'; // 恢復字體
            ctx.fillText(leftInputsBelow[index], contentXCenter, contentYCenter); // 原輸入框內容
        } else {
            ctx.fillText(leftInputsBelow[index], contentXCenter, contentYCenter);
        }

        leftY = belowY + currentBoxHeight;
    });

    // 繪製底部表格（4 列）
    const bottomX = 40;

    // 第一列：標題
    const title1Labels = ['接單日期', '安裝日期', '安裝地址', '業主'];
    const title1Widths = [300, 800, 1800, 448]; // 總和 3428
    const title1Height = 70;
    let x1 = bottomX;
    title1Labels.forEach((label, index) => {
        const xCenter = x1 + title1Widths[index] / 2;
        const yCenter = bottomYStart + title1Height / 2;
        ctx.strokeRect(x1, bottomYStart, title1Widths[index], title1Height);
        ctx.fillText(label, xCenter, yCenter);
        x1 += title1Widths[index];
    });

    // 第二列：輸入框（安裝日期分 4 格）
    const content1Y = bottomYStart + title1Height;
    const content1Height = 180;
    const content1Widths = [300, 800, 1800, 448];
    let x2 = bottomX;
    title1Labels.forEach((label, index) => {
        const contentXCenter = x2 + content1Widths[index] / 2;
        const contentYCenter = content1Y + content1Height / 2;
        if (index === 1) { // 安裝日期分 4 格
            const subWidths = [150, 250, 150, 250]; // 預定 150, 輸入 250, 完成 150, 輸入 250
            let subX = x2;
            ctx.strokeRect(subX, content1Y, subWidths[0], content1Height);
            ctx.fillText('預定', subX + subWidths[0] / 2, contentYCenter);
            subX += subWidths[0];

            ctx.strokeRect(subX, content1Y, subWidths[1], content1Height);
            ctx.fillText(document.getElementById('install-date').value || '', subX + subWidths[1] / 2, contentYCenter);
            subX += subWidths[1];

            ctx.strokeRect(subX, content1Y, subWidths[2], content1Height);
            ctx.fillText('完成', subX + subWidths[2] / 2, contentYCenter);
            subX += subWidths[2];

            ctx.strokeRect(subX, content1Y, subWidths[3], content1Height);
            ctx.fillText(document.getElementById('install-date-complete').value || '', subX + subWidths[3] / 2, contentYCenter);
        } else {
            ctx.strokeRect(x2, content1Y, content1Widths[index], content1Height);
            const inputId = {'接單日期': 'order-date', '安裝地址': 'install-address', '業主': 'owner'}[label];
            ctx.fillText(document.getElementById(inputId).value || '', contentXCenter, contentYCenter);
        }
        x2 += content1Widths[index];
    });

    // 第三列：標題
    const title2Labels = ['施工人員', '業務', '注意事項', '電話'];
    const title2Widths = [800, 300, 1800, 448]; // 總和 3428
    const title2Height = 70;
    const title2Y = content1Y + content1Height;
    let x3 = bottomX;
    title2Labels.forEach((label, index) => {
        const xCenter = x3 + title2Widths[index] / 2;
        const yCenter = title2Y + title2Height / 2;
        ctx.strokeRect(x3, title2Y, title2Widths[index], title2Height);
        ctx.fillText(label, xCenter, yCenter);
        x3 += title2Widths[index];
    });

    // 第四列：輸入框（施工人員分 4 格）
    const content2Y = title2Y + title2Height;
    const content2Height = 180;
    const content2Widths = [800, 300, 1800, 448];
    let x4 = bottomX;
    title2Labels.forEach((label, index) => {
        const contentXCenter = x4 + content2Widths[index] / 2;
        const contentYCenter = content2Y + content2Height / 2;
        if (index === 0) { // 施工人員分 4 格
            const subWidths = [150, 250, 150, 250]; // 內場 150, 輸入 250, 安裝 150, 輸入 250
            let subX = x4;
            ctx.strokeRect(subX, content2Y, subWidths[0], content2Height);
            ctx.fillText('內場', subX + subWidths[0] / 2, contentYCenter);
            subX += subWidths[0];

            ctx.strokeRect(subX, content2Y, subWidths[1], content2Height);
            ctx.fillText(document.getElementById('construction-personnel').value || '', subX + subWidths[1] / 2, contentYCenter);
            subX += subWidths[1];

            ctx.strokeRect(subX, content2Y, subWidths[2], content2Height);
            ctx.fillText('安裝', subX + subWidths[2] / 2, contentYCenter);
            subX += subWidths[2];

            ctx.strokeRect(subX, content2Y, subWidths[3], content2Height);
            ctx.fillText(document.getElementById('construction-installation').value || '', subX + subWidths[3] / 2, contentYCenter);
        } else {
            ctx.strokeRect(x4, content2Y, content2Widths[index], content2Height);
            const inputId = {'業務': 'sales', '注意事項': 'notes', '電話': 'phone'}[label];
            ctx.fillText(document.getElementById(inputId).value || '', contentXCenter, contentYCenter);
        }
        x4 += content2Widths[index];
    });

    // 繪製中間圖檔
    if (uploadedImage && uploadedImage.complete) {
        const midX = 540; // 左邊從左側框右側開始 (40 + 500)
        const midY = 74; // 上邊距公司標題 20px (54 + 20)
        const midWidth = 2860; // 右側調整為 3400 (3400 - 540)
        const midHeight = 1906; // 下邊至底部框上緣 (2480 - 500 - 74)
        const scale = Math.min(midWidth / uploadedImage.width, midHeight / uploadedImage.height);
        const scaledWidth = uploadedImage.width * scale;
        const scaledHeight = uploadedImage.height * scale;
        ctx.drawImage(uploadedImage, midX, midY, scaledWidth, scaledHeight);
    } else {
        console.log("未載入圖片或圖片未完成載入，跳過繪製。");
    }

    // 將畫布轉為 PNG 並下載
    const dataURL = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'order_image.png';
    link.click();
}