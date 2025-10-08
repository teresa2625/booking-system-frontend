import { useState, useCallback } from "react";
import axios, { AxiosRequestConfig } from "axios";

function useLazyFetch<T = any>(url: string, initialData: T | null = null) {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(
    async (params?: AxiosRequestConfig["params"]) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<T>(url, { params });
        setData(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("Unknown error"));
        }
      } finally {
        setLoading(false);
      }
    },
    [url],
  );

  return [fetchData, { data, loading, error }] as const;
}

export default useLazyFetch;
