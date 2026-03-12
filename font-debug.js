// 字体调试脚本
// 在浏览器控制台中运行此脚本

console.log('=== 字体调试工具 ===\n');

// 1. 检查当前应用的字体
const computedStyle = window.getComputedStyle(document.body);
console.log('1. 当前 body 字体:', computedStyle.fontFamily);

// 2. 检查 CSS 变量
const rootStyle = window.getComputedStyle(document.documentElement);
console.log('2. CSS 变量 --font-family:', rootStyle.getPropertyValue('--font-family'));

// 3. 检查 localStorage 中保存的字体
console.log('3. localStorage 中的字体:', localStorage.getItem('docs-font'));

// 4. 列出所有已加载的字体
document.fonts.ready.then(() => {
    console.log('\n4. 已加载的 Web 字体:');
    const loadedFonts = new Set();
    document.fonts.forEach(font => {
        if (!loadedFonts.has(font.family)) {
            loadedFonts.add(font.family);
            console.log(`   - ${font.family} (${font.status})`);
        }
    });
    console.log(`   共 ${loadedFonts.size} 个字体家族\n`);
});

// 5. 测试字体函数
window.testFont = function(fontFamily) {
    document.documentElement.style.setProperty('--font-family', fontFamily);
    console.log('已设置字体为:', fontFamily);
    console.log('当前 body 字体:', window.getComputedStyle(document.body).fontFamily);
};

// 6. 测试所有字体
window.testAllFonts = function() {
    const fonts = [
        { name: '系统默认', family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif' },
        { name: '苹方', family: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' },
        { name: '微软雅黑', family: '"Microsoft YaHei", "Microsoft YaHei UI", "PingFang SC", sans-serif' },
        { name: '思源黑体', family: '"Noto Sans SC", sans-serif' },
        { name: '思源宋体', family: '"Noto Serif SC", serif' },
        { name: '霞鹜文楷', family: '"LXGW WenKai", "KaiTi", serif' },
        { name: '站酷高端黑', family: '"ZCOOL QingKe HuangYou", sans-serif' },
        { name: '站酷快乐体', family: '"ZCOOL KuaiLe", sans-serif' },
        { name: '得意黑', family: '"SmileySans", "PingFang SC", sans-serif' }
    ];

    let index = 0;
    const interval = setInterval(() => {
        if (index >= fonts.length) {
            clearInterval(interval);
            console.log('\n测试完成！');
            return;
        }

        const font = fonts[index];
        console.log(`\n测试 ${index + 1}/${fonts.length}: ${font.name}`);
        console.log('设置:', font.family);
        document.documentElement.style.setProperty('--font-family', font.family);

        setTimeout(() => {
            const actual = window.getComputedStyle(document.body).fontFamily;
            console.log('实际:', actual);
            console.log('匹配:', actual.includes(font.family.split(',')[0].replace(/['"]/g, '')) ? '✅' : '⚠️');
        }, 100);

        index++;
    }, 2000);
};

console.log('\n可用命令:');
console.log('  testFont("PingFang SC")  - 测试单个字体');
console.log('  testAllFonts()           - 自动测试所有字体\n');
