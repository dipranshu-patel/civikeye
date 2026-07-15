import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ containerRef } = {}) {
    const { pathname } = useLocation();

    useEffect(() => {
        const target = containerRef?.current ?? window;
        target.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname, containerRef]);

    return null;
}
