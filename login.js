document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已登录
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'card.html';
    }
    
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    
    // 创建今天日期的起始和2025年6月5日的结束
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const todayEnd = new Date(2025, 5, 5, 23, 59, 59); // 设置为2025年6月5日 23:59:59
    
    // 创建三个月后的日期
    const threeMonthsLater = new Date(today);
    threeMonthsLater.setMonth(today.getMonth() + 3);
    threeMonthsLater.setHours(23, 59, 59);
    
    // 创建6月8号的日期
    const june8End = new Date();
    june8End.setFullYear(2025);
    june8End.setMonth(5); // 月份是从0开始的，所以6月是5
    june8End.setDate(8);
    june8End.setHours(23, 59, 59);
    
    // 创建一个月后的日期
    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(today.getMonth() + 1);
    oneMonthLater.setHours(23, 59, 59);
    
    // 示例用户凭据 - 实际应用中应该从服务器验证
    const validCredentials = [
        { username: 'admin', password: '1746460398802' },
        { username: 'user', password: '爱喝喜茶' },
        { username: 'threeday', password: 'password123', 
          validFrom: new Date('2025-06-30'), 
          validTo: new Date('2025-07-04 23:59:59') },
        { username: 'today', password: 'dailypass', 
          validFrom: todayStart, 
          validTo: todayEnd },
        { username: 'quarter', password: 'season123', 
          validFrom: todayStart, 
          validTo: threeMonthsLater },
        { username: 'june8', password: 'summer123', 
          validFrom: todayStart, 
          validTo: june8End },
        { username: 'month', password: 'month123', 
          validFrom: todayStart, 
          validTo: oneMonthLater },
    ];
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const currentDate = new Date();
        
        // 验证用户凭据
        const user = validCredentials.find(cred => 
            cred.username === username && cred.password === password
        );
        
        if (user) {
            // 将日期转换为时间戳进行比较
            const currentTimestamp = currentDate.getTime();
          
            // 检查是否有日期限制
            if ((user.validFrom && currentTimestamp < user.validFrom.getTime()) || 
                (user.validTo && currentTimestamp > user.validTo.getTime())) {
                errorMessage.textContent = '此账号目前无法使用，请检查使用日期！';
                loginForm.reset();
                return;
            }
            
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
