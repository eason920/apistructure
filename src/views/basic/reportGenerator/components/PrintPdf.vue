<template>
  <div class="btn is_small is_back" @click="fnDownloadPdf">
    <img src="@/assets/images/publicImages/icon_pdf.svg" />
    PDF
  </div>
</template>

<script>
export default {
  name: 'PrintPdf'
};
</script>

<script setup>
// Plugins
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const fnDownloadPdf = () => {
  console.log('fnDownloadPdf');
  html2canvas(document.querySelector('#list_print'), {
    backgroundColor: 'rgba(255,255,255,0)',
    onclone: function (doc) {
      console.log('html2canvas onclone function');
    }
  }).then((canvas) => {
    let pdf = new jsPDF('p', 'mm', 'a4'); //A4紙，縱向
    let ctx = canvas.getContext('2d');
    let a4w = 190;
    let a4h = 257; //A4大小，210mm x 297mm，左右保留10mm，上下保留20mm的邊距，顯示區域190x257
    let imgHeight = Math.floor((a4h * 777) / a4w); //按A4顯示比例換算一頁圖像的像素高度(小版寬度777=767+10)
    let renderedHeight = 0;
    ctx.fillStyle = '#FFFFFF';

    while (renderedHeight < canvas.height) {
      let page = document.createElement('canvas');
      page.width = canvas.width;
      if (canvas.width < 767) {
        page.width = 767;
      } //小版不縮放，以避免失真
      page.height = imgHeight;
      page.fillStyle = '#FFFFFF';
      //用getImageData剪裁指定區域，畫面到前面創建的canvas對象中
      page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, imgHeight), 0, 0);

      //添加圖像到頁面，保留10mm/20mm邊距
      pdf.addImage(
        page.toDataURL(canvas, '#ffffff', {
          type: 'image/jpeg',
          encoderOptions: 1.0
        }),
        'JPEG',
        10,
        20,
        a4w,
        Math.min(a4h, (a4w * page.height) / page.width)
      );

      //添加頁首的LOGO
      // let logo = new Image();
      // logo.src = require('@/assets/images/publicImages/logo_black.svg');
      // pdf.addImage(logo, 'SVG', 5, 3);

      //添加頁腳，位置和內容自己決定
      pdf.text('Goodwill', 110, 288);

      renderedHeight += imgHeight;
      if (renderedHeight < canvas.height) {
        pdf.addPage();
      } //如果後面還有內容，添加一個空頁
    }
    pdf.save('goodwill.pdf');
  });
};
</script>

<style lang="sass" scoped></style>
