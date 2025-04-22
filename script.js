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
    selectedCard: null
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
    '4x4': { rows: 4, cols: 4 }  // 4行4列，共16张卡片
};

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
    
    // 添加重置按钮事件
    document.getElementById('reset-all').addEventListener('click', resetAllCards);
    document.getElementById('reset-selected').addEventListener('click', resetSelectedCard);
    
    // 修复：确保正确获取关闭按钮并添加事件
    const closeButton = document.querySelector('.close-modal');
    if (closeButton) {
        closeButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            closeModal();
        });
        console.log('关闭按钮监听器已添加');
    } else {
        console.error('找不到关闭按钮元素');
    }
    
    // 点击模态框外部区域关闭模态框
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // 添加窗口调整大小的处理，以适应布局变化
    window.addEventListener('resize', handleResize);
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

// 关闭模态框
function closeModal() {
    console.log('关闭模态框函数被调用');
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // 恢复背景滚动
        
        // 如果关闭模态框时没有选择图片，则移除选中状态
        if (config.selectedCard) {
            config.selectedCard.classList.remove('selected');
            config.selectedCard = null;
        }
    }, 200);
}

// 更改卡片图片
function changeCardImage(imageSrc) {
    if (config.selectedCard) {
        const img = config.selectedCard.querySelector('img');
        img.src = imageSrc;
        
        // 移除选中状态
        config.selectedCard.classList.remove('selected');
        config.selectedCard = null;
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
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', initGame);
