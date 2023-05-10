// ==UserScript==
// @name         ChatGPT Filting
// @namespace    ChatGPT-Intelligant-auto-refresh
// @version      1
// @description  当且仅当你没有在ChatGPT页面上活动时，定时替你刷新ChatGPT的页面，间隔是30秒，如果你当前正在ChatGPT页面上，则不刷新。
// @match        https://chat.openai.com/*
// @grant        none
// @author       yammi@yammi.cafe
// @run-at       document-end
// ==/UserScript==


console.log(`脚本已运行`);

// 循环找到当前页面上的所有selector为 `#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1 > div > main > div.flex-1.overflow-hidden > div > div > div > div:nth-child(2)` 的同级div

const selector = '#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1 > div > main > div.flex-1.overflow-hidden > div > div > div > div:nth-child(2)';

let lastUrl = window.location.href;
let length = 0;

// 循环检测当前 url 是否发生变化，如果发生了变化，递归调用 findAndLogSiblings
function checkUrlChange() {
    const targetElements = document.querySelectorAll(selector);
    let intervalId2;
    if (window.location.href !== lastUrl || targetElements.length !== length) {
        lastUrl = window.location.href;
        length = targetElements.length;
        clearInterval(intervalId2);
        findAndLogSiblings();
    }

    intervalId2 = setInterval(checkUrlChange, 1000);
}

function findAndLogSiblings() {
    const targetElements = document.querySelectorAll(selector);

    if (targetElements.length > 0) {
        length = targetElements.length;
        clearInterval(intervalId);
        targetElements.forEach((element) => {
            const parentElement = element.parentElement;
            for (let i = 0; i < parentElement.children.length; i++) {
                const siblingElement = parentElement.children[i];
                if (siblingElement !== element) {
                    console.log('同级div：', siblingElement);
                }
            }
        });

        const targetElementXPath = '//*[@id="__next"]/div[2]/div[2]/div/main/div[3]/form/div/div[2]';
        const textareaXPath = '//*[@id="__next"]/div[2]/div[2]/div/main/div[3]/form/div/div[2]/textarea';

        // 把 targetElementXPath 的class的flex-col替换为flex-row
        // 在 textareaXPath 前添加一个 checkBox
        (async () => {
            const targetElement = document.evaluate(targetElementXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const textareaElement = document.evaluate(textareaXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            // 替换 flex-col 为 flex-row
            targetElement.className = targetElement.className.replace('flex-col', 'flex-row');

            const checkboxContainer = document.createElement('div');
            checkboxContainer.style.display = 'flex';
            checkboxContainer.style.alignItems = 'center';
            checkboxContainer.style.marginRight = '10px';

            const checkBox = document.createElement('input');
            checkBox.type = 'checkbox';

            checkboxContainer.appendChild(checkBox);
            targetElement.insertBefore(checkboxContainer, textareaElement);

            // 监听复选框选中事件
            let inputText = '';
            // newButton.addEventListener("click", function () {
            checkBox.addEventListener("change", function () {
                if (this.checked) {
                    // 把 inputBox.value 改为 textareaElement 的 value
                    inputText = textareaElement.value;
                    console.log(`获取的搜索关键词为${inputText}`);
                    // 结合上面的所有 siblingElement 内的文本，在每个siblingElement的文本中查询 inputText，如果当前siblingElement文本中不包含inputText，则隐藏该siblingElement。
                    const targetElements = document.querySelectorAll(selector);
                    targetElements.forEach((element) => {
                        const parentElement = element.parentElement;
                        for (let i = 0; i < parentElement.children.length; i++) {
                            const siblingElement = parentElement.children[i];
                            if (!siblingElement.textContent.includes(inputText)) {
                                siblingElement.style.display = 'none';
                            }
                        }
                    });
                }
            });

            // 监听输入框文本变化事件
            textareaElement.addEventListener("input", function () {
                if (checkBox.checked) {
                    checkBox.checked = false;
                    // 取消所有siblingElement的隐藏状态，改为显示
                    const targetElements = document.querySelectorAll(selector);
                    targetElements.forEach((element) => {
                        const parentElement = element.parentElement;
                        for (let i = 0; i < parentElement.children.length; i++) {
                            const siblingElement = parentElement.children[i];
                            siblingElement.style.display = '';
                        }
                    });
                }
            });
        })();



        // 检测 URL 变化并在适当的时候重新调用 findAndLogSiblings
        checkUrlChange();
    }
}

const intervalId = setInterval(findAndLogSiblings, 1000);

