import { useState } from "react";
import { parseGoogleMapsUrl, buildNavigationUrls } from "../../utils/navigationLinks";
import NavigationChooserModal from "./NavigationChooserModal";

function MapLink({ href, label, className = "text-blue-400 hover:text-blue-300 underline", children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [urls, setUrls] = useState(null);

    const handleClick = (e) => {
        e.preventDefault();
        const coords = parseGoogleMapsUrl(href);
        if (!coords) {
            window.open(href, "_blank", "noopener,noreferrer");
            return;
        }
        setUrls(buildNavigationUrls(coords.lat, coords.lng, label || (typeof children === "string" ? children : "")));
        setIsOpen(true);
    };

    return (
        <>
            <a href={href} onClick={handleClick} className={className}>
                {children}
            </a>
            <NavigationChooserModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                placeLabel={label || (typeof children === "string" ? children : "")}
                urls={urls}
            />
        </>
    );
}

export default MapLink;
