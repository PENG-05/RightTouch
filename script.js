// 游戏配置
const config = {
    // 图片路径，使用image/1.png格式
    images: [
        'image/1.png',
        'image/2.png',
        'image/3.png',
        'image/4.png',
        'image/5.png',
        'image/6.png',
        'image/7.png',
        'image/8.png',
				'image/9.png',
				'image/10.png',
				'image/11.png',
				'image/12.png',
				'image/13.png',
				'image/14.png',
				'image/15.png',
				'image/16.png',
				'image/17.png',
				'image/18.png',
				'image/19.png',
				'image/20.png',
				'image/21.png',
				'image/22.png',
				'image/23.png',
				'image/24.png',
				'image/25.png',
    ],
    backgroundImage: 'bg.png',
    currentLayout: '2x3',
    selectedCard: null,
    autoSave: true,
    lastSaved: null
};

// 添加本地存储功能
const storage = {
    save: function(data) {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem('cardGameState', serializedData);
            return true;
        } catch (error) {
            console.error('保存状态失败:', error);
            return false;
        }
    },
    
    load: function() {
        try {
            const serializedData = localStorage.getItem('cardGameState');
            if (!serializedData) return null;
            return JSON.parse(serializedData);
        } catch (error) {
            console.error('加载状态失败:', error);
            return null;
        }
    }
};

// DOM元素
const gameBoard = document.getElementById('game-board');
const modal = document.getElementById('image-modal');
const modalImageGrid = document.getElementById('modal-image-grid');

// 布局配置
const layouts = {
    '2x3': { rows: 2, cols: 3 }, // 2行3列，共6张卡片
    '3x3': { rows: 3, cols: 3 }, // 3行3列，共9张卡片
    '3x4': { rows: 3, cols: 4 }, // 3行4列，共12张卡片
    '4x4': { rows: 4, cols: 4 },  // 4行4列，共16张卡片
    '4x5': { rows: 4, cols: 5 }   // 4行5列，共20张卡片
};

// 添加全局状态变量
let resetModeActive = false;

// 添加防止滚动触发重置的逻辑

// 添加一个标志变量跟踪游戏初始化状态
let gameInitialized = false;
let lastScrollPosition = 0;
let scrollTimeout;

// 确保卡片状态在滚动时不会丢失
document.addEventListener('scroll', function(e) {
    clearTimeout(scrollTimeout);
    
    // 使用定时器延迟处理，减少滚动事件频繁触发
    scrollTimeout = setTimeout(function() {
        lastScrollPosition = window.scrollY;
    }, 100);
});

// 修改初始化函数，避免重复初始化
function initializeGame(rows, cols, force = false) {
    if (gameInitialized && !force) {
        return; // 避免重复初始化
    }
    
    // 保存当前卡片状态
    let savedCardStates = [];
    if (gameInitialized) {
        document.querySelectorAll('.card').forEach(card => {
            savedCardStates.push({
                index: card.dataset.index,
                backgroundImage: card.style.backgroundImage,
                flipped: card.classList.contains('flipped'),
                imageSelected: card.getAttribute('data-image-selected')
            });
        });
    }
    
    // ...现有的初始化代码...
    
    // 如果有保存的状态，恢复它们
    if (savedCardStates.length > 0) {
        document.querySelectorAll('.card').forEach(card => {
            const savedState = savedCardStates.find(state => state.index === card.dataset.index);
            if (savedState) {
                card.style.backgroundImage = savedState.backgroundImage;
                if (savedState.flipped) card.classList.add('flipped');
                if (savedState.imageSelected) card.setAttribute('data-image-selected', savedState.imageSelected);
            }
        });
    }
    
    gameInitialized = true;
}

