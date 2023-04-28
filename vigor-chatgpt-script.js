// ==UserScript==
// @name         ChatGPT Auto Refresh
// @namespace    ChatGPT-Intelligant-auto-refresh
// @version      1
// @description  当且仅当你没有在ChatGPT页面上活动时，定时替你刷新ChatGPT的页面，间隔是30秒，如果你当前正在ChatGPT页面上，则不刷新。
// @match        https://chat.openai.com/*
// @grant        none
// @author       yammi@yammi.cafe
// @run-at       document-idle
// ==/UserScript==

console.log(`脚本已运行`);
// 匿名函数自执行，避免污染全局变量环境
(function () {
  // 查找父元素
  let style = `
      .badge {
        padding: 12px;
        margin: 5px 0px;
        color: #F9F7F3;
        border-radius: 4px;
        background-color: #0FA3B1;
        background-blend-mode: normal;
        font-family: Viga;
        font-size: 11px;
        font-weight: 400;

        text-align: center;
      }
      .badge p {
        line-height: 18px;
      }
    `

  const parentElement = document.evaluate(
    '//*[@id="__next"]/div[2]/div[1]/div/div/nav/a',
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue.parentElement;

  // 创建要插入的DIV
  const newDiv = document.createElement("div");
  newDiv.className = 'badge'
  newDiv.innerHTML = `<style>${style}</style><p>Vigor is running</p><p>Your ChatGPT will remain active.</p>`;

  // 将新的DIV插入到父元素中
  parentElement.insertBefore(newDiv, parentElement.firstChild);

  // 定义计时器，初始化为 null
  let refreshTimer = null;

  // 如果当前页面在 chat.openai.com 域名下，则执行以下操作
  if (location.hostname === "chat.openai.com") {
    // 创建要插入的 P 元素
    const newP = document.createElement("p");
    newP.textContent = `最近刷新时间：${new Date().toLocaleTimeString()}`;
    console.log(`最近刷新时间：${new Date().toLocaleTimeString()}`);

    // 将 P 元素添加到 DIV 元素中
    newDiv.appendChild(newP);

    // 调用 checkVisibility 函数
    checkVisibility();
  }

  // 检测网页可见性的函数
  function checkVisibility() {
    // 如果当前页面处于被隐藏状态，则启动定时器，每一分钟刷新一次页面并继续检测是否可见

    refreshTimer = setTimeout(() => {
      if (document.visibilityState === "hidden") {
        location.reload();
        checkVisibility();
      }
      else {
        // clearInterval(refreshTimer);
        console.log(`当前页面的可见状态不是 hidden`);
        setTimeout(checkVisibility, 1000);
      }
    }, 10000);

    // 否则清除定时器，并在 1 秒后再次调用自身

  }

  // 当脚本停止或者页面卸载时清除计时器
  window.addEventListener("beforeunload", () => {
    clearInterval(refreshTimer);
  });
})();
