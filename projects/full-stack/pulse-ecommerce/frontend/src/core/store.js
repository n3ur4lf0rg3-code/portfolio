const API_URL = "http://localhost:3000/api";

export const api = async (endpoint, method = "GET", body = null) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(API_URL + endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
      body: body ? JSON.stringify(body) : null,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || "API error",
      };
    }

    return data;

  } catch (error) {
    if (error.name === "AbortError") {
      throw { message: "Request timeout" };
    }

    throw error;
  }
};
