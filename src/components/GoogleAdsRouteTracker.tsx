import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackGoogleEvent } from "@/lib/googleAds";

export const GoogleAdsRouteTracker = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    trackGoogleEvent("page_view");
  }, [location.pathname]);

  return null;
};
