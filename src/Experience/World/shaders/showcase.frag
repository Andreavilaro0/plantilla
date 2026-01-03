uniform sampler2D uTexture;
uniform float uHover;
uniform float uOpacity;
uniform float uTime;

varying vec2 vUv;

// Function to draw a circle (for fake UI buttons)
float circle(vec2 uv, vec2 center, float radius) {
  float dist = distance(uv, center);
  return 1.0 - smoothstep(radius - 0.002, radius + 0.002, dist);
}

void main() {
  // Sample the artwork texture
  vec4 texColor = texture2D(uTexture, vUv);
  
  // Define frame dimensions
  float borderWidth = 0.015;
  float headerHeight = 0.08;
  
  // Detect if we're in the border region
  float leftBorder = step(vUv.x, borderWidth);
  float rightBorder = step(1.0 - borderWidth, vUv.x);
  float bottomBorder = step(vUv.y, borderWidth);
  float topBorder = step(1.0 - borderWidth - headerHeight, vUv.y);
  
  float isInBorder = max(max(leftBorder, rightBorder), max(bottomBorder, topBorder));
  
  // Detect header bar (top area)
  float isInHeader = step(1.0 - headerHeight, vUv.y);
  
  // Frame colors (Blender-style gray)
  vec3 frameColor = vec3(0.25, 0.25, 0.27); // Medium gray for border
  vec3 headerColor = vec3(0.18, 0.18, 0.20); // Darker gray for header
  
  // Add subtle gradient to header for depth
  float headerGradient = smoothstep(1.0 - headerHeight, 1.0, vUv.y);
  headerColor += vec3(0.02) * headerGradient;
  
  // Fake UI buttons in header (3 circles on the left)
  float button1 = 0.0;
  float button2 = 0.0;
  float button3 = 0.0;
  
  if (isInHeader > 0.5) {
    float buttonY = 1.0 - headerHeight * 0.5;
    float buttonRadius = 0.01;
    float buttonSpacing = 0.025;
    
    button1 = circle(vUv, vec2(0.04, buttonY), buttonRadius);
    button2 = circle(vUv, vec2(0.04 + buttonSpacing, buttonY), buttonRadius);
    button3 = circle(vUv, vec2(0.04 + buttonSpacing * 2.0, buttonY), buttonRadius);
  }
  
  // Button colors
  vec3 buttonColor1 = vec3(0.85, 0.35, 0.35); // Red (close)
  vec3 buttonColor2 = vec3(0.85, 0.70, 0.35); // Yellow (minimize)
  vec3 buttonColor3 = vec3(0.45, 0.75, 0.45); // Green (maximize)
  
  // Hover glow effect (warm orange)
  vec3 hoverGlow = vec3(0.8, 0.5, 0.2);
  float glowIntensity = uHover * 0.3;
  
  // Compose final color
  vec3 finalColor = texColor.rgb;
  
  // Apply header
  if (isInHeader > 0.5) {
    finalColor = headerColor;
    
    // Add buttons
    finalColor = mix(finalColor, buttonColor1, button1);
    finalColor = mix(finalColor, buttonColor2, button2);
    finalColor = mix(finalColor, buttonColor3, button3);
    
    // Add hover glow to header
    finalColor += hoverGlow * glowIntensity * 0.5;
  }
  
  // Apply border frame
  if (isInBorder > 0.5 && isInHeader < 0.5) {
    finalColor = frameColor;
    
    // Add hover glow to border
    finalColor += hoverGlow * glowIntensity;
  }
  
  // Subtle inner shadow on content area for depth
  if (isInBorder < 0.5 && isInHeader < 0.5) {
    float innerShadow = 1.0 - smoothstep(borderWidth, borderWidth + 0.03, min(
      min(vUv.x, 1.0 - vUv.x),
      min(vUv.y, 1.0 - headerHeight - vUv.y)
    ));
    finalColor *= 1.0 - innerShadow * 0.15;
  }
  
  // Apply overall opacity for fade-in animation
  float alpha = uOpacity;
  
  gl_FragColor = vec4(finalColor, alpha);
}
