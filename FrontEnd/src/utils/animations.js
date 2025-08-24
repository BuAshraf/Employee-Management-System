import { gsap } from "gsap";

// Animation utilities for consistent GSAP animations across the app
export const animations = {
  // Fade in animation
  fadeIn: (element, options = {}) => {
    const defaults = {
      duration: 0.6,
      opacity: 1,
      y: 0,
      ease: "power2.out",
      delay: 0
    };
    
    gsap.fromTo(element, 
      { opacity: 0, y: 20 },
      { ...defaults, ...options }
    );
  },

  // Slide in from left
  slideInLeft: (element, options = {}) => {
    const defaults = {
      duration: 0.8,
      x: 0,
      opacity: 1,
      ease: "power3.out",
      delay: 0
    };
    
    gsap.fromTo(element, 
      { x: -50, opacity: 0 },
      { ...defaults, ...options }
    );
  },

  // Slide in from right
  slideInRight: (element, options = {}) => {
    const defaults = {
      duration: 0.8,
      x: 0,
      opacity: 1,
      ease: "power3.out",
      delay: 0
    };
    
    gsap.fromTo(element, 
      { x: 50, opacity: 0 },
      { ...defaults, ...options }
    );
  },

  // Scale in animation
  scaleIn: (element, options = {}) => {
    const defaults = {
      duration: 0.6,
      scale: 1,
      opacity: 1,
      ease: "back.out(1.7)",
      delay: 0
    };
    
    gsap.fromTo(element, 
      { scale: 0.8, opacity: 0 },
      { ...defaults, ...options }
    );
  },

  // Stagger animation for multiple elements
  staggerIn: (elements, options = {}) => {
    const defaults = {
      duration: 0.6,
      y: 0,
      opacity: 1,
      ease: "power2.out",
      stagger: 0.1
    };
    
    gsap.fromTo(elements, 
      { y: 30, opacity: 0 },
      { ...defaults, ...options }
    );
  },

  // Hover animation
  hover: (element, options = {}) => {
    const defaults = {
      duration: 0.3,
      scale: 1.05,
      ease: "power2.out"
    };
    
    gsap.to(element, { ...defaults, ...options });
  },

  // Hover out animation
  hoverOut: (element, options = {}) => {
    const defaults = {
      duration: 0.3,
      scale: 1,
      ease: "power2.out"
    };
    
    gsap.to(element, { ...defaults, ...options });
  },

  // Loading spinner
  spinner: (element) => {
    gsap.to(element, {
      rotation: 360,
      duration: 1,
      ease: "none",
      repeat: -1
    });
  },

  // Modal animations
  modalIn: (element, options = {}) => {
    const defaults = {
      duration: 0.4,
      scale: 1,
      opacity: 1,
      ease: "back.out(1.7)"
    };
    
    gsap.fromTo(element, 
      { scale: 0.8, opacity: 0 },
      { ...defaults, ...options }
    );
  },

  modalOut: (element, options = {}) => {
    const defaults = {
      duration: 0.3,
      scale: 0.8,
      opacity: 0,
      ease: "power2.in"
    };
    
    gsap.to(element, { ...defaults, ...options });
  },

  // Theme transition
  themeTransition: (isDark) => {
    const tl = gsap.timeline();
    
    tl.to("body", {
      duration: 0.3,
      backgroundColor: isDark ? "#0f172a" : "#ffffff",
      ease: "power2.inOut"
    })
    .to(".card, .bg-white, .bg-gray-50", {
      duration: 0.3,
      backgroundColor: isDark ? "#1e293b" : "#ffffff",
      ease: "power2.inOut"
    }, "-=0.2")
    .to(".text-gray-900, .text-slate-800", {
      duration: 0.3,
      color: isDark ? "#f8fafc" : "#1e293b",
      ease: "power2.inOut"
    }, "-=0.3");
    
    return tl;
  },

  // Page transition
  pageTransition: (element, options = {}) => {
    const defaults = {
      duration: 0.8,
      x: 0,
      opacity: 1,
      ease: "power3.out"
    };
    
    gsap.fromTo(element, 
      { x: 100, opacity: 0 },
      { ...defaults, ...options }
    );
  },

  // Card hover effect
  cardHover: (element) => {
    gsap.to(element, {
      duration: 0.3,
      y: -5,
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      ease: "power2.out"
    });
  },

  cardHoverOut: (element) => {
    gsap.to(element, {
      duration: 0.3,
      y: 0,
      boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
      ease: "power2.out"
    });
  },

  // Number counting animation
  countUp: (element, endValue, options = {}) => {
    const defaults = {
      duration: 2,
      ease: "power2.out"
    };
    
    const obj = { value: 0 };
    
    gsap.to(obj, {
      ...defaults,
      ...options,
      value: endValue,
      onUpdate: () => {
        element.textContent = Math.round(obj.value);
      }
    });
  },

  // Progress bar animation
  progressBar: (element, percentage, options = {}) => {
    const defaults = {
      duration: 1.5,
      ease: "power2.out"
    };
    
    gsap.to(element, {
      ...defaults,
      ...options,
      width: `${percentage}%`
    });
  }
};

// Timeline utilities
export const createTimeline = (options = {}) => {
  return gsap.timeline(options);
};

// Batch animations
export const batch = (elements, animation, options = {}) => {
  elements.forEach((element, index) => {
    animation(element, { 
      ...options, 
      delay: (options.delay || 0) + (index * (options.stagger || 0.1))
    });
  });
};

export default animations;
