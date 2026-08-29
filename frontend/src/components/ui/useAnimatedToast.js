import * as React from "react";

export const ToastContext = React.createContext(null);

// Hook to use toast
export function useAnimatedToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error(
      "useAnimatedToast must be used within AnimatedToastProvider",
    );
  }
  return context;
}

// Promise Toast (for async operations)
export function usePromiseToast() {
  const { addToast, removeToast } = useAnimatedToast();

  return async function promiseToast({
    promise,
    loading,
    success,
    error,
  }) {
    const id = addToast({ message: loading, type: "info", duration: 0 });

    try {
      const data = await promise;
      removeToast(id);
      addToast({
        message: typeof success === "function" ? success(data) : success,
        type: "success",
      });
      return data;
    } catch (err) {
      removeToast(id);
      addToast({
        message: typeof error === "function" ? error(err) : error,
        type: "error",
      });
      throw err;
    }
  };
}
