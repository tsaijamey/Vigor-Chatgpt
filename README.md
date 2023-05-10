# ChatGPT Plugins
1. Vigor-ChatGPT简介：“ChatGPT小药丸”。让你的ChatGPT保持活力。  
还在为你的chatgpt不刷新而烦恼吗？  
给TA来一颗蓝色小药丸吧。你懂的  
当且仅当你没有在ChatGPT页面上活动时，定时替你刷新ChatGPT的页面，间隔是30秒，如果你当前正在ChatGPT页面上，则不刷新。  
2. ChatGPT Filtering简介：  
当Chat会话内容过多时，以前问过的问题不方便再次查阅，很多人可能习惯于重新再问一次。  
但是我的建议是，除非过去的回答内容质量不好，否则重新问其实并不一定能得到更好的结果。
因此，Filtering插件的目的，是在当前会话中，增加一个过滤器，方便你筛选历史回答。
只需要在提问输入框里输入关键字，然后勾选输入框前面的checkbox即可。
该插件会自动检测页面的变化，重置数据。

# Update
- 2023-05.10 新增了ChatGPT-Filtering脚本。
- 2023.05.04 优化了ChatGPT页面处于激活标签时的自动刷新问题。如果当前标签页是ChatGPT页面，当 不在输入状态且不在生成内容状态时，页面将每隔30秒刷新一次。
- 2023.04.28 移除了按照load事件监听的方法，因为这会导致一些重新刷新时的问题。改成了采用document-idle方式监听DOM内容变化的方式。
- 2023.04.27 增加了插件加载的load事件监听。

# 安装
1. 先去Chrome商店安装一个Tamper Monkey。https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
2. 激活Tamper Monkey后让它显示在浏览器工具栏
3. 选择新建脚本，把代码复制进去，保存
4. 刷新一次ChatGPT页面即可

# 预览
![这是界面](https://github.com/tsaijamey/Vigor-Chatgpt/blob/main/screenshot.png "Preview Interface")

# 说明
闲时顺手做的。

## 解决什么问题：
- 近期ChatGPT可能网络访问压力较大，又或者是各种外挂机器人太多，所以会话的连接状态很不稳定，超过一定时间没刷新页面，就会导致提问时遇到Error返回，比较烦人；

## 如何解决的：
- 当且仅当你打开ChatGPT时，才运行注入脚本；
- 如果你当前在ChatGPT页面上，则不为你刷新页面，防止打断你正在输入的问题；
- 如果你当前没有激活ChatGPT页面，则为你定时刷新页面，以防止你回来使用时，页面返回Error提示；
- 在Console中输出刷新时间提示，以方便你判断；

## 没有解决哪些问题：
- ~~没有任何界面上的变动~~ 加了一些信息方便查看，不用再去console里看log了；
- 没有加酷炫的小标志；
- 没有深奥的技术；
- 很素很白菜

## 希望能帮到你
