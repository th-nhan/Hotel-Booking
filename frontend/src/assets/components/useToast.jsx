import { useState, useCallback } from "react";
import { NotificationToast } from "../components/ui/animated-toast";

export function useToast() {
    const [toastConfig, setToastConfig] = useState({
        open: false,
        title: "",
        message: "",
        avatar: "",
        time: "Vừa xong"
    });

    const showToast = useCallback((title, message, avatarUrl = "") => {
        setToastConfig({
            open: true,
            title: title,
            message: message,
            avatar: avatarUrl || "https://ui-avatars.com/api/?name=Info&background=D4AF37&color=fff",
            time: "Vừa xong"
        });

        setTimeout(() => {
            setToastConfig(prev => ({ ...prev, open: false }));
        }, 5000);
    }, []);


    const ToastComponent = () => (
        <NotificationToast
            open={toastConfig.open}
            onClose={() => setToastConfig(prev => ({ ...prev, open: false }))}
            title={toastConfig.title}
            message={toastConfig.message}
            avatar={toastConfig.avatar}
            time={toastConfig.time}
        />
    );

    return { showToast, ToastComponent };
}