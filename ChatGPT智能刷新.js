// ==UserScript==
// @name         ChatGPT Auto Refresh
// @namespace    ChatGPT-Intelligant-auto-refresh
// @version      1
// @description  当且仅当你没有在ChatGPT页面上活动时，定时替你刷新ChatGPT的页面，间隔是30秒，如果你当前正在ChatGPT页面上，则不刷新。
// @match        https://chat.openai.com/*
// @grant        none
// ==/UserScript==


// 匿名函数自执行，避免污染全局变量环境
(function() {
  // 定义计时器，初始化为 null
  let refreshTimer = null;

  // 如果当前页面在 chat.openai.com 域名下，则执行以下操作
  if (location.hostname === "chat.openai.com") {
    // 在控制台输出页面匹配信息和本地时间
    console.log(`页面匹配，本地时间为：${new Date().toLocaleTimeString()}`);
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
          clearInterval(refreshTimer);
          setTimeout(checkVisibility, 1000);
        }
      }, 30000);
     
    // 否则清除定时器，并在 1 秒后再次调用自身
    
  }

  // 当脚本停止或者页面卸载时清除计时器
  window.addEventListener("beforeunload", () => {
    clearInterval(refreshTimer);
  });
})();
  