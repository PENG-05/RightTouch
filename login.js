document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已登录
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'card.html';
    }
    
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    
    // 示例用户凭据 - 实际应用中应该从服务器验证
    const validCredentials = [
        { username: 'admin', password: '1746460398802' },
        { username: 'user', password: '爱喝喜茶' }
    ];
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // 验证用户凭据
        const isValid = validCredentials.some(cred => 
            cred.username === username && cred.password === password
        );
        
        if (isValid) {
            // 设置登录状态
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('loginTime', new Date().toString());
            
            // 重定向到主页
            window.location.href = 'card.html';
        } else {
            errorMessage.textContent = '用户名或密码错误，请重试！';
            loginForm.reset();
        }
    });
});