// 初始化游戏
function initGame() {
    // 检测设备类型，为移动设备添加特殊类
    if (isMobileDevice()) {
        document.body.classList.add('mobile-device');
    }
    
    // 设置初始布局
    setLayout(config.currentLayout);
    
    // 创建模态框中的图片选择区域
    createImageSelectionGrid();
    
    // 添加布局按钮事件
    document.getElementById('layout-2x3').addEventListener('click', () => setLayout('2x3'));
    document.getElementById('layout-3x3').addEventListener('click', () => setLayout('3x3'));
    document.getElementById('layout-3x4').addEventListener('click', () => setLayout('3x4'));
    document.getElementById('layout-4x4').addEventListener('click', () => setLayout('4x4'));
    document.getElementById('layout-4x5').addEventListener('click', () => setLayout('4x5'));
    
    // 添加重置按钮事件
    document.getElementById('reset-all').addEventListener('click', resetAllCards);
    document.getElementById('reset-selected').addEventListener('click', resetSelectedCard);
    
    // 完全重写关闭按钮事件绑定
    document.querySelector('.close-modal').onclick = function() {
        closeModal();
        return false;
    };
    
    // 直接使用事件委托处理模态框点击事件
    modal.addEventListener('click', (event) => {
        // 如果点击的是模态框本身或关闭按钮，则关闭模态框
        if (event.target === modal || event.target.classList.contains('close-modal')) {
            closeModal();
        }
    });

    // 添加窗口调整大小的处理，以适应布局变化
    window.addEventListener('resize', handleResize);

    // 为重置选中图片按钮添加事件监听
    document.getElementById('reset-selected').addEventListener('click', function() {
        resetModeActive = true;
        alert('请点击要重置的图片');
    });

    // 添加恢复按钮事件监听
    document.getElementById('restore-state').addEventListener('click', restoreGameState);
    
    // 尝试从本地存储加载游戏状态
    const savedState = storage.load();
    if (savedState) {
        // 如果有保存的状态，则使用该布局
        config.currentLayout = savedState.layout;
    }
    
    // 设置初始布局
    setLayout(config.currentLayout);
    
    // 如果有保存的状态，延迟一点时间后恢复它
    if (savedState) {
        setTimeout(() => {
            restoreGameState();
        }, 300);
    }
}

// 检测是否为移动设备
function isMobileDevice() {
    return (window.innerWidth <= 768) || 
           ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0);
}

// 处理窗口大小调整
function handleResize() {
    // 重新应用当前布局，以适应新的窗口大小
    setLayout(config.currentLayout);
}

// 设置游戏布局
function setLayout(layoutType) {
    config.currentLayout = layoutType;
    const { rows, cols } = layouts[layoutType];
    
    // 清空游戏面板
    gameBoard.innerHTML = '';
    
    // 设置布局类
    gameBoard.className = `game-board layout-${layoutType}`;
    
    // 为4x4布局添加特殊样式
    if (layoutType === '4x4') {
        gameBoard.style.display = 'grid';
        gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        gameBoard.style.gridTemplateRows = 'repeat(4, 1fr)';
    } else if (layoutType === '4x5') {
        gameBoard.style.display = 'grid';
        gameBoard.style.gridTemplateColumns = 'repeat(5, 1fr)';
        gameBoard.style.gridTemplateRows = 'repeat(4, 1fr)';
    } else {
        gameBoard.style.display = 'flex';
        gameBoard.style.gridTemplateColumns = '';
        gameBoard.style.gridTemplateRows = '';
    }
    
    // 创建卡片
    for (let i = 0; i < rows * cols; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = i;
        
        const img = document.createElement('img');
        img.src = config.backgroundImage;
        img.alt = 'Card';
        
        card.appendChild(img);
        card.addEventListener('click', handleCardClick);
        gameBoard.appendChild(card);
    }

    // 为移动设备调整卡片大小
    if (isMobileDevice()) {
        adjustCardSizeForMobile(layoutType);
    }
}

// 为移动设备调整卡片大小
function adjustCardSizeForMobile(layoutType) {
    const cards = document.querySelectorAll('.card');
    const isSmallerScreen = window.innerWidth <= 480;
    
    cards.forEach(card => {
        if (layoutType === '4x4') {
            // 4x4布局在小屏幕上需要更小的卡片
            card.style.width = isSmallerScreen ? '65px' : '75px';
            card.style.height = isSmallerScreen ? '85px' : '100px';
        } else if (layoutType === '3x4') {
            card.style.width = isSmallerScreen ? '70px' : '85px';
            card.style.height = isSmallerScreen ? '90px' : '110px';
        }
    });
}

// 处理卡片点击事件
function handleCardClick(event) {
    const card = event.currentTarget;
    
    if (resetModeActive) {
        // 重置模式：直接将卡片重置为背景图片
        card.querySelector('img').src = config.backgroundImage;
        card.classList.remove('selected');
        resetModeActive = false; // 重置完成后关闭重置模式
    } else {
        // 取消之前的选中状态
        const previousSelectedCard = document.querySelector('.card.selected');
        if (previousSelectedCard) {
            previousSelectedCard.classList.remove('selected');
        }
        
        // 设置当前卡片为选中状态
        card.classList.add('selected');
        config.selectedCard = card;
        
        // 显示模态框
        openModal();
    }

    // 在函数末尾添加自动保存
    setTimeout(saveGameState, 100); // 延迟一点以确保UI更新完成
}

