const AUTH_URL = "https://api.ecloud.akubela.com/api/v1.0/invoke/open-ability/method/oauth2/token";

// TODO: Replace with secure storage or env variables!
const USERNAME = "fayis@sonictech.ae";
const PASSWORD = "Fayis@123";
const EXPIRES_IN = "100000";
const client_id = "ccf1ac952146b11f0904c02dd80f92105";
const client_secret = "scf1ac95d146b11f0904c02dd80f92105";
const scope = "user"; 
export async function getAccessToken() {
  // Use a raw string for form-encoded body (sometimes more compatible)
  const body =
    "username=" + encodeURIComponent(USERNAME) +
    "&password=" + encodeURIComponent(PASSWORD) +
    "&grant_type=" + encodeURIComponent("password") +
    "&client_id=" + encodeURIComponent(client_id) +
    "&client_secret=" + encodeURIComponent(client_secret) +
    "&scope=" + encodeURIComponent(scope) +
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
      return data.result.access_token;
    }
    console.error("Access token missing in response:", data);
    throw new Error("Access token not found in API response: " + text);
  } catch (err) {
    console.error("getAccessToken error:", err);
    throw err;
  }
}

export async function buildWanHeaders() {
  try {
    const accessToken = await getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'   
    };
    console.log("Wan Headers built:", headers);
    return headers;
  } catch (err) {
    console.error("buildWanHeaders error:", err);
    throw err;
  }
}