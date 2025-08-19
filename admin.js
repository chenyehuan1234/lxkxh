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
            localStorage.removeItem('contactMessages');
            loadMessages();
        }
    });
    
    // 移动端菜单切换
    document.querySelector('.mobile-menu').addEventListener('click', function() {
        document.querySelector('nav ul').classList.toggle('show');
    });
});

// 加载并显示消息数据
function loadMessages() {
    const messagesTableBody = document.getElementById('messagesTableBody');
    
    // 从localStorage获取数据
    let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    
    // 清空表格内容
    messagesTableBody.innerHTML = '';
    
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
