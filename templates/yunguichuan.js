function renderYunguichuanTemplate(data) {
    const shopName = data['店铺名称'] || '云贵川风味';
    const slogan = data['Slogan（中）'] || '山水之间 · 自然之味';

    const generateCategoryHtml = (categoryName) => {
        const items = data['菜单'][categoryName];
        let categoryHtml = `
            <section class="menu-category">
                <div class="category-header">
                    <div class="bamboo-decoration left"></div>
                    <h2 class="category-title">${categoryName}</h2>
                    <div class="bamboo-decoration right"></div>
                </div>
                <div class="category-items">
        `;
        
        items.forEach(item => {
            categoryHtml += `
                <div class="menu-item">
                    <div class="item-header">
                        <h3 class="item-name">${item['菜品（中）']}</h3>
                        <div class="price-container">
                            <span class="price">${item['价格'] || '¥' + (Math.floor(Math.random() * 50) + 20)}</span>
                        </div>
                    </div>
                    <p class="item-description">${item['身份梗·哲学说明']}</p>
                    <div class="item-divider"></div>
                </div>
            `;
        });
        
        categoryHtml += `
                </div>
            </section>
        `;
        return categoryHtml;
    };

    let menuHtml = '';
    for (const category in data['菜单']) {
        menuHtml += generateCategoryHtml(category);
    }

    return `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <title>云贵川风味菜单</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @import url('https://fonts.loli.net/css2?family=Noto+Serif+SC:wght@400;500;700;900&family=Ma+Shan+Zheng&display=swap');

                body.yunguichuan-template {
                    font-family: 'Noto Serif SC', serif;
                    background: linear-gradient(135deg, #1a2e1a 0%, #0d1f0d 50%, #0a1a0a 100%);
                    color: #c8d6c8;
                    min-height: 100vh;
                    position: relative;
                }

                .yunguichuan-template::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image: 
                        radial-gradient(circle at 20% 20%, rgba(34, 60, 34, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(20, 40, 20, 0.4) 0%, transparent 50%),
                        radial-gradient(circle at 40% 60%, rgba(45, 70, 45, 0.2) 0%, transparent 50%),
                        radial-gradient(circle at 60% 20%, rgba(25, 35, 25, 0.3) 0%, transparent 40%),
                        linear-gradient(45deg, transparent 30%, rgba(15, 25, 15, 0.1) 50%, transparent 70%),
                        repeating-linear-gradient(90deg, transparent, transparent 100px, rgba(30, 50, 30, 0.05) 101px, rgba(30, 50, 30, 0.05) 102px);
                    pointer-events: none;
                    z-index: -1;
                }

                .yunguichuan-template::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        radial-gradient(2px 2px at 20px 30px, rgba(127, 176, 105, 0.1), transparent),
                        radial-gradient(2px 2px at 40px 70px, rgba(127, 176, 105, 0.08), transparent),
                        radial-gradient(1px 1px at 90px 40px, rgba(212, 175, 55, 0.1), transparent),
                        radial-gradient(1px 1px at 130px 80px, rgba(212, 175, 55, 0.08), transparent);
                    background-repeat: repeat;
                    background-size: 150px 100px;
                    pointer-events: none;
                    z-index: -1;
                    opacity: 0.3;
                }

                .main-container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 2rem;
                    position: relative;
                }

                .header-section {
                    text-align: center;
                    margin-bottom: 3rem;
                    position: relative;
                }

                .header-decoration {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .cloud-pattern {
                    width: 60px;
                    height: 30px;
                    background: linear-gradient(45deg, #2d5a2d, #3d6b3d);
                    border-radius: 50px;
                    position: relative;
                    margin: 0 1rem;
                    box-shadow: 0 0 15px rgba(45, 90, 45, 0.4);
                }

                .cloud-pattern::before,
                .cloud-pattern::after {
                    content: '';
                    position: absolute;
                    background: linear-gradient(45deg, #2d5a2d, #3d6b3d);
                    border-radius: 50%;
                    box-shadow: 0 0 10px rgba(45, 90, 45, 0.3);
                }

                .cloud-pattern::before {
                    width: 25px;
                    height: 25px;
                    top: -10px;
                    left: 10px;
                }

                .cloud-pattern::after {
                    width: 30px;
                    height: 30px;
                    top: -15px;
                    right: 10px;
                }

                .main-title {
                    font-family: 'Ma Shan Zheng', cursive;
                    font-size: 3.5rem;
                    font-weight: 900;
                    color: #7fb069;
                    text-shadow: 2px 2px 8px rgba(0,0,0,0.6), 0 0 20px rgba(127, 176, 105, 0.3);
                    margin: 1rem 0;
                    letter-spacing: 0.2rem;
                }

                .slogan {
                    font-size: 1.1rem;
                    color: #a8c090;
                    font-weight: 500;
                    letter-spacing: 0.3rem;
                    position: relative;
                    text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
                }

                .slogan::before,
                .slogan::after {
                    content: '◆';
                    color: #d4af37;
                    margin: 0 1rem;
                    font-size: 0.8rem;
                    text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
                }

                .menu-category {
                    margin-bottom: 3rem;
                    background: rgba(20, 35, 20, 0.8);
                    border-radius: 20px;
                    padding: 2rem;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(127, 176, 105, 0.1);
                    backdrop-filter: blur(10px);
                    border: 2px solid rgba(45, 90, 45, 0.4);
                }

                .category-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 2rem;
                    position: relative;
                }

                .category-title {
                    font-family: 'Ma Shan Zheng', cursive;
                    font-size: 2.2rem;
                    color: #7fb069;
                    margin: 0 2rem;
                    text-shadow: 2px 2px 6px rgba(0,0,0,0.6), 0 0 15px rgba(127, 176, 105, 0.2);
                    position: relative;
                }

                .bamboo-decoration {
                    width: 80px;
                    height: 4px;
                    background: linear-gradient(90deg, #2d5a2d, #4a7c4a, #2d5a2d);
                    border-radius: 2px;
                    position: relative;
                    box-shadow: 0 0 10px rgba(45, 90, 45, 0.4);
                }

                .bamboo-decoration::before {
                    content: '';
                    position: absolute;
                    top: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 12px;
                    height: 12px;
                    background: #d4af37;
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 0 15px rgba(212, 175, 55, 0.3);
                }

                .category-items {
                    space-y: 1.5rem;
                }

                .menu-item {
                    margin-bottom: 1.5rem;
                    padding: 1rem 0;
                }

                .item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                    margin-bottom: 0.5rem;
                }

                .item-name {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #c8d6c8;
                    flex-grow: 1;
                    position: relative;
                    text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
                }

                .price-container {
                    position: relative;
                    margin-left: 1rem;
                }

                .price {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #1a2e1a;
                    background: linear-gradient(45deg, #d4af37, #b8941f);
                    padding: 0.3rem 0.8rem;
                    border-radius: 20px;
                    box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4), 0 0 15px rgba(212, 175, 55, 0.2);
                    border: 2px solid #b8941f;
                }

                .item-description {
                    color: #a8c090;
                    font-size: 0.95rem;
                    line-height: 1.6;
                    font-style: italic;
                    margin-left: 1rem;
                    position: relative;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
                }

                .item-description::before {
                    content: '"';
                    color: #7fb069;
                    font-size: 1.5rem;
                    position: absolute;
                    left: -1rem;
                    top: -0.2rem;
                    text-shadow: 0 0 8px rgba(127, 176, 105, 0.3);
                }

                .item-divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(127, 176, 105, 0.4), transparent);
                    margin-top: 1rem;
                    box-shadow: 0 0 5px rgba(127, 176, 105, 0.2);
                }

                .footer-decoration {
                    text-align: center;
                    margin-top: 3rem;
                    padding: 2rem;
                }

                .footer-pattern {
                    display: inline-flex;
                    align-items: center;
                    gap: 1rem;
                    color: #7fb069;
                    font-size: 1.5rem;
                    text-shadow: 1px 1px 3px rgba(0,0,0,0.5), 0 0 10px rgba(127, 176, 105, 0.2);
                }

                @media (max-width: 768px) {
                    .main-title {
                        font-size: 2.5rem;
                    }
                    
                    .category-title {
                        font-size: 1.8rem;
                        margin: 0 1rem;
                    }
                    
                    .bamboo-decoration {
                        width: 60px;
                    }
                    
                    .item-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.5rem;
                    }
                    
                    .price-container {
                        margin-left: 0;
                    }
                }

                /* 添加一些动画效果 */
                .menu-category {
                    animation: fadeInUp 0.6s ease-out;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .cloud-pattern {
                    animation: float 3s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                }
            </style>
        </head>
        <body class="yunguichuan-template">
            <div class="main-container">
                <header class="header-section">
                    <div class="header-decoration">
                        <div class="cloud-pattern"></div>
                        <div class="cloud-pattern"></div>
                        <div class="cloud-pattern"></div>
                    </div>
                    <h1 class="main-title">${shopName}</h1>
                    <p class="slogan">${slogan}</p>
                </header>
                
                <main>
                    ${menuHtml}
                </main>
                
                <footer class="footer-decoration">
                    <div class="footer-pattern">
                        <span>🌿</span>
                        <span>山水之间，品味自然</span>
                        <span>🌿</span>
                    </div>
                </footer>
            </div>
        </body>
        </html>
    `;
}
