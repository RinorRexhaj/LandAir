import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { useState, useCallback } from "react";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = axios.create({
    baseURL: url,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use((config) => {
    // const token = useSessionStore.getState().accessToken;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  });

  const request = useCallback(
    async <T = unknown, D = unknown>(
      method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
      url: string,
      data?: D,
      params?: Record<string, unknown>
    ) => {
      setLoading(true);
      setError(null);
      try {
        const config: AxiosRequestConfig = {
          method,
          url,
          params,
        };

        if (data !== undefined) {
          config.data = data;
        }

        if (data instanceof FormData) {
          delete api.defaults.headers["Content-Type"];
          config.headers = { "Content-Type": undefined };
        }

        const response = await api(config);
        return response.data as T;
      } catch (err) {
        const error = err as AxiosError;
        console.error(`API Error: ${method} ${url}`, error);
        console.error("Error details:", error.response?.data || error.message);

        setError(
          (error.response?.data as { error?: string })?.error || error.message
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  const download = useCallback(
    async (url: string) => {
      setLoading(true);
      setError(null);
      try {
        // const token = useSessionStore.getState().accessToken;

        const response = await api.get(url, {
          responseType: "blob",
          headers: {
            // Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const contentDisposition = response.headers["content-disposition"];
        const filenameStart = contentDisposition.indexOf('filename="') + 10;
        const filenameEnd = contentDisposition.indexOf('"', filenameStart);
        const filename = contentDisposition.slice(filenameStart, filenameEnd);

        const blob = new Blob([response.data], {
          type: response.headers["content-type"] || "application/octet-stream",
        });

        // Create an object URL for the file
        const fileUrl = URL.createObjectURL(blob);

        // Open file in a new tab
        const newTab = window.open(fileUrl, "_blank");

        // If the file is downloadable, trigger the download as well
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();

        // Cleanup after opening in the new tab
        URL.revokeObjectURL(fileUrl);
        newTab?.focus(); // Optionally focus the new tab
      } catch (err) {
        const error = err as AxiosError;
        setError(
          (error.response?.data as { error?: string })?.error ||
            "Download failed"
        );
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  const get = useCallback(
    <T = unknown>(url: string, params?: Record<string, unknown>) =>
      request<T>("GET", url, null, params),
    [request]
  );
  const post = useCallback(
    <T = unknown, D = unknown>(url: string, data?: D) =>
      request<T, D>("POST", url, data),
    [request]
  );
  const patch = useCallback(
    <T = unknown, D = unknown>(
      url: string,
      data?: D,
      params?: Record<string, unknown>
    ) => request<T, D>("PATCH", url, data, params),
    [request]
  );
  const put = useCallback(
    <T = unknown, D = unknown>(
      url: string,
      data?: D,
      params?: Record<string, unknown>
    ) => request<T, D>("PUT", url, data, params),
    [request]
  );
  const del = useCallback(
    <T = unknown>(url: string, params?: Record<string, unknown>) =>
      request<T>("DELETE", url, undefined, params),
    [request]
  );

  return {
    get,
    post,
    patch,
    put,
    del,
    download,
    loading,
    setLoading,
    error,
    setError,
  };
};

export default useApi;
