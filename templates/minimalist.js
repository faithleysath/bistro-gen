function renderMinimalistTemplate(data) {
    const shopName = data['店铺名称'] ? data['店铺名称'].split('').join('. ') + '.' : 'house. wine. bistro.';
    const slogan = data['Slogan（中）'] || 'A place for fine food and wine.';

    const generateCategoryHtml = (categoryName) => {
        const items = data['菜单'][categoryName];
        let categoryHtml = `<section><h2 class="menu-section-title">${categoryName}</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">`;
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
            <link rel="stylesheet" href="templates/minimalist.css">
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
