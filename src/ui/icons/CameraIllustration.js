/**
 * Retro Camera Illustration Component
 * SVG-based vintage camera design inspired by Nivedha's TV illustration
 * Adapted for photography portfolio
 */

export function CameraIllustration() {
  return `
    <div class="camera-container" aria-hidden="true">
      <svg class="camera-svg" viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Camera Body -->
        <rect x="40" y="80" width="220" height="140" rx="8" fill="#D4AF37" stroke="#8B7500" stroke-width="3"/>
        
        <!-- Leather Texture Pattern -->
        <rect x="45" y="85" width="210" height="130" rx="6" fill="#2C2416" opacity="0.9"/>
        
        <!-- Lens Mount Circle -->
        <circle cx="150" cy="150" r="50" fill="#1A1814" stroke="#8B7500" stroke-width="3"/>
        
        <!-- Lens Glass -->
        <circle cx="150" cy="150" r="40" fill="url(#lensGradient)"/>
        <circle cx="150" cy="150" r="35" fill="url(#glassGradient)" opacity="0.6"/>
        
        <!-- Lens Reflection -->
        <ellipse cx="135" cy="135" rx="15" ry="20" fill="white" opacity="0.4"/>
        <ellipse cx="145" cy="145" rx="8" ry="10" fill="white" opacity="0.2"/>
        
        <!-- Viewfinder -->
        <rect x="190" y="90" width="50" height="35" rx="4" fill="#3A3226" stroke="#8B7500" stroke-width="2"/>
        <rect x="195" y="95" width="40" height="25" rx="2" fill="#1A1814"/>
        
        <!-- Shutter Button -->
        <circle cx="75" cy="105" r="8" fill="#C41E3A" stroke="#8B1C2E" stroke-width="2"/>
        
        <!-- Film Winder -->
        <circle cx="215" cy="105" r="12" fill="#8B7500"/>
        <circle cx="215" cy="105" r="8" fill="#D4AF37"/>
        <path d="M 215 97 L 215 113 M 207 105 L 223 105" stroke="#2C2416" stroke-width="2" stroke-linecap="round"/>
        
        <!-- Brand Plate -->
        <rect x="70" y="165" width="60" height="18" rx="2" fill="#8B7500"/>
        <text x="100" y="177" font-family="var(--font-serif)" font-size="10" fill="#D4AF37" text-anchor="middle" font-weight="600">RETRO</text>
        
        <!-- Strap Attachments -->
        <rect x="50" y="75" width="12" height="8" rx="2" fill="#8B7500"/>
        <rect x="238" y="75" width="12" height="8" rx="2" fill="#8B7500"/>
        
        <!-- Hot Shoe Mount -->
        <rect x="130" y="73" width="40" height="8" rx="1" fill="#1A1814" stroke="#8B7500" stroke-width="1.5"/>
        
        <!-- Mode Dial -->
        <circle cx="60" cy="135" r="15" fill="#3A3226" stroke="#8B7500" stroke-width="2"/>
        <circle cx="60" cy="135" r="10" fill="#1A1814"/>
        <line x1="60" y1="125" x2="60" y2="130" stroke="#D4AF37" stroke-width="2" stroke-linecap="round"/>
        
        <!-- Control Buttons -->
        <rect x="72" y="190" width="15" height="8" rx="2" fill="#3A3226"/>
        <rect x="92" y="190" width="15" height="8" rx="2" fill="#3A3226"/>
        <rect x="112" y="190" width="15" height="8" rx="2" fill="#3A3226"/>
        
        <!-- Flash symbol on viewfinder (optional detail) -->
        <path d="M 215 103 L 218 108 L 212 108 L 215 113" fill="#F4D35E" opacity="0.0" class="flash-indicator"/>
        
        <!-- Gradients -->
        <defs>
          <radialGradient id="lensGradient">
            <stop offset="0%" stop-color="#4A6FA5"/>
            <stop offset="50%" stop-color="#2C3E50"/>
            <stop offset="100%" stop-color="#1A1814"/>
          </radialGradient>
          
          <radialGradient id="glassGradient">
            <stop offset="0%" stop-color="rgba(135, 206, 235, 0.3)"/>
            <stop offset="100%" stop-color="rgba(74, 111, 165, 0.1)"/>
          </radialGradient>
        </defs>
      </svg>
    </div>
  `;
}
