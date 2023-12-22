"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanMarkdown = void 0;
function cleanMarkdown(context_text) {
    context_text = replaceAll(context_text, "=", '');
    context_text = replaceAll(context_text, "+", '');
    context_text = replaceAll(context_text, "-", '');
    context_text = replaceAll(context_text, '_', '');
    context_text = replaceAll(context_text, '*', '');
    context_text = replaceAll(context_text, "\\", '');
    context_text = replaceAll(context_text, '(', '');
    context_text = replaceAll(context_text, ')', '');
    context_text = replaceAll(context_text, "/", '');
    context_text = replaceAll(context_text, "%", '');
    context_text = replaceAll(context_text, "^", '');
    context_text = replaceAll(context_text, "#", '');
    context_text = replaceAll(context_text, "@", '');
    context_text = replaceAll(context_text, "!", '');
    context_text = replaceAll(context_text, "?", '');
    context_text = replaceAll(context_text, ".", '');
    return context_text;
}
exports.cleanMarkdown = cleanMarkdown;
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
//# sourceMappingURL=bot_helper.js.map