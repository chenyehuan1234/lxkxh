// GitHub配置
const GITHUB_TOKEN = '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';
const GITHUB_USERNAME = 'chenyehuan1234';
const GITHUB_REPO = 'lxkxh';
const DATA_FILE = 'messages.json';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 加载并显示消息数据
    loadMessages();
    
    // 刷新按钮事件
    document.getElementById('refreshBtn').addEventListener('click', function() {
        loadMessages();
    });
    
    // 清空数据按钮事件
    document.getElementById('clearBtn').addEventListener('click', function() {
        if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
            clearMessages();
        }
    });
    
    // 移动端菜单切换
    document.querySelector('.mobile-menu').addEventListener('click', function() {
        document.querySelector('nav ul').classList.toggle('show');
    });
});

// 加载并显示消息数据
async function loadMessages() {
    const messagesTableBody = document.getElementById('messagesTableBody');
    
    try {
        // 从GitHub获取数据
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${DATA_FILE}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        // 清空表格内容
        messagesTableBody.innerHTML = '';
        
        if (!response.ok) {
            // 如果文件不存在或其他错误，显示提示信息
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="4" class="no-messages">暂无数据</td>';
            messagesTableBody.appendChild(row);
            return;
        }
        
        const data = await response.json();
        // 解码Base64内容
        const content = atob(data.content);
        let messages = JSON.parse(content);
        
        // 如果没有数据，显示提示信息
        if (messages.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="4" class="no-messages">暂无数据</td>';
            messagesTableBody.appendChild(row);
            return;
        }
        
        // 反向排序，最新的消息显示在最上面
        messages.reverse();
        
        // 添加数据到表格
        messages.forEach(message => {
            const row = document.createElement('tr');
            
            // 格式化时间
            const timestamp = new Date(message.timestamp);
            const formattedTime = timestamp.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            row.innerHTML = `
                <td>${escapeHtml(message.name)}</td>
                <td>${escapeHtml(message.phone)}</td>
                <td class="message-content">${escapeHtml(message.message)}</td>
                <td class="timestamp">${formattedTime}</td>
            `;
            
            messagesTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading messages:', error);
        // 显示错误信息
        messagesTableBody.innerHTML = '<tr><td colspan="4" class="no-messages">数据加载失败</td></tr>';
    }
}

// 转义HTML特殊字符，防止XSS攻击
function escapeHtml(text) {
    const map = {
        '&': '&',
        '<': '<',
        '>': '>',
        '"': '"',
        "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// 清空消息数据
async function clearMessages() {
    try {
        // 首先获取当前文件的SHA值
        const currentContentResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${DATA_FILE}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        let sha = null;
        if (currentContentResponse.ok) {
            const currentContentData = await currentContentResponse.json();
            sha = currentContentData.sha;
        }
        
        // 准备空数组内容
        const emptyContent = JSON.stringify([], null, 2);
        const encodedContent = btoa(unescape(encodeURIComponent(emptyContent)));
        
        // 更新文件内容为空数组
        const updateResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${DATA_FILE}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Clear all messages',
                content: encodedContent,
                sha: sha  // 如果是更新现有文件，需要提供sha
            })
        });
        
        if (updateResponse.ok) {
            // 重新加载数据以刷新显示
            loadMessages();
            alert('数据已清空');
        } else {
            const errorData = await updateResponse.json();
            console.error('GitHub API Error:', errorData);
            alert('清空数据失败，请稍后重试。');
        }
    } catch (error) {
        console.error('Error clearing messages:', error);
        alert('清空数据过程中出现错误，请检查网络连接后重试。');
    }
}
