// Accessibility Level Utilities
// Based on WCAG 2.1 guidelines

export interface AccessibilityLevel {
  level: "AAA" | "AA" | "Fail";
  type: "Normal" | "Large";
  description: string;
  color: string;
  icon: "check" | "x" | "warning";
}

export function getAccessibilityLevel(
  contrastRatio: number
): AccessibilityLevel {
  if (contrastRatio >= 7.0) {
    return {
      level: "AAA",
      type: "Normal",
      description: "Excellent contrast - meets AAA standards for normal text",
      color: "text-green-600",
      icon: "check",
    };
  } else if (contrastRatio >= 4.5) {
    return {
      level: "AA",
      type: "Normal",
      description: "Good contrast - meets AA standards for normal text",
      color: "text-green-600",
      icon: "check",
    };
  } else if (contrastRatio >= 3.0) {
    return {
      level: "AA",
      type: "Large",
      description:
        "Acceptable contrast - meets AA standards for large text only",
      color: "text-yellow-600",
      icon: "warning",
    };
  } else {
    return {
      level: "Fail",
      type: "Normal",
      description: "Poor contrast - does not meet accessibility standards",
      color: "text-red-600",
      icon: "x",
    };
  }
}

export function getContrastStatus(contrastRatio: number): {
  passes: boolean;
  status: string;
  color: string;
} {
  if (contrastRatio >= 4.5) {
    return {
      passes: true,
      status: "Pass",
      color: "text-green-600",
    };
  } else {
    return {
      passes: false,
      status: "Fail",
      color: "text-red-600",
    };
  }
}

export function getWCAGCompliance(contrastRatio: number): {
  AA: { normal: boolean; large: boolean };
  AAA: { normal: boolean; large: boolean };
} {
  return {
    AA: {
      normal: contrastRatio >= 4.5,
      large: contrastRatio >= 3.0,
    },
    AAA: {
      normal: contrastRatio >= 7.0,
      large: contrastRatio >= 4.5,
    },
  };
}

export function formatContrastRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

export function getAccessibilityBadge(contrastRatio: number): {
  text: string;
  color: string;
  bgColor: string;
} {
  if (contrastRatio >= 7.0) {
    return {
      text: "AAA",
      color: "text-white",
      bgColor: "bg-green-600",
    };
  } else if (contrastRatio >= 4.5) {
    return {
      text: "AA",
      color: "text-white",
      bgColor: "bg-blue-600",
    };
  } else if (contrastRatio >= 3.0) {
    return {
      text: "AA Large",
      color: "text-white",
      bgColor: "bg-yellow-600",
    };
  } else {
    return {
      text: "Fail",
      color: "text-white",
      bgColor: "bg-red-600",
    };
  }
}
