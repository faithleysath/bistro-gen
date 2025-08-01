function renderMinimalistTemplate(data) {
    const shopName = data['店铺名称'] ? data['店铺名称'].split('').join('. ') + '.' : 'house. wine. bistro.';
    const slogan = data['Slogan（中）'] || 'A place for fine food and wine.';

    const generateCategoryHtml = (categoryName) => {
        const items = data['菜单'][categoryName];
        let categoryHtml = `<section><h2 class="menu-section-title"><span>${categoryName}</span></h2><div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">`;
        items.forEach(item => {
            categoryHtml += `
                <div>
                    <div class="flex justify-between item-name">
                        <span>${item['菜品（中）']}</span>
                        <span>${item['价格'] || Math.floor(Math.random() * 20) + 10}</span>
                    </div>
                    <p class="item-description">${item['身份梗·哲学说明']}</p>
                </div>
            `;
        });
        categoryHtml += '</div></section>';
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
            <title>Minimalist Menu</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @import url('https://fonts.loli.net/css2?family=Tinos:ital,wght@0,400;0,700;1,400&display=swap');

                body.minimalist-template {
                    font-family: 'Tinos', serif;
                    color: #333;
                    background-color: #ffffff;
                }

                .minimalist-template .menu-section-title {
                    font-size: 2.5rem;
                    font-weight: 400;
                    letter-spacing: 0.5rem;
                    text-transform: uppercase;
                    text-align: center;
                    margin-top: 3rem;
                    margin-bottom: 3rem;
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .minimalist-template .menu-section-title::before,
                .minimalist-template .menu-section-title::after {
                    content: '';
                    flex-grow: 1;
                    height: 1px;
                    background-color: #ccc;
                }

                .minimalist-template .item-name {
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .minimalist-template .item-description {
                    font-style: italic;
                    color: #666;
                }

                .minimalist-template .header-icons {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 1.5rem;
                    margin: 1.5rem 0;
                }

                .minimalist-template .header-icons svg {
                    width: 2rem;
                    height: 2rem;
                    stroke: #333;
                    stroke-width: 1.5;
                    fill: none;
                }

                .minimalist-template .main-title {
                    text-align: center;
                    font-weight: 400;
                    font-size: 1.5rem;
                    letter-spacing: 0.2rem;
                    text-transform: uppercase;
                }

                .minimalist-template .footer-text {
                    font-size: 0.8rem;
                    text-align: center;
                    margin-top: 3rem;
                    padding: 1rem;
                    color: #666;
                    font-style: italic;
                }
            </style>
        </head>
        <body class="minimalist-template bg-white max-w-4xl mx-auto p-8">
            <header>
                <div class="header-icons">
                    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 10.5L12 3.5L19.5 10.5V20.5H4.5V10.5Z"></path><path d="M9.5 20.5V14.5H14.5V20.5"></path></svg>
                    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3L18 3L12 12L6 3Z"></path><path d="M12 12V21"></path><path d="M8 21H16"></path></svg>
                    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v8c0 1.65 1.35 3 3 3s3-1.35 3-3V3"></path><path d="M10 3v18"></path><path d="M17 3v18"></path></svg>
                </div>
                <h1 class="main-title">${shopName}</h1>
            </header>
            <main>
                ${menuHtml}
            </main>
            <footer>
                <p class="footer-text">${slogan}</p>
            </footer>
        </body>
        </html>
    `;
}
