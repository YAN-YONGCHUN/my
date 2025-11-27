// 模式切换功能 - 老年人模式和正常模式
let currentMode = 'normal'; // 'normal' 或 'elderly'
const normalFontSize = 100; // 正常模式字体大小百分比
const elderlyFontSize = 160; // 老年人模式字体大小百分比（增大）

// 立即从localStorage读取保存的模式，避免页面加载时的闪烁
if (typeof localStorage !== 'undefined') {
    const savedMode = localStorage.getItem('userMode');
    if (savedMode && (savedMode === 'normal' || savedMode === 'elderly')) {
        currentMode = savedMode;
    }
}

// 防抖函数 - 减少频繁操作导致的性能问题
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 切换模式函数
function toggleMode() {
    // 切换当前模式
    currentMode = currentMode === 'normal' ? 'elderly' : 'normal';
    
    // 应用相应的字体大小和样式（使用防抖优化）
    debouncedApplyModeSettings();
    
    // 更新按钮显示文本
    updateModeButtonText();
    
    try {
        // 保存当前模式到localStorage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('userMode', currentMode);
        }
    } catch (e) {
        console.warn('无法保存模式设置到本地存储', e);
    }
}

// 应用模式设置 - 每次调用都重新查询DOM，确保针对当前页面元素
function applyModeSettings() {
    // 确保文档完全加载
    if (document.readyState !== 'complete') {
        setTimeout(applyModeSettings, 50);
        return;
    }
    
    const fontSize = currentMode === 'elderly' ? elderlyFontSize : normalFontSize;
    
    // 应用字体大小到body - 单一DOM操作
    document.body.style.fontSize = fontSize + '%';
    
    // 调整关键元素样式 - 每次都重新查询DOM，确保针对当前页面元素
    adjustElementsStyle(currentMode);
}

// 创建防抖版本的applyModeSettings，仅用于用户主动切换模式
const debouncedApplyModeSettings = debounce(applyModeSettings, 50);

// 调整元素样式
function adjustElementsStyle(mode) {
    // 每次调用都重新查询DOM，确保针对当前页面元素
    const elements = {
        textElements: document.querySelectorAll('p, a, li, button:not(.mode-switch-btn)'),
        headingElements: document.querySelectorAll('h1, h2, h3, h4, h5, h6'),
        actionButtons: document.querySelectorAll('button:not(.mode-switch-btn)'),
        navLinks: document.querySelectorAll('ul li a'), // 特别针对导航栏链接
        yanglaoyuanElements: document.querySelectorAll('.yanglaoyuan'), // 养老机构卡片
        renyuanElements: document.querySelectorAll('.renyuan'), // 居家养老服务人员卡片
        baikeElements: document.querySelectorAll('.baike'), // 百科知识卡片
        deviceCardElements: document.querySelectorAll('.device-card') // 智能设备卡片
    };
    
    // 预定义样式对象，减少重复字符串创建
    const elderlyTextStyles = {
        lineHeight: '1.6',
        letterSpacing: '0.5px',
        wordBreak: 'break-word',
        whiteSpace: 'normal'
    };
    
    const elderlyHeadingStyles = {
        fontWeight: 'bold',
        wordBreak: 'break-word',
        whiteSpace: 'normal'
    };
    
    const elderlyButtonStyles = {
        padding: '10px 20px',
        fontSize: '18px',
        backgroundColor: '#d9534f' // 更深的红色
    };
    
    // 导航栏链接特殊样式
    const elderlyNavLinkStyles = {
        fontSize: '24px', // 增大导航栏字体
        lineHeight: '50px'
    };
    
    // 养老机构卡片样式
    const elderlyYanglaoyuanStyles = {
        minHeight: '380px', // 增加最小高度以适应放大的内容
        width: '350px', // 增加宽度以适应放大的内容
        padding: '20px', // 增加内边距
        margin: '30px' // 调整外边距
    };
    
    // 居家养老服务人员卡片样式
    const elderlyRenyuanStyles = {
        minHeight: '380px', // 增加最小高度以适应放大的内容
        width: '350px', // 增加宽度以适应放大的内容
        padding: '20px', // 增加内边距
        margin: '30px' // 调整外边距
    };
    
    // 百科知识卡片样式
    const elderlyBaikeStyles = {
        minHeight: '120px', // 增加最小高度以适应放大的内容
        width: 'calc(100% - 100px)', // 调整宽度
        padding: '20px', // 增加内边距
        margin: '25px' // 调整外边距
    };
    
    // 智能设备卡片样式
    const elderlyDeviceCardStyles = {
        minHeight: '450px', // 增加最小高度以适应放大的内容
        padding: '25px', // 增加内边距
        margin: '20px auto', // 调整外边距
        width: 'calc(100% - 60px)' // 调整宽度，确保在小屏幕上也能完整显示
    };
    
    // 使用DocumentFragment批量处理DOM更新，减少重排
    if (mode === 'elderly') {
        // 老年人模式：仅放大字体，不改变布局
        applyStylesToElements(elements.textElements, elderlyTextStyles);
        applyStylesToElements(elements.headingElements, elderlyHeadingStyles);
        applyStylesToElements(elements.actionButtons, elderlyButtonStyles);
        applyStylesToElements(elements.navLinks, elderlyNavLinkStyles); // 应用导航栏链接样式
        applyStylesToElements(elements.yanglaoyuanElements, elderlyYanglaoyuanStyles); // 应用养老机构卡片样式
        applyStylesToElements(elements.renyuanElements, elderlyRenyuanStyles); // 应用居家养老服务人员卡片样式
        applyStylesToElements(elements.baikeElements, elderlyBaikeStyles); // 应用百科知识卡片样式
        applyStylesToElements(elements.deviceCardElements, elderlyDeviceCardStyles); // 应用智能设备卡片样式
        
    } else {
        // 正常模式：恢复默认样式
        resetStyles(elements.textElements, ['lineHeight', 'letterSpacing', 'wordBreak', 'whiteSpace']);
        resetStyles(elements.headingElements, ['fontWeight', 'wordBreak', 'whiteSpace']);
        resetStyles(elements.actionButtons, ['padding', 'fontSize', 'backgroundColor']);
        resetStyles(elements.navLinks, ['fontSize', 'lineHeight']); // 重置导航栏链接样式
        resetStyles(elements.yanglaoyuanElements, ['minHeight', 'width', 'padding', 'margin']); // 重置养老机构卡片样式
        resetStyles(elements.renyuanElements, ['minHeight', 'width', 'padding', 'margin']); // 重置居家养老服务人员卡片样式
        resetStyles(elements.baikeElements, ['minHeight', 'width', 'padding', 'margin']); // 重置百科知识卡片样式
        resetStyles(elements.deviceCardElements, ['minHeight', 'width', 'padding', 'margin']); // 重置智能设备卡片样式
    }
}

