from flask import Flask, render_template, jsonify, request
import requests

app = Flask(__name__)

# Open-Meteo API 配置 (免费，无需 API 密钥)
# 地理编码 API，用于将城市名称转换为经纬度
GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
# 天气预报 API，用于获取指定经纬度的天气数据
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"

@app.route('/')
def index():
    """
    渲染主页
    """
    return render_template('index.html')

@app.route('/api/weather')
def get_weather():
    """
    获取天气数据的 API 接口
    参数:
        city (str): 城市名称
    返回:
        JSON 格式的天气数据或错误信息
    """
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City parameter is required"}), 400

    try:
        # 1. 地理编码: 获取城市的经纬度
        # count=1 表示只取最匹配的一个结果
        geo_params = {"name": city, "count": 1, "language": "zh", "format": "json"}
        geo_res = requests.get(GEOCODING_URL, params=geo_params)
        geo_data = geo_res.json()

        # 检查是否找到城市
        if "results" not in geo_data or not geo_data["results"]:
            return jsonify({"error": "City not found"}), 404

        # 提取地理位置信息
        location = geo_data["results"][0]
        lat = location["latitude"]
        lon = location["longitude"]
        city_name = location["name"]
        country = location.get("country", "")

        # 2. 天气数据: 获取天气预报
        weather_params = {
            "latitude": lat,
            "longitude": lon,
            # 请求当前的各项天气指标
            "current": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "is_day", "precipitation", "weather_code", "wind_speed_10m"],
            # 请求每日的天气指标（用于预报）
            "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min"],
            "timezone": "auto"
        }
        weather_res = requests.get(WEATHER_URL, params=weather_params)
        weather_data = weather_res.json()

        if "error" in weather_data:
            return jsonify({"error": "Error fetching weather data"}), 500

        # 返回整合后的数据
        return jsonify({
            "location": {
                "name": city_name,
                "country": country,
                "lat": lat,
                "lon": lon
            },
            "current": weather_data.get("current", {}),
            "daily": weather_data.get("daily", {}),
            "current_units": weather_data.get("current_units", {}),
            "daily_units": weather_data.get("daily_units", {})
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