// 创建图片选择网格（在模态框中）
function createImageSelectionGrid() {
    modalImageGrid.innerHTML = '';
    
    config.images.forEach((imgSrc, index) => {
        const imgOption = document.createElement('div');
        imgOption.className = 'image-option';
        imgOption.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `选项 ${index + 1}`;
        img.loading = 'lazy'; // 添加延迟加载
        
        imgOption.appendChild(img);
        imgOption.addEventListener('click', () => {
            changeCardImage(imgSrc);
            closeModal();
        });
        modalImageGrid.appendChild(imgOption);
    });
}

// 打开模态框
function openModal() {
    document.body.style.overflow = 'hidden'; // 阻止背景滚动
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

// 关闭模态框 - 简化此函数以确保一定会关闭
function closeModal() {
    console.log('正在关闭模态框');
    // 立即隐藏
    modal.style.display = 'none';
    document.body.style.overflow = ''; // 恢复背景滚动
    
    // 如果关闭模态框时没有选择图片，则移除选中状态
    if (config.selectedCard) {
        config.selectedCard.classList.remove('selected');
        config.selectedCard = null;
    }
}

// 更改卡片图片
function changeCardImage(imageSrc) {
    if (config.selectedCard) {
        const img = config.selectedCard.querySelector('img');
        img.src = imageSrc;
        
        // 移除选中状态
        config.selectedCard.classList.remove('selected');
        config.selectedCard = null;
        
        // 添加自动保存
        saveGameState();
    }
}

// 全部重置
function resetAllCards() {
    const cards = document.querySelectorAll('.card img');
    cards.forEach(img => {
        img.src = config.backgroundImage;
    });
    
    // 移除选中状态
    const selectedCard = document.querySelector('.card.selected');
    if (selectedCard) {
        selectedCard.classList.remove('selected');
        config.selectedCard = null;
    }
    resetModeActive = false; // 确保退出重置模式
    
    // 添加自动保存
    saveGameState();
}

// 重置选中的卡片
function resetSelectedCard() {
    if (config.selectedCard) {
        const img = config.selectedCard.querySelector('img');
        img.src = config.backgroundImage;
        
        // 移除选中状态
        config.selectedCard.classList.remove('selected');
        config.selectedCard = null;
    }

    // 在函数末尾添加自动保存
    saveGameState();
}

// 添加触摸事件处理，防止滑动误触发
document.addEventListener('DOMContentLoaded', function() {
    // ...现有代码...
    
    // 捕获触摸事件，防止误触发
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        const touchY = e.touches[0].clientY;
        const touchDiff = Math.abs(touchY - touchStartY);
        
        // 如果是垂直滑动(大于15px)，暂时禁用卡片点击
        if (touchDiff > 15) {
            document.querySelectorAll('.card').forEach(card => {
                card.style.pointerEvents = 'none';
            });
            
            // 一段时间后恢复点击
            clearTimeout(window.reEnablePointerTimeout);
            window.reEnablePointerTimeout = setTimeout(() => {
                document.querySelectorAll('.card').forEach(card => {
                    card.style.pointerEvents = 'auto';
                });
            }, 500);
        }
    }, { passive: true });
});

// 自动保存当前游戏状态
function saveGameState() {
    if (!config.autoSave) return;
    
    const cards = document.querySelectorAll('.card');
    const gameState = {
        layout: config.currentLayout,
        cards: [],
        timestamp: new Date().toISOString()
    };
    
    cards.forEach(card => {
        const img = card.querySelector('img');
        gameState.cards.push({
            index: card.dataset.index,
            src: img.src,
            selected: card.classList.contains('selected')
        });
    });
    
    const saved = storage.save(gameState);
    if (saved) {
        config.lastSaved = new Date();
        showSaveStatus('已自动保存');
    }
}

// 显示保存状态提示
function showSaveStatus(message) {
    const statusElement = document.getElementById('save-status');
    statusElement.textContent = message;
    statusElement.classList.add('show');
    
    setTimeout(() => {
        statusElement.classList.remove('show');
    }, 2000);
}

// 恢复上一次保存的游戏状态
function restoreGameState() {
    const gameState = storage.load();
    if (!gameState) {
        alert('没有找到保存的游戏状态');
        return;
    }
    
    // 首先设置正确的布局
    setLayout(gameState.layout);
    
    // 延迟一点时间以确保布局已经渲染
    setTimeout(() => {
        // 恢复每个卡片的状态
        gameState.cards.forEach(savedCard => {
            const card = document.querySelector(`.card[data-index="${savedCard.index}"]`);
            if (card) {
                const img = card.querySelector('img');
                img.src = savedCard.src;
                
                if (savedCard.selected) {
                    card.classList.add('selected');
                    config.selectedCard = card;
                }
            }
        });
        
        showSaveStatus('状态已恢复');
    }, 100);
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', initGame);
