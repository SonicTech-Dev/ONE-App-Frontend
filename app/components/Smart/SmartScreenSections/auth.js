const AUTH_URL = "http://192.168.1.125/api/v1.0/auth";

// TODO: Replace with secure storage or env variables!
const USERNAME = "fayis@sonictech.ae";
const PASSWORD = "Fayis@123";
const EXPIRES_IN = "100000"; // Adjust as needed

export async function getAccessToken() {
  // Use a raw string for form-encoded body (sometimes more compatible)
  const body =
    "username=" + encodeURIComponent(USERNAME) +
    "&password=" + encodeURIComponent(PASSWORD) +
    "&grant_type=" + encodeURIComponent("password") +
    "&expires_in=" + encodeURIComponent(EXPIRES_IN);

  try {
    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded"
      },
      body,
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Response is not valid JSON:", text);
      throw new Error("API did not return JSON: " + text);
    }

    if (!response.ok) {
      console.error("Auth API returned error status:", response.status, text);
      throw new Error(`Failed to get access token: ${response.status} ${text}`);
    }
    if (data.success && data.result && data.result.access_token) {
      console.log("Access token received:", data.result.access_token);
      return data.result.access_token;
    }
    console.error("Access token missing in response:", data);
    throw new Error("Access token not found in API response: " + text);
  } catch (err) {
    console.error("getAccessToken error:", err);
    throw err;
  }
}

export async function buildLanHeaders() {
  try {
    const accessToken = await getAccessToken();
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    return headers;
  } catch (err) {
    console.error("buildLanHeaders error:", err);
    throw err;
  }
}