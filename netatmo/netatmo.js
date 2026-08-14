const fetch = require("node-fetch");

exports.handler = async function(event, context) {
    const client_id = "6a7db5789b80e76bff05c68b";
    const client_secret = "eYHZbJAAiaTTDLtoKKSii58RXFK";
    const refresh_token = "5e05cff152aa5f000b304d5f|129fb27b64a1df8b21507486e75b297c";

    // 1. Obtener un access_token nuevo
    const tokenResponse = await fetch("https://api.netatmo.com/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=refresh_token&refresh_token=${refresh_token}&client_id=${client_id}&client_secret=${client_secret}`
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "No se pudo renovar el token", details: tokenData })
        };
    }

    const access_token = tokenData.access_token;

    // 2. Llamar a la API de Netatmo con el token renovado
    const device_id = "70:ee:50:53:0e:da";

    const apiResponse = await fetch(
        `https://api.netatmo.com/api/getstationsdata?device_id=${device_id}&get_favorites=false&access_token=${access_token}`
    );

    const apiData = await apiResponse.json();

    return {
        statusCode: 200,
        body: JSON.stringify(apiData)
    };
};
