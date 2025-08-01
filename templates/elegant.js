function renderElegantTemplate(data) {
    const shopName = data['店铺名称'] || 'MERPORT BISTRO';
    const slogan = data['Slogan（中）'] || 'BREAKFAST : 7:30 AM - 10:30 AM || LUNCH : 11:00 AM - 3:30 PM';

    let menuHtml = '';
    const categories = Object.keys(data['菜单']);
    
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
            <link rel="stylesheet" href="templates/elegant.css">
        </head>
        <body class="elegant-template">
            <div class="max-w-4xl mx-auto p-8">
                <div class="w-full mb-8">
                    <img src="assets/elegant_background.jpg" alt="背景图片" class="w-full h-auto object-cover rounded-lg shadow-md">
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
        </body>
        </html>
    `;
}
