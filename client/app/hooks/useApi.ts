import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { useState, useCallback, useMemo } from "react";
import { supabase } from "../utils/Supabase";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async <T = unknown, D = unknown>(
      method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
      endpoint: string,
      data?: D,
      params?: Record<string, unknown>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const session = (await supabase.auth.getSession()).data.session;
        const token = session?.access_token;

        const config: AxiosRequestConfig = {
          method,
          url: endpoint,
          baseURL: url,
          params,
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        };

        if (data !== undefined) {
          config.data = data;
        }

        if (data instanceof FormData && config.headers) {
          delete config.headers["Content-Type"];
          config.headers["Content-Type"] = undefined;
        }

        const response = await axios(config);
        return response.data as T;
      } catch (err) {
        const error = err as AxiosError;
        console.error(`API Error: ${method} ${endpoint}`, error);
        setError(
          (error.response?.data as { error?: string })?.error || error.message
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const download = useCallback(async (endpoint: string) => {
    setLoading(true);
    setError(null);

    try {
      const session = (await supabase.auth.getSession()).data.session;
      const token = session?.access_token;

      const response = await axios.get(`${url}${endpoint}`, {
        responseType: "blob",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const contentDisposition = response.headers["content-disposition"];
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch?.[1] ?? "download";

      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });

      const fileUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(fileUrl);
    } catch (err) {
      const error = err as AxiosError;
      setError(
        (error.response?.data as { error?: string })?.error || "Download failed"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const apiMethods = useMemo(
    () => ({
      get: <T = unknown>(url: string, params?: Record<string, unknown>) =>
        request<T>("GET", url, undefined, params),
      post: <T = unknown, D = unknown>(url: string, data?: D) =>
        request<T, D>("POST", url, data),
      patch: <T = unknown, D = unknown>(url: string, data?: D) =>
        request<T, D>("PATCH", url, data),
      put: <T = unknown, D = unknown>(url: string, data?: D) =>
        request<T, D>("PUT", url, data),
      del: <T = unknown>(url: string) => request<T>("DELETE", url),
    }),
    [request]
  );

  return {
    ...apiMethods,
    download,
    loading,
    setLoading,
    error,
    setError,
  };
};

export default useApi;
