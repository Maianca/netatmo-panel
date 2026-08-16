import fetch from "node-fetch";

export async function handler() {
    const clientId = process.env.NETATMO_CLIENT_ID;
    const clientSecret = process.env.NETATMO_CLIENT_SECRET;
    const refreshToken = process.env.NETATMO_REFRESH_TOKEN;

    try {
        const tokenResponse = await fetch("https://api.netatmo.com/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: clientId,
                client_secret: clientSecret
            })
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        const weatherResponse = await fetch(
            "https://api.netatmo.com/api/getstationsdata?access_token=" + accessToken
        );

        const weatherData = await weatherResponse.json();

        const dashboard = weatherData.body.devices[0].dashboard_data;

        return {
            statusCode: 200,
            body: JSON.stringify({
                temperature: dashboard.Temperature,
                humidity: dashboard.Humidity
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}
