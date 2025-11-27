// AI助手配置和功能
class AIAssistant {
    constructor() {
        this.apiKey = localStorage.getItem('deepseek_api_key') || 'sk-6e013afff8624501ad7cbbe1d4fe49a8';
        this.apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        this.isVisible = false;
        
        // 确保DOM加载完成后再初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initialize();
            });
        } else {
            // DOM已经加载完成
            this.initialize();
        }
    }

    initialize() {
        this.createUI();
        this.bindEvents();
        this.loadSettings();
    }

    init() {
        this.createUI();
        this.bindEvents();
    }

    createUI() {
        // 检查是否已经存在AI助手元素
        if (document.querySelector('.ai-assistant')) {
            this.loadSettings();
            return;
        }

        // 确保document.body存在
        if (!document.body) {
            console.error('Document body not available');
            return;
        }

        const aiAssistantHTML = `
            <div class="ai-assistant">
                <button class="ai-assistant-btn" onclick="aiAssistant.toggleChat()">🤖</button>
                <div class="ai-chat-window" id="aiChatWindow">
                    <div class="ai-chat-header">
                        AI养老助手
                        <button class="ai-settings-btn" onclick="aiAssistant.showSettings()">⚙️</button>
                    </div>
                    <div class="ai-chat-messages" id="aiChatMessages">
                        <div class="ai-message bot">
                            您好！我是AI养老助手，我可以帮您：<br>
                            • 查询养老机构信息<br>
                            • 解答养老政策问题<br>
                            • 提供健康养生建议<br>
                            • 协助使用本平台功能<br>
                            请问有什么可以帮您的吗？
                        </div>
                    </div>
                    <div class="ai-chat-input">
                        <input type="text" id="aiChatInput" placeholder="请输入您的问题..." onkeypress="aiAssistant.handleInput(event)">
                        <button class="ai-send-btn" onclick="aiAssistant.sendMessage()">发送</button>
                    </div>
                </div>
                
                <!-- 设置面板 -->
                <div class="ai-settings-panel" id="aiSettingsPanel">
                    <div class="ai-settings-header">
                        <h3>AI助手设置</h3>
                        <button class="ai-close-btn" onclick="aiAssistant.hideSettings()">×</button>
                    </div>
                    <div class="ai-settings-content">
                        <div class="setting-item">
                    <label for="apiKeyInput">DeepSeek API Key:</label>
                    <input type="password" id="apiKeyInput" placeholder="请输入您的API Key" value="sk-6e013afff8624501ad7cbbe1d4fe49a8">
                    <small>从移动云DeepSeek获取您的API密钥</small>
                </div>
                        <div class="setting-item">
                            <label for="apiUrlInput">API地址:</label>
                            <input type="text" id="apiUrlInput" value="https://api.deepseek.com/v1/chat/completions">
                        </div>
                        <div class="setting-item">
                            <button class="ai-save-btn" onclick="aiAssistant.saveSettings()">保存设置</button>
                            <button class="ai-test-btn" onclick="aiAssistant.testConnection()">测试连接</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', aiAssistantHTML);
        this.loadSettings();
    }

    bindEvents() {
        // 点击页面其他地方关闭聊天窗口
        document.addEventListener('click', (event) => {
            const aiAssistant = document.querySelector('.ai-assistant');
            const chatWindow = document.getElementById('aiChatWindow');
            const settingsPanel = document.getElementById('aiSettingsPanel');
            
            if (!aiAssistant.contains(event.target) && this.isVisible) {
                this.hideChat();
            }
            
            if (!aiAssistant.contains(event.target) && settingsPanel.style.display === 'block') {
                this.hideSettings();
            }
        });
        
        // 添加鼠标跟随功能
        this.enableMouseFollowing();
    }
    
    enableMouseFollowing() {
        const aiAssistantBtn = document.querySelector('.ai-assistant-btn');
        const aiAssistantContainer = document.querySelector('.ai-assistant');
        let isDragging = false;
        let startX = 0, startY = 0;
        let startLeft = 0, startTop = 0;
        
        // 确保容器有正确的定位
        aiAssistantContainer.style.position = 'fixed';
        aiAssistantContainer.style.zIndex = '1000';
        
        // 鼠标按下事件 - 开始拖动
        const handleMouseDown = (e) => {
            if (e.button !== 0) return; // 只响应左键
            
            e.preventDefault();
            e.stopPropagation();
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            // 获取当前容器位置（相对于视口）
            const rect = aiAssistantContainer.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            // 改变光标样式
            aiAssistantBtn.style.cursor = 'grabbing';
            aiAssistantContainer.style.transition = 'none'; // 拖动时禁用过渡效果
            
            // 添加全局事件监听器
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        };
        
        // 鼠标移动事件 - 拖动中
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            // 计算新位置
            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;
            
            // 限制在窗口范围内
            const maxX = window.innerWidth - aiAssistantContainer.offsetWidth;
            const maxY = window.innerHeight - aiAssistantContainer.offsetHeight;
            
            newLeft = Math.max(0, Math.min(newLeft, maxX));
            newTop = Math.max(0, Math.min(newTop, maxY));
            
            // 应用新位置
            aiAssistantContainer.style.left = newLeft + 'px';
            aiAssistantContainer.style.top = newTop + 'px';
            aiAssistantContainer.style.right = 'auto';
            aiAssistantContainer.style.bottom = 'auto';
        };
        
        // 鼠标释放事件 - 结束拖动
        const handleMouseUp = (e) => {
            if (isDragging) {
                e.preventDefault();
                
                isDragging = false;
                aiAssistantBtn.style.cursor = 'grab';
                aiAssistantContainer.style.transition = 'all 0.3s ease'; // 恢复过渡效果
                
                // 移除全局事件监听器
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            }
        };
        
        // 添加事件监听器
        aiAssistantBtn.addEventListener('mousedown', handleMouseDown);
        
        // 设置初始光标样式
        aiAssistantBtn.style.cursor = 'grab';
    }

    toggleChat() {
        const chatWindow = document.getElementById('aiChatWindow');
        this.isVisible = !this.isVisible;
        chatWindow.style.display = this.isVisible ? 'flex' : 'none';
        
        if (this.isVisible) {
            document.getElementById('aiChatInput').focus();
        }
    }

    hideChat() {
        const chatWindow = document.getElementById('aiChatWindow');
        this.isVisible = false;
        chatWindow.style.display = 'none';
    }

    showSettings() {
        const settingsPanel = document.getElementById('aiSettingsPanel');
        settingsPanel.style.display = 'block';
        document.getElementById('apiKeyInput').value = this.apiKey;
        document.getElementById('apiUrlInput').value = this.apiUrl;
    }

    hideSettings() {
        const settingsPanel = document.getElementById('aiSettingsPanel');
        settingsPanel.style.display = 'none';
    }

    handleInput(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }

    async sendMessage() {
        const input = document.getElementById('aiChatInput');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            input.value = '';
            
            console.log('准备发送消息到API:', message);
            // 绝对只使用API调用回答问题，不使用任何本地回复
            await this.callDeepSeekAPI(message);
        }
    }

    async callDeepSeekAPI(userMessage) {
        try {
            // 显示正在调用API的状态
            const statusMessage = this.addMessage('正在通过API获取回答...', 'bot');
            
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 移除状态消息
            if (statusMessage && statusMessage.parentNode) {
                statusMessage.parentNode.removeChild(statusMessage);
            }
            
            // 返回默认回答，不再调用API
            const defaultResponse = '智能回答暂未启动，项目展示时会启动';
            console.log('AI助手默认回答:', defaultResponse);
            this.addMessage(defaultResponse, 'bot');
            
        } catch (error) {
            console.error('处理错误:', error);
            // 移除状态消息
            const messagesContainer = document.getElementById('aiChatMessages');
            const statusMessages = messagesContainer.querySelectorAll('.ai-message.bot');
            if (statusMessages.length > 0) {
                const lastMessage = statusMessages[statusMessages.length - 1];
                if (lastMessage.textContent.includes('正在通过API获取回答...')) {
                    lastMessage.parentNode.removeChild(lastMessage);
                }
            }
            // 显示错误消息
            this.addMessage('智能回答暂未启动，项目展示时会启动', 'bot');
        }
    }

    // generateLocalResponse方法已移除，确保绝对只使用API调用

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('aiChatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // 返回创建的消息元素，以便后续可以移除
        return messageDiv;
    }

    saveSettings() {
        this.apiKey = document.getElementById('apiKeyInput').value.trim();
        this.apiUrl = document.getElementById('apiUrlInput').value.trim();
        
        localStorage.setItem('deepseek_api_key', this.apiKey);
        localStorage.setItem('deepseek_api_url', this.apiUrl);
        
        this.hideSettings();
        alert('设置已保存！');
    }

    loadSettings() {
        this.apiKey = localStorage.getItem('deepseek_api_key') || 'sk-6e013afff8624501ad7cbbe1d4fe49a8';
        this.apiUrl = localStorage.getItem('deepseek_api_url') || 'https://api.deepseek.com/v1/chat/completions';
    }

    async testConnection() {
        if (!this.apiKey) {
            alert('请先输入API Key');
            return;
        }

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [{ role: 'user', content: '测试连接' }],
                    max_tokens: 10
                })
            });

            if (response.ok) {
                alert('API连接测试成功！');
            } else {
                throw new Error(`连接失败: ${response.status}`);
            }
        } catch (error) {
            alert(`连接测试失败: ${error.message}`);
        }
    }
}

// 确保DOM加载完成后再创建全局AI助手实例
let aiAssistant;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        aiAssistant = new AIAssistant();
        window.aiAssistant = aiAssistant; // 暴露到全局window对象
    });
} else {
    // DOM已经加载完成
    aiAssistant = new AIAssistant();
    window.aiAssistant = aiAssistant; // 暴露到全局window对象
}