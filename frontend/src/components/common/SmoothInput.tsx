import React, {
  type ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { cn } from "../../lib/utils";

export type InputFieldProps = ComponentPropsWithoutRef<"input"> & {
  wrapperClassName?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
};

export type SmoothInputProps = InputFieldProps;

const PASSWORD_CHAR =
  typeof navigator !== "undefined" && navigator.userAgent.match(/firefox|fxios/i)
    ? "\u25CF"
    : "\u2022";

export const SmoothInput = forwardRef<HTMLInputElement, SmoothInputProps>(
  (
    {
      className,
      wrapperClassName,
      leftElement,
      rightElement,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      onSelect,
      onClick,
      onKeyUp,
      onKeyDown,
      type = "text",
      placeholder,
      style,
      disabled,
      inputMode,
      autoComplete,
      ...props
    },
    forwardedRef
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const caretX = useMotionValue(0);
    const caretOpacity = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);
    const prefersReducedMotion = useReducedMotion();

    useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement);

    const isControlled = value !== undefined;
    const inputValue = isControlled ? String(value ?? "") : String(internalValue);

    // Resolve input type: HTML5 email/number input types block selectionStart in Chromium.
    // Mapping them to text with appropriate inputMode restores full character tracking and cursor placement.
    const isEmail = type === "email";
    const isNumber = type === "number";
    const resolvedType = isEmail || isNumber ? "text" : type;
    const resolvedInputMode = isEmail
      ? "email"
      : isNumber
      ? "numeric"
      : inputMode;
    const resolvedAutoComplete = isEmail && !autoComplete ? "email" : autoComplete;

    const springCaretX = useSpring(
      caretX,
      prefersReducedMotion
        ? { stiffness: 10000, damping: 100, mass: 0.1 }
        : { stiffness: 600, damping: 35, mass: 0.3 }
    );

    const syncMeasureSpan = () => {
      const input = inputRef.current;
      const measureSpan = measureRef.current;
      if (!input || !measureSpan) return;

      const styles = window.getComputedStyle(input);
      const isPassword = type === "password";

      let fontSize = styles.fontSize;
      if (
        PASSWORD_CHAR === "\u2022" &&
        isPassword &&
        typeof navigator !== "undefined" &&
        !navigator.userAgent.match(/chrome|chromium|crios/i)
      ) {
        fontSize = `${parseFloat(fontSize) + 6.25}px`;
      }

      measureSpan.style.fontFamily = styles.fontFamily;
      measureSpan.style.fontSize = fontSize;
      measureSpan.style.fontWeight = styles.fontWeight;
      measureSpan.style.fontStyle = styles.fontStyle;
      measureSpan.style.letterSpacing = styles.letterSpacing;
      measureSpan.style.fontFeatureSettings = styles.fontFeatureSettings;
      measureSpan.style.fontVariationSettings = styles.fontVariationSettings;
      measureSpan.style.textTransform = styles.textTransform;
      measureSpan.style.whiteSpace = "pre";
    };

    const measurePrefixWidth = (text: string) => {
      const input = inputRef.current;
      const measureSpan = measureRef.current;
      if (!input || !measureSpan) return null;

      syncMeasureSpan();
      measureSpan.textContent = text;

      const paddingLeft =
        parseFloat(window.getComputedStyle(input).paddingLeft) || 0;

      const textWidth =
        measureSpan.getBoundingClientRect().width || measureSpan.offsetWidth;

      return text.length > 0 ? textWidth + paddingLeft : paddingLeft;
    };

    const scrollCaretIntoView = (
      target: HTMLInputElement,
      absoluteWidth: number
    ) => {
      const styles = window.getComputedStyle(target);
      const paddingLeft = parseFloat(styles.paddingLeft) || 0;
      const paddingRight = parseFloat(styles.paddingRight) || 0;
      const maxScroll = Math.max(0, target.scrollWidth - target.clientWidth);
      const visibleRight = target.scrollLeft + target.clientWidth - paddingRight;
      const visibleLeft = target.scrollLeft + paddingLeft;

      if (absoluteWidth > visibleRight) {
        target.scrollLeft = Math.min(
          absoluteWidth - target.clientWidth + paddingRight,
          maxScroll
        );
        return;
      }

      if (absoluteWidth < visibleLeft) {
        target.scrollLeft = Math.max(0, absoluteWidth - paddingLeft);
      }
    };

    const getCaretIndex = (target: HTMLInputElement) => {
      try {
        const start = target.selectionStart;
        if (start !== null && start !== undefined) {
          const end = target.selectionEnd ?? start;
          return target.selectionDirection === "backward" ? start : end;
        }
      } catch {}
      return (target.value || "").length;
    };

    const updateCaretFromInput = (target: HTMLInputElement) => {
      let hasSelection = false;
      let caretIndex = 0;
      try {
        const start = target.selectionStart;
        const end = target.selectionEnd;
        if (start !== null && start !== undefined) {
          hasSelection = start !== end;
          caretIndex = getCaretIndex(target);
        } else {
          caretIndex = (target.value || "").length;
        }
      } catch {
        caretIndex = (target.value || "").length;
      }

      const isPassword = type === "password";
      const val = target.value || "";
      const textBeforeCaret = isPassword
        ? PASSWORD_CHAR.repeat(caretIndex)
        : val.slice(0, caretIndex);

      const absoluteWidth = measurePrefixWidth(textBeforeCaret);
      if (absoluteWidth === null) return;

      scrollCaretIntoView(target, absoluteWidth);

      const styles = window.getComputedStyle(target);
      const paddingLeft = parseFloat(styles.paddingLeft) || 0;
      const paddingRight = parseFloat(styles.paddingRight) || 0;
      const caretPosition = absoluteWidth - target.scrollLeft;
      const minX = paddingLeft;
      const maxX = target.clientWidth - paddingRight;
      const isCaretVisible =
        caretPosition >= minX - 2 && caretPosition <= maxX + 2;

      caretX.set(Math.min(Math.max(caretPosition, minX), maxX));

      if (!isCaretVisible || hasSelection) {
        caretOpacity.set(0);
        return;
      }

      caretOpacity.set(1);
    };

    const updateCaretRef = useRef(updateCaretFromInput);
    updateCaretRef.current = updateCaretFromInput;
    const caretOpacityRef = useRef(caretOpacity);
    caretOpacityRef.current = caretOpacity;

    useEffect(() => {
      const input = inputRef.current;
      if (input && document.activeElement === input) {
        updateCaretRef.current(input);
      }
    }, [inputValue, type]);

    useEffect(() => {
      const input = inputRef.current;
      const container = containerRef.current;
      if (!input || !container) return;

      const updateCaretIfFocused = () => {
        if (document.activeElement === input) {
          updateCaretRef.current(input);
        }
      };

      const handleSelectionChange = () => {
        if (document.activeElement !== input) return;

        requestAnimationFrame(() => {
          if (document.activeElement === input) {
            updateCaretRef.current(input);
          }
        });
      };

      document.addEventListener("selectionchange", handleSelectionChange);
      if ("fonts" in document) {
        document.fonts.addEventListener("loadingdone", updateCaretIfFocused);
        void document.fonts.ready.then(updateCaretIfFocused);
      }
      input.addEventListener("scroll", updateCaretIfFocused);

      const resizeObserver = new ResizeObserver(updateCaretIfFocused);
      resizeObserver.observe(container);

      return () => {
        document.removeEventListener("selectionchange", handleSelectionChange);
        if ("fonts" in document) {
          document.fonts.removeEventListener("loadingdone", updateCaretIfFocused);
        }
        input.removeEventListener("scroll", updateCaretIfFocused);
        resizeObserver.disconnect();
      };
    }, []);

    return (
      <div
        className={cn(
          "group relative flex items-center w-full rounded-xl bg-surface border border-border shadow-sm transition-all duration-200",
          "focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 hover:border-brand-primary/40",
          disabled && "opacity-60 cursor-not-allowed bg-background-muted",
          wrapperClassName
        )}
      >
        {leftElement && (
          <div className="flex items-center pl-3.5 pr-1 text-content-muted pointer-events-none">
            {leftElement}
          </div>
        )}

        <div
          ref={containerRef}
          className="relative grid grid-cols-1 p-0 flex-1 min-w-0 items-center overflow-hidden"
          style={{ caretColor: "transparent" }}
        >
          <input
            {...props}
            ref={inputRef}
            type={resolvedType}
            inputMode={resolvedInputMode}
            autoComplete={resolvedAutoComplete}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              "w-full bg-transparent outline-none py-2.5 sm:py-3 text-content-primary placeholder:text-content-muted/60 text-sm md:text-base",
              "col-start-1 col-end-2 row-start-1 row-end-2",
              leftElement ? "pl-2 pr-4" : rightElement ? "pl-4 pr-2" : "px-4",
              className
            )}
            style={style}
            value={inputValue}
            onChange={(e) => {
              if (!isControlled) setInternalValue(e.target.value);
              onChange?.(e);
              const target = e.currentTarget;
              requestAnimationFrame(() => {
                updateCaretRef.current(target);
              });
            }}
            onFocus={(e) => {
              const target = e.currentTarget;
              requestAnimationFrame(() => {
                updateCaretRef.current(target);
              });
              onFocus?.(e);
            }}
            onBlur={(e) => {
              caretOpacityRef.current.set(0);
              onBlur?.(e);
            }}
            onSelect={(e) => {
              updateCaretRef.current(e.currentTarget);
              onSelect?.(e);
            }}
            onClick={(e) => {
              updateCaretRef.current(e.currentTarget);
              onClick?.(e);
            }}
            onKeyUp={(e) => {
              updateCaretRef.current(e.currentTarget);
              onKeyUp?.(e);
            }}
            onKeyDown={(e) => {
              const target = e.currentTarget;
              requestAnimationFrame(() => {
                updateCaretRef.current(target);
              });
              onKeyDown?.(e);
            }}
          />

          <span
            ref={measureRef}
            aria-hidden="true"
            className="pointer-events-none invisible absolute top-0 left-0 whitespace-pre"
          />

          <motion.div
            aria-hidden="true"
            className="bg-brand-primary pointer-events-none col-start-1 col-end-2 row-start-1 row-end-2 h-[1.15em] w-[2px] rounded-full self-center justify-self-start"
            style={{ x: springCaretX, opacity: caretOpacity }}
          />
        </div>

        {rightElement && (
          <div className="flex items-center pr-3.5 pl-1">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);

SmoothInput.displayName = "SmoothInput";

export const Input = SmoothInput;

export const Skiper106 = () => {
  return (
    <div className="bg-background text-content-primary flex h-full w-full flex-col items-center justify-center p-6">
      <div className="mb-8 grid content-start justify-items-center gap-4 text-center">
        <span className="text-xs uppercase tracking-wider text-content-muted">
          Try typing below
        </span>
      </div>
      <div className="flex w-full max-w-[420px] flex-col items-center space-y-4">
        <SmoothInput placeholder="Smooth caret input..." aria-label="Smooth caret input" />
      </div>
    </div>
  );
};

export { SmoothInput as default };
