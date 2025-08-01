function renderElegantTemplate(data) {
    const shopName = data['店铺名称'] || 'MERPORT BISTRO';
    const slogan = data['Slogan（中）'] || 'BREAKFAST : 7:30 AM - 10:30 AM || LUNCH : 11:00 AM - 3:30 PM';

    let menuHtml = '';
    // 确保按照固定顺序渲染菜单分类：前菜、主菜、副菜、甜点
    const orderedCategories = ['Appetizers', 'Main Courses', 'Side Dishes', 'Desserts'];
    const categories = orderedCategories.filter(cat => data['菜单'][cat] && data['菜单'][cat].length > 0);
    
    // Split categories into two columns
    const midpoint = Math.ceil(categories.length / 2);
    const leftColumnCategories = categories.slice(0, midpoint);
    const rightColumnCategories = categories.slice(midpoint);

    const generateCategoryHtml = (categoryName) => {
        const items = data['菜单'][categoryName];
        let categoryHtml = `<h2 class="font-serif-display text-4xl mt-6 mb-6 border-b-2 border-gray-200 pb-2">${categoryName}</h2><div class="space-y-6">`;
        items.forEach(item => {
            categoryHtml += `
                <div>
                    <div class="flex justify-between items-baseline">
                        <h3 class="text-lg font-bold uppercase tracking-wider">${item['菜品（中）']}</h3>
                        <p class="text-lg font-bold">${item['价格'] || '$' + (Math.floor(Math.random() * 20) + 10)}</p>
                    </div>
                    <p class="text-gray-600 mt-1">${item['身份梗·哲学说明']}</p>
                </div>
            `;
        });
        categoryHtml += '</div>';
        return categoryHtml;
    };

    let leftColumnHtml = '<section>';
    leftColumnCategories.forEach(cat => leftColumnHtml += generateCategoryHtml(cat));
    leftColumnHtml += '</section>';

    let rightColumnHtml = '<section class="space-y-10">';
    rightColumnCategories.forEach(cat => rightColumnHtml += `<div>${generateCategoryHtml(cat)}</div>`);
    rightColumnHtml += '</section>';

    return `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <title>Elegant Menu</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @import url('https://fonts.loli.net/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap');

                body.elegant-template {
                    font-family: 'Lato', sans-serif;
                    background-color: #ffffff;
                }

                .elegant-template .font-serif-display {
                    font-family: 'Playfair Display', serif;
                }

                .elegant-background {
                    position: relative;
                    z-index: 1;
                }

                .elegant-background::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image: url('/assets/elegant-background.png');
                    background-size: cover;
                    background-position: center;
                    opacity: 0.1;
                    z-index: -1;
                }
            </style>
        </head>
        <body class="elegant-template">
            <div class="elegant-background">
                <div class="max-w-4xl mx-auto p-8">
                    <div class="w-full mb-8">
                    <img src="assets/elegant-poster.jpg" alt="头部图片" class="w-full h-auto object-cover rounded-lg shadow-md">
                </div>
                <header class="text-center mb-10">
                    <h1 class="font-serif-display text-5xl md:text-6xl tracking-widest text-gray-900">${shopName.toUpperCase()}</h1>
                    <div class="mt-4 text-sm font-semibold tracking-wider text-gray-600">
                        <span>${slogan}</span>
                    </div>
                </header>
                <main class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    ${leftColumnHtml}
                    ${rightColumnHtml}
                    </main>
                </div>
            </div>
        </body>
        </html>
    `;
}
