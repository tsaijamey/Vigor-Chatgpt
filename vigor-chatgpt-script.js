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

  window.onload = function() { 
    // 页面加载完毕后执行的代码
    console.log('页面已加载完成');
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
    
    const result = document.evaluate(
      '/html/body/div[1]/div[2]/div[1]/div/div/nav/a',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );

    let refreshTimer = null;

    if (result.singleNodeValue) {
      const parentElement = result.singleNodeValue.parentElement;
      // 创建要插入的DIV
      const newDiv = document.createElement("div");
      newDiv.className = 'badge'
      newDiv.innerHTML = `<style>${style}</style><p>Vigor is running</p><p>Your ChatGPT will remain active.</p>`;

      // 将新的DIV插入到父元素中
      parentElement.insertBefore(newDiv, parentElement.firstChild);
      // 定义计时器，初始化为 null    

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
    } else {
      console.error('未找到节点');
    }
  }

    

  // 检测网页可见性的函数
  function checkVisibility() {
    // 如果当前页面处于被隐藏状态，则启动定时器，每一分钟刷新一次页面并继续检测是否可见
    refreshTimer = setTimeout(() => {
      if (document.visibilityState === "hidden") {
        // 获取当前页面源代码
        const sourceCode = document.documentElement.innerHTML;
        // 检查是否包含 "result-streaming" 字符串
        if (sourceCode.includes("result-streaming")) {
            setTimeout(() => {
                // 等待 3 秒后重新检查
                checkVisibility();
                console.log('检测到正在生成内容')
            }, 3000);
        } else {
          location.reload();
        }
      }
      else {
        // clearInterval(refreshTimer);
        console.log(`当前页面的可见状态不是 hidden`);
        //找到 xpath 为 //*[@id="__next"]/div[2]/div[2]/main/div[2]/form/div/div[2]/textarea 的区域，把question值输入该区域
        const textArea = document.evaluate(
            '//*[@id="__next"]/div[2]/div[2]/main/div[2]/form/div/div[2]/textarea',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        if (textArea) {
            let text = '';
            text = textArea.value;
            if (text) {
              console.log(`当前状态：标签激活，检测到输入。不刷新。`)
              setTimeout(checkVisibility, 1000);
            } else {
              // 获取当前页面源代码
              const sourceCode = document.documentElement.innerHTML;
              // 检查是否包含 "result-streaming" 字符串
              if (sourceCode.includes("result-streaming")) {
                console.log(`当前状态：标签激活，检测到正在生成。不刷新。`)
                setTimeout(checkVisibility, 1000);
              } else {
                console.log(`当前状态：标签激活，没有输入、没有生成。即将刷新。`)
                location.reload();
              }
            }
        }
      }
    }, 30000);

    // 否则清除定时器，并在 1 秒后再次调用自身

  }

  // 当脚本停止或者页面卸载时清除计时器
  window.addEventListener("beforeunload", () => {
    clearInterval(refreshTimer);
  });
})();