// 批量应用样式函数
function applyStylesToElements(elements, styles) {
    // 检查elements是否有效
    if (!elements || elements.length === 0) return;
    
    elements.forEach(element => {
        if (element && element.style) {
            Object.assign(element.style, styles);
        }
    });
}

// 重置样式函数
function resetStyles(elements, properties) {
    // 检查elements是否有效
    if (!elements || elements.length === 0) return;
    
    elements.forEach(element => {
        if (element && element.style) {
            properties.forEach(prop => {
                element.style[prop] = '';
            });
        }
    });
}

// 更新模式按钮文本
function updateModeButtonText() {
    try {
        const modeButton = document.querySelector('.mode-switch-btn');
        if (modeButton) {
            // 使用textContent而非innerHTML防止XSS
            modeButton.textContent = currentMode === 'elderly' ? '切换到正常模式' : '切换到老年人模式';
        }
    } catch (e) {
        console.warn('无法更新模式按钮文本', e);
    }
}

// 初始化模式
function initMode() {
    // 确保在文档加载完成后执行
    if (document.readyState !== 'complete') {
        document.addEventListener('DOMContentLoaded', doInitMode);
    } else {
        doInitMode();
    }
}

// 实际的初始化函数
function doInitMode() {
    try {
        // 应用模式设置 - 直接使用已经从localStorage读取的currentMode
        applyModeSettings();
        
        // 更新按钮文本
        updateModeButtonText();
    } catch (e) {
        console.error('初始化模式时出错:', e);
        // 发生错误时使用默认模式
        currentMode = 'normal';
        applyModeSettings();
    }
}

// 确保字符编码正确设置
function ensureProperEncoding() {
    const meta = document.querySelector('meta[charset]');
    if (meta) {
        meta.setAttribute('charset', 'UTF-8');
    } else {
        const newMeta = document.createElement('meta');
        newMeta.setAttribute('charset', 'UTF-8');
        document.head.insertBefore(newMeta, document.head.firstChild);
    }
}

// 页面加载时确保正确编码
ensureProperEncoding();

// 暴露方法供HTML页面使用
window.toggleMode = toggleMode;
window.initMode = initMode;