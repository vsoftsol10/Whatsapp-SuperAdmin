export default function PageLoader({
  label = "Loading...",
  variant = "section",
  className = "",
  spinnerClassName = "",
  textClassName = ""
}) {
  const containerClassName =
    variant === "page"
      ? "min-h-[20rem]"
      : variant === "inline"
        ? "inline-flex"
        : "py-10";

  const spinnerSize = variant === "inline" ? "h-4 w-4 border-2" : "h-10 w-10 border-4";
  const layoutClassName = variant === "inline" ? "flex-row" : "flex-col";
  const Container = variant === "inline" ? "span" : "div";

  return (
    <Container
      className={`${containerClassName} flex ${layoutClassName} items-center justify-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`${spinnerSize} animate-spin rounded-full border-green-200 border-t-[#25D366] ${spinnerClassName}`}
        aria-hidden="true"
      />
      {label && (
        <span className={`text-sm text-gray-500 ${textClassName}`}>
          {label}
        </span>
      )}
    </Container>
  );
}
