// hooks/useToast.ts
import { toast, ToastOptions, Id, TypeOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  faCheckCircle,
  faTimesCircle,
  faInfoCircle,
  faExclamationTriangle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useThemeStore } from "../store/useThemeStore";

const getIcon = (type: TypeOptions) => {
  switch (type) {
    case "success":
      return (
        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
      );
    case "error":
      return <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />;
    case "info":
      return <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500" />;
    case "warning":
      return (
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-yellow-500"
        />
      );
    default:
      return null;
  }
};

const useToast = () => {
  const { darkMode } = useThemeStore();
  const baseOptions: ToastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: darkMode ? "dark" : "light",
  };

  const toastWithType = (
    type: TypeOptions,
    message: string,
    options?: ToastOptions
  ) =>
    toast(message, {
      ...baseOptions,
      type,
      icon: getIcon(type) || undefined,
      style: {
        backgroundColor: darkMode ? "#18181b" : "#fff",
        color: !darkMode ? "#18181b" : "#fff",
      },
      ...options,
    });

  const success = (msg: string, options?: ToastOptions) =>
    toastWithType("success", msg, options);

  const error = (msg: string, options?: ToastOptions) =>
    toastWithType("error", msg, options);

  const info = (msg: string, options?: ToastOptions) =>
    toastWithType("info", msg, options);

  const warning = (msg: string, options?: ToastOptions) =>
    toastWithType("warning", msg, options);

  const loading = (msg: string, options?: ToastOptions): Id =>
    toast.loading(msg, {
      ...baseOptions,
      icon: <FontAwesomeIcon icon={faSpinner} spin className="text-gray-300" />,
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      ...options,
    });

  const update = (
    id: Id,
    type: TypeOptions,
    msg: string,
    options?: ToastOptions
  ) =>
    toast.update(id, {
      render: msg,
      type,
      isLoading: false,
      icon: getIcon(type),
      autoClose: 3000,
      ...baseOptions,
      ...options,
    });

  const dismiss = (id?: Id) => toast.dismiss(id);

  return {
    success,
    error,
    info,
    warning,
    loading,
    update,
    dismiss,
  };
};

export default useToast;
