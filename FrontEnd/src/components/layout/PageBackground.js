import React from 'react';

// Subtle tiled background using the EMS logo as an SVG pattern
const PageBackground = () => {
    return (
        <div
            aria-hidden="true"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
            }}
        >
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    {/* 360x360 tile with a larger, centered EMS logo */}
                    <pattern id="emsPattern" width="360" height="360" patternUnits="userSpaceOnUse">
                        <g transform="translate(180, 180) scale(2)" opacity="0.08">
                            <path d="M 0,-30 L 30,0 L 0,30 L -30,0 Z" fill="#64748b" opacity="0.2" />
                            <path d="M 0,-25 L 25,0 L 0,25 L -25,0 Z" fill="none" stroke="#64748b" strokeWidth="1" />
                            <circle cx="0" cy="0" r="12" fill="none" stroke="#3b82f6" strokeWidth="2" />
                            <circle cx="0" cy="0" r="7" fill="#3b82f6" opacity="0.25" />
                            <circle cx="0" cy="0" r="4" fill="#3b82f6" />
                        </g>
                    </pattern>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#emsPattern)" />
            </svg>
        </div>
    );
};

export default PageBackground;
