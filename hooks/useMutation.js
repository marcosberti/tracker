import { useState } from "react";

const STATUS = {
  idle: "idle",
  pending: "pending",
  success: "success",
  error: "error",
};

export default function useMutation(endpoint, method = "POST") {
  const [state, setState] = useState({
    status: STATUS.idle,
  });

  const mutate = async ({ data, onSuccess, onError }) => {
    const url = `/api/${endpoint}`;
    const options = {
      method,
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    };

    setState({ status: STATUS.pending });
    try {
      const result = await fetch(url, options);

      if (!result.ok) {
        const error = (data && data.message) || response.status;
        throw new Error(error);
      }

      const data = await result.json();
      setState({ status: STATUS.success, data });
      onSuccess && onSuccess();
    } catch (e) {
      setState({ status: STATUS.error, error: e });
      onError && onError(e);
    }
  };

  return {
    mutate,
    data: state.data,
    error: state.error,
    isIdle: state.status === STATUS.idle,
    isPending: state.status === STATUS.pending,
    isSuccess: state.status === STATUS.success,
    isError: state.status === STATUS.error,
  };
}
