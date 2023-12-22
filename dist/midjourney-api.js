"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImage = exports.cancelJob = exports.getJob = exports.addJob = void 0;
const axios_1 = __importDefault(require("axios"));
function addJob(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        if (prompt.length > 1000) {
            prompt = prompt.substring(0, 999);
        }
        const response = yield axios_1.default.get(process.env.HTTP_ENDPOINT + '/addjob?key=' + process.env.MJ_API_KEY + '&prompt=' + process.env.PRE_PROMPT_THEMEING + ' ' + prompt + ' ' + process.env.PROMPT_THEMEING);
        console.log('MIDJOURNEY RESPONSE', response.data);
        return response.data.data;
    });
}
exports.addJob = addJob;
function getJob(job_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(process.env.HTTP_ENDPOINT + '/getjob?job_id=' + job_id);
        console.log('MIDJOURNEY RESPONSE', response.data);
        return response.data.data;
    });
}
exports.getJob = getJob;
function cancelJob(job_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(process.env.HTTP_ENDPOINT + '/getjob??key=' + process.env.MJ_API_KEY + '&job_id=' + job_id);
        console.log('MIDJOURNEY RESPONSE', response.data);
        return response.data.data;
    });
}
exports.cancelJob = cancelJob;
function getImage(image_uri) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, axios_1.default)({
            url: image_uri, //your url
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            // create file link in browser's memory
            const href = URL.createObjectURL(response.data);
            // create "a" HTML element with href to file & click
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', 'file.pdf'); //or any other extension
            document.body.appendChild(link);
            link.click();
            // clean up "a" element & remove ObjectURL
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        });
    });
}
exports.getImage = getImage;
//# sourceMappingURL=midjourney-api.js.map