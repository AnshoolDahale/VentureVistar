import { config } from "./config";
import { getToken } from "./localstorage";

const getRequest = async (path) => {
  // console.log(getToken())
  try {
    const params = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    };
    const res = await fetch(config.baseURL + path, params);
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      // If not JSON, return the raw text and a helpful error
      return {
        statusCode: res.status,
        data: text,
        error: `Response is not valid JSON. Raw response: ${text}`,
      };
    }
    return { statusCode: res.status, data };
  } catch (e) {
    console.error(`error in get Request (${path}) :- `, e);
    return { statusCode: 400, data: [] };
  }
};

const postRequest = async (path, body) => {
  try {
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
      body: JSON.stringify(body),
    };

    const res = await fetch(config.baseURL + path, params);
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      // If not JSON, return the raw text and a helpful error
      return {
        statusCode: res.status,
        data: text,
        error: `Response is not valid JSON. Raw response: ${text}`,
      };
    }
    return { statusCode: res.status, data };
  } catch (e) {
    return { statusCode: 400, data: null, error: e.message };
  }
};

const DeleteRequest = async (path) => {
  try {
    const params = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    };

    const res = await fetch(config.baseURL + path, params);

    const data = await res.text();
    return { statusCode: res.status, data };
  } catch (e) {
    console.log(`error in Delete Request (${path}) :- `, e);
  }
};

const putRequest = async (path, body) => {
  try {
    const params = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
      body: JSON.stringify(body),
    };

    console.log(`Making PUT request to: ${config.baseURL + path}`);
    const res = await fetch(config.baseURL + path, params);
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      // If not JSON, return the raw text and a helpful error
      console.warn(`Non-JSON response from ${path}:`, text);
      return {
        statusCode: res.status,
        data: text,
        error: `Response is not valid JSON. Raw response: ${text}`,
      };
    }
    console.log(`PUT request to ${path} completed with status:`, res.status);
    return { statusCode: res.status, data };
  } catch (e) {
    console.error(`error in PUT Request (${path}) :- `, e);
    // Return a consistent error structure
    return { 
      statusCode: 500, 
      data: null, 
      error: e.message,
      networkError: true 
    };
  }
};

export const Api = {
  getRequest,
  postRequest,
  DeleteRequest,
  putRequest,
};
