// 字体大小调整功能
let currentFontSize = 100; // 基础字体大小百分比
const minFontSize = 80; // 最小字体大小百分比
const maxFontSize = 150; // 最大字体大小百分比
const step = 10; // 每次调整的步长

// 调整字体大小的函数
function changeFontSize(sizeChange) {
    // 更新当前字体大小
    currentFontSize += sizeChange;
    
    // 限制字体大小范围
    if (currentFontSize < minFontSize) currentFontSize = minFontSize;
    if (currentFontSize > maxFontSize) currentFontSize = maxFontSize;
    
    // 应用字体大小到body和指定元素
    document.body.style.fontSize = currentFontSize + '%';
    
    // 为了保持布局稳定，需要调整一些关键元素
    adjustLayout();
    
    // 保存当前字体大小设置到localStorage，方便用户下次访问时保持设置
    localStorage.setItem('fontSize', currentFontSize.toString());
}

// 调整布局以保持页面美观
function adjustLayout() {
    // 调整标题大小
    const titleElements = document.querySelectorAll('#title, #ti');
    titleElements.forEach(element => {
        element.style.fontSize = (parseInt(element.style.fontSize || getComputedStyle(element).fontSize) * currentFontSize / 100) + 'px';
    });
    
    // 调整导航链接大小
    const navLinks = document.querySelectorAll('li a');
    navLinks.forEach(link => {
        link.style.fontSize = (parseInt(link.style.fontSize || getComputedStyle(link).fontSize) * currentFontSize / 100) + 'px';
    });
    
    // 调整中间内容大小
    const midElements = document.querySelectorAll('.mid');
    midElements.forEach(element => {
        element.style.fontSize = (parseInt(element.style.fontSize || getComputedStyle(element).fontSize) * currentFontSize / 100) + 'px';
    });
    
    // 调整底部文本大小
    const bottomTexts = document.querySelectorAll('#bottom p');
    bottomTexts.forEach(text => {
        text.style.fontSize = (parseInt(text.style.fontSize || getComputedStyle(text).fontSize) * currentFontSize / 100) + 'px';
    });
}

// 页面加载时恢复用户之前的字体大小设置
function initFontSize() {
    const savedSize = localStorage.getItem('fontSize');
    if (savedSize) {
        currentFontSize = parseInt(savedSize);
        document.body.style.fontSize = currentFontSize + '%';
        adjustLayout();
    }
}

// 暴露方法供HTML页面使用
window.changeFontSize = changeFontSize;
window.initFontSize = initFontSize;