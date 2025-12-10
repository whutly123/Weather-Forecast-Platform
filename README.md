# SkyCast - 极简天气预报平台

一个设计精美、基于 Flask 的轻量级天气预报 Web 应用。使用 Open-Meteo 免费 API，无需 API Key 即可获取全球城市的实时天气和未来预报。

## ✨ 功能特性

*   **全球城市搜索**：支持输入中文、拼音或英文城市名进行搜索。
*   **实时天气数据**：显示温度、天气状况、湿度、风速、体感温度和降水量。
*   **7天未来预报**：清晰展示未来一周的天气趋势。
*   **精美 UI 设计**：
    *   现代化的玻璃拟态 (Glassmorphism) 风格。
    *   动态背景球体动画。
    *   流畅的交互体验和加载动画。
*   **响应式布局**：完美适配桌面端和移动端设备。

## 🛠️ 技术栈

*   **后端**: Python 3, Flask
*   **前端**: HTML5, CSS3 (原生), JavaScript (原生)
*   **外部 API**: [Open-Meteo](https://open-meteo.com/) (地理编码 & 天气数据)
*   **字体与图标**: Google Fonts (Outfit), FontAwesome

## 🚀 快速开始

### 前提条件

确保你的系统中已安装 Python 3.x。

### 安装步骤

1.  进入项目目录：
    ```bash
    cd TestProj
    ```

2.  安装依赖：
    ```bash
    pip install -r requirements.txt
    ```

3.  启动应用：
    ```bash
    python app.py
    ```

4.  在浏览器中访问：
    ```
    http://127.0.0.1:5000
    ```

## 📂 项目结构

```text
TestProj/
├── app.py              # Flask 后端主程序
├── requirements.txt    # Python 依赖列表
├── static/             # 静态资源
│   ├── style.css       # 样式文件 (包含玻璃拟态设计)
│   └── script.js       # 前端逻辑 (天气数据获取与 UI 更新)
└── templates/          # HTML 模板
    └── index.html      # 主页
```

## 📝 备注

本项目使用 Open-Meteo 的免费 API，仅用于学习和演示目的，无需申请 Key 即可直接运行。
