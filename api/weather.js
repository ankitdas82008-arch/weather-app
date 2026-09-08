export default async function handler(req, res) {
    const { city, lat, lon, forecast } = req.query;

    let url;

    if (forecast) {
        url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(forecast)}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    } else if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    } else if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    } else {
        return res.status(400).json({ message: "Missing city or location" });
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}
