import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from './generative-ai.js';
import { MODEL_NAMES } from './background-constants.js';

const safetySetting = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  }
];

let genAI, modelFlash, modelPro;

chrome.storage.local.get("apiKey", (result) => {
  if (result.apiKey) {
    let genAI = new GoogleGenerativeAI(result.apiKey);
    modelFlash = genAI.getGenerativeModel({ model: MODEL_NAMES.FLASH, safetySetting });
    modelPro = genAI.getGenerativeModel({ model: MODEL_NAMES.PRO, safetySetting });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generate") {
    if (modelFlash === undefined || modelPro === undefined) {
      chrome.storage.local.get(["apiKey"]).then((result) => {
        genAI = new GoogleGenerativeAI(result.apiKey);
        modelFlash = genAI.getGenerativeModel({ model: MODEL_NAMES.FLASH, safetySetting });
        modelPro = genAI.getGenerativeModel({ model: MODEL_NAMES.PRO, safetySetting });
      });
    }
    const model = request.model === "flash" ? modelFlash : modelPro;
    model.generateContent(request.prompt).then((result) => {
      const response = result.response;
      const text = response.text();
      sendResponse(text);
    });
  }
  if (request.action === "setApiKey") {
    const API_KEY = request.apiKey;
    chrome.storage.local.set({ "apiKey": API_KEY }).then(() => {
      genAI = new GoogleGenerativeAI(API_KEY);
      modelFlash = genAI.getGenerativeModel({ model: MODEL_NAMES.FLASH, safetySetting });
      modelPro = genAI.getGenerativeModel({ model: MODEL_NAMES.PRO, safetySetting });
      sendResponse({ success: true });
    });
  }
  if (request.action === "getApiKey") {
    chrome.storage.local.get(["apiKey"]).then((result) => {
      sendResponse(result.apiKey);
    });
  }
  return true;
});

