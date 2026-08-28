/**
 * Safe wrapper around the Web Vibration API to provide
 * haptic feedback during mobile wallet interactions.
 */
export const Haptics = {
  /**
   * Subtle vibration for standard interactions (e.g. button click)
   */
  impact: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  },

  /**
   * Double-pulse vibration indicating a successful transaction
   */
  success: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([20, 50, 30]);
    }
  },

  /**
   * Long vibration pattern indicating an error or failure
   */
  error: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 30, 100, 30, 100]);
    }
  },

  /**
   * Soft warning pulse
   */
  warning: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([40, 40, 40]);
    }
  }
};