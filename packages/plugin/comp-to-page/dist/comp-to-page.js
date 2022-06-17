"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.winPath = void 0;
/**
 * 插件流程
 * 1.读取配置文件
 * 2.生成临时路由
 * 3.处理 "npm:" 前缀的页面
 * 4.匹配公共 packages/page 页面
 * 5.写入对应项目中
 * 6.生成 .gitignore 禁公共页面提交
 *
 */
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
// window路径处理
function winPath(path) {
    var isExtendedLengthPath = /^\\\\\?\\/.test(path);
    if (isExtendedLengthPath) {
        return path;
    }
    return path.replace(/\\/g, '/');
}
exports.winPath = winPath;
var TaroPluginCompToPage = /** @class */ (function () {
    function TaroPluginCompToPage(_a) {
        var ctx = _a.ctx, configPath = _a.configPath;
        this.mark = 'npm:';
        var chalk = ctx.helper.chalk;
        this.sourcePath = winPath(ctx.paths.sourcePath);
        this.rootPath = path_1.default.join(__dirname, '../../../');
        this.chalk = chalk;
        this.ctx = ctx;
        this.configPath = configPath || path_1.default.join(this.sourcePath, 'app.page.js');
    }
    TaroPluginCompToPage.prototype.install = function () {
        var _this = this;
        this.ctx.onBuildStart(function () {
            console.log('this.configPath', _this.configPath);
            // 1.读取配置文件
            var pageConfig = require(_this.configPath);
            // 2.生成临时路由
            var fileData = fs_1.default.readFileSync(_this.configPath).toString().replace(new RegExp(_this.mark, 'g'), '');
            var tempDir = path_1.default.join(_this.sourcePath, '.temp');
            if (!fs_1.default.existsSync(tempDir)) {
                fs_1.default.mkdirSync(tempDir);
            }
            fs_1.default.writeFileSync(path_1.default.join(tempDir, 'page.js'), fileData);
            var allPage = [];
            if (pageConfig.pages) {
                allPage.push.apply(allPage, pageConfig.pages);
            }
            if (pageConfig.subpackages) {
                var pages = pageConfig.subpackages.map(function (pkg) {
                    return pkg.pages.map(function (page) { return "".concat(pkg.root, "/").concat(page); });
                }).flat(1);
                allPage.push.apply(allPage, pages);
            }
            // 3.处理 "npm:" 前缀的页面
            var findPage = allPage.filter(function (v) { return v.includes(_this.mark); })
                .map(function (v) { return v.replace(_this.mark, '').replace('/index', ''); });
            for (var i = 0; i < findPage.length; i++) {
                var _a = findPage[i].split('pages/'), module_1 = _a[0], name = _a[1];
                var p = findPage[i].replace(module_1, '');
                if (!fs_1.default.existsSync(path_1.default.join(_this.rootPath, p))) {
                    // 4.匹配公共 packages/page 页面
                    console.log("".concat(_this.chalk.red("".concat(TaroPluginCompToPage.pluginName, " ").concat(p, "\u4E0D\u5B58\u5728"))));
                    continue;
                }
                // 5.写入对应项目中
                var dirpath = path_1.default.join(_this.sourcePath, findPage[i]);
                if (!fs_1.default.existsSync(dirpath)) {
                    fs_1.default.mkdirSync(dirpath, { recursive: true });
                }
                var filepath = path_1.default.join(dirpath, 'index.ts');
                var content = "import ".concat(name, " from '").concat(name, "';export default ").concat(name);
                fs_1.default.writeFileSync(filepath, content);
            }
            // 6.生成 .gitignore 禁公共页面提交
            var ignorePath = path_1.default.join(_this.sourcePath, '.gitignore');
            var ignoreContent = "\n# ".concat(TaroPluginCompToPage.pluginName, "\n").concat(findPage.map(function (v) { return v; }).join('/\n'), "\n# ").concat(TaroPluginCompToPage.pluginName);
            fs_1.default.writeFileSync(ignorePath, ignoreContent);
        });
    };
    TaroPluginCompToPage.pluginName = 'TaroPluginCompToPage';
    return TaroPluginCompToPage;
}());
function default_1(ctx, ops) {
    var plugin = new TaroPluginCompToPage(__assign({ ctx: ctx }, ops));
    plugin.install();
}
exports.default = default_1;
