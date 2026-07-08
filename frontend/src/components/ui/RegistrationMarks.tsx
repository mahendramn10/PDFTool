/**
 * Corner crosshair marks, borrowed from print-production registration marks
 * (the alignment guides printers use to line up plates). This is PDFTool's
 * one recurring signature device -- used only on the hero and major section
 * boundaries, never scattered everywhere.
 */
export function RegistrationMarks() {
  return (
    <>
      <span className="reg-mark reg-mark-tl" aria-hidden="true" />
      <span className="reg-mark reg-mark-tr" aria-hidden="true" />
      <span className="reg-mark reg-mark-bl" aria-hidden="true" />
      <span className="reg-mark reg-mark-br" aria-hidden="true" />
    </>
  );
}
