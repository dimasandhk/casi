## 2024-04-08 - Added Keyboard Accessibility and ARIA Label to Dropzone
**Learning:** React-dropzone components act as interactive areas but often lack visible focus states by default. Adding `focus-visible` ensures keyboard users can tell when the dropzone is focused, and `aria-label` provides necessary context to screen readers.
**Action:** Always ensure that custom interactive components like dropzones have distinct `focus-visible` styles and proper ARIA labels for accessibility.
