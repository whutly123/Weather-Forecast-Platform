document.addEventListener('DOMContentLoaded', () => {
    // 获取 DOM 元素引用
    const searchBtn = document.getElementById('search-btn');
    const cityInput = document.getElementById('city-input');
    const loading = document.getElementById('loading');
    const weatherContent = document.getElementById('weather-content');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');


    // UI 显示元素引用
    const locationName = document.getElementById('location-name');
    const currentTemp = document.getElementById('current-temp');
    const weatherDesc = document.getElementById('weather-desc');
    const weatherIcon = document.getElementById('weather-icon');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');
    const feelsLike = document.getElementById('feels-like');
    const precipitation = document.getElementById('precipitation');
    const forecastList = document.getElementById('forecast-list');


    // WMO 天气代码映射表
    // 将数字代码转换为中文描述和对应的 FontAwesome 图标类名
    const weatherCodes = {
        0: { desc: '晴朗', icon: 'fa-sun' },
        1: { desc: '多云', icon: 'fa-cloud-sun' },
        2: { desc: '局部多云', icon: 'fa-cloud-sun' },
        3: { desc: '阴天', icon: 'fa-cloud' },
        45: { desc: '雾', icon: 'fa-smog' },
        48: { desc: '雾凇', icon: 'fa-smog' },
        51: { desc: '小毛毛雨', icon: 'fa-cloud-rain' },
        53: { desc: '中毛毛雨', icon: 'fa-cloud-rain' },
        55: { desc: '大毛毛雨', icon: 'fa-cloud-rain' },
        61: { desc: '小雨', icon: 'fa-cloud-showers-heavy' },
        63: { desc: '中雨', icon: 'fa-cloud-showers-heavy' },
        65: { desc: '大雨', icon: 'fa-cloud-showers-heavy' },
        71: { desc: '小雪', icon: 'fa-snowflake' },
        73: { desc: '中雪', icon: 'fa-snowflake' },
        75: { desc: '大雪', icon: 'fa-snowflake' },
        77: { desc: '雪粒', icon: 'fa-snowflake' },
        80: { desc: '小阵雨', icon: 'fa-cloud-showers-water' },
        81: { desc: '中阵雨', icon: 'fa-cloud-showers-water' },
        82: { desc: '大阵雨', icon: 'fa-cloud-showers-water' },
        95: { desc: '雷雨', icon: 'fa-bolt' },
        96: { desc: '雷雨伴有冰雹', icon: 'fa-bolt' },
        99: { desc: '雷雨伴有大冰雹', icon: 'fa-bolt' }
    };

    /**
     * 根据天气代码获取描述和图标
     * @param {number} code - WMO 天气代码
     * @returns {Object} 包含 desc 和 icon 的对象
     */
    function getWeatherInfo(code) {
        return weatherCodes[code] || { desc: '未知', icon: 'fa-question' };
    }

    /**
     * 异步获取天气数据
     * @param {string} city - 城市名称
     */
    async function fetchWeather(city) {
        if (!city) return;

        // 重置 UI 状态：隐藏错误和内容，显示加载动画
        errorMessage.classList.add('hidden');
        weatherContent.classList.add('hidden');
        loading.classList.remove('hidden');

        try {
            // 发起 API 请求
            const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '无法获取天气数据');
            }

            // 更新 UI 显示数据
            updateUI(data);
        } catch (error) {
            console.error(error);
            showError(error.message);
        } finally {
            // 无论成功失败，都隐藏加载动画
            loading.classList.add('hidden');
        }
    }

    /**
     * 更新页面 UI 元素
     * @param {Object} data - 从后端获取的天气数据
     */
    function updateUI(data) {
        const { location, current, daily } = data;
        const currentInfo = getWeatherInfo(current.weather_code);

        // 更新当前天气部分
        locationName.textContent = `${location.name}, ${location.country}`;
        currentTemp.textContent = Math.round(current.temperature_2m);
        weatherDesc.textContent = currentInfo.desc;

        weatherIcon.className = `fa-solid ${currentInfo.icon} weather-icon-lg`;

        currentTemp.textContent = Math.round(current.temperature_2m);
        weatherDesc.textContent = currentInfo.desc;

        // 设置天气图标
        weatherIcon.className = `fa-solid ${currentInfo.icon} weather-icon-lg`;

        // 添加图标悬浮动画效果
        // 通过 reflow 触发重启动画
        weatherIcon.style.animation = 'none';
        weatherIcon.offsetHeight; /* trigger reflow */
        weatherIcon.style.animation = 'float 3s ease-in-out infinite';

        // 更新详细天气指标
        humidity.textContent = `${current.relative_humidity_2m}%`;
        windSpeed.textContent = `${current.wind_speed_10m} km/h`;
        feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
        precipitation.textContent = `${current.precipitation} mm`;

        // 更新未来预报部分
        forecastList.innerHTML = '';
        const today = new Date().toISOString().split('T')[0];


        // 仅显示未来 7 天的数据
        for (let i = 0; i < 7; i++) {
            if (!daily.time[i]) break;

            const dateStr = daily.time[i];
            const date = new Date(dateStr);
            // 如果是今天显示“今天”，否则显示星期几
            const dayName = dateStr === today ? '今天' : date.toLocaleDateString('zh-CN', { weekday: 'long' });
            const code = daily.weather_code[i];
            const info = getWeatherInfo(code);
            const maxT = Math.round(daily.temperature_2m_max[i]);
            const minT = Math.round(daily.temperature_2m_min[i]);

            // 创建预报列表项
            const item = document.createElement('div');
            item.className = 'forecast-item';
            item.innerHTML = `
                <div class="f-day">${dayName}</div>
                <div class="f-icon"><i class="fa-solid ${info.icon}"></i></div>
                <div class="f-temp"><span>${maxT}°</span> / ${minT}°</div>
            `;
            forecastList.appendChild(item);
        }

        // 显示天气内容区域
        weatherContent.classList.remove('hidden');
    }

    /**
     * 显示错误信息
     * @param {string} msg - 错误描述
     */
    function showError(msg) {
        errorText.textContent = msg;
        errorMessage.classList.remove('hidden');
    }

    // 事件监听器配置
    // 搜索按钮点击事件
    searchBtn.addEventListener('click', () => {
        fetchWeather(cityInput.value.trim());
    });

    // 输入框回车键事件
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchWeather(cityInput.value.trim());
        }
    });
});
