"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function activate(context) {
    // Команда для создания полной структуры проекта (src с core и modules)
    let createProjectStructureCommand = vscode.commands.registerCommand('structurizator.createProjectStructure', async (uri) => {
        let baseDir;
        if (uri) {
            baseDir = uri.fsPath; // Базовая папка — та, на которую нажали ПКМ (например, lib/)
        }
        else {
            vscode.window.showErrorMessage("No folder selected. Use right-click on a folder in the explorer.");
            return;
        }
        try {
            // Создать папку src/ внутри baseDir
            const srcDir = path.join(baseDir, 'src');
            if (!fs.existsSync(srcDir)) {
                fs.mkdirSync(srcDir, { recursive: true });
            }
            // Создать папки core/ и modules/ внутри src/
            const coreDir = path.join(srcDir, 'core');
            const modulesDir = path.join(srcDir, 'modules');
            if (!fs.existsSync(coreDir)) {
                fs.mkdirSync(coreDir, { recursive: true });
            }
            if (!fs.existsSync(modulesDir)) {
                fs.mkdirSync(modulesDir, { recursive: true });
            }
            // Структура папок внутри core/
            const coreFolders = [
                'data',
                'theme/configurate',
                'theme/riverpod',
                'domain/repository',
                'domain/use_case',
                'domain/services',
                'domain/models',
                'router/service',
                'router/routes',
                'router/redirects',
                'presentation/pages',
                'presentation/widgets',
                'riverpod'
            ];
            coreFolders.forEach(relativePath => {
                const fullPath = path.join(coreDir, relativePath);
                if (!fs.existsSync(fullPath)) {
                    fs.mkdirSync(fullPath, { recursive: true });
                }
            });
            // modules/ остаётся пустым, как указано
            vscode.window.showInformationMessage(`Project structure created in: ${srcDir}`);
            vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error creating project structure: ${error.message}`);
        }
    });
    // Команда для создания структуры модуля (data, domain/, presentation/, riverpod)
    let createModuleCommand = vscode.commands.registerCommand('structurizator.createModule', async (uri) => {
        let baseDir;
        let moduleName;
        if (uri) {
            baseDir = uri.fsPath; // Папка, где создать модуль (например, ПКМ на modules/ или другой папке)
            // По умолчанию используем имя папки как moduleName, но запросим ввод для имени модуля
            const defaultName = path.basename(baseDir) !== 'modules' ? path.basename(baseDir) : 'new_module';
            const inputName = await vscode.window.showInputBox({
                prompt: "Enter the module name (will create a subfolder with this structure)",
                placeHolder: "e.g., auth_module",
                value: defaultName
            });
            moduleName = inputName || defaultName;
        }
        else {
            vscode.window.showErrorMessage("No folder selected. Use right-click on a folder in the explorer.");
            return;
        }
        if (!baseDir) {
            vscode.window.showErrorMessage("No base directory available.");
            return;
        }
        try {
            // Создать подпапку для модуля внутри baseDir (например, inside modules/)
            const moduleDir = path.join(baseDir, moduleName);
            if (!fs.existsSync(moduleDir)) {
                fs.mkdirSync(moduleDir, { recursive: true });
            }
            // Структура папок внутри модуля
            const moduleFolders = [
                'data',
                'domain/repository',
                'domain/use_case',
                'domain/services',
                'domain/models',
                'presentation/pages',
                'presentation/widgets',
                'riverpod'
            ];
            moduleFolders.forEach(relativePath => {
                const fullPath = path.join(moduleDir, relativePath);
                if (!fs.existsSync(fullPath)) {
                    fs.mkdirSync(fullPath, { recursive: true });
                }
            });
            vscode.window.showInformationMessage(`Module structure created: ${moduleDir}`);
            vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error creating module structure: ${error.message}`);
        }
    });
    // Регистрируем команды
    context.subscriptions.push(createProjectStructureCommand);
    context.subscriptions.push(createModuleCommand);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map