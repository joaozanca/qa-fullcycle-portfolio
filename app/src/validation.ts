export const TITLE_MIN_LENGTH = 1;
export const TITLE_MAX_LENGTH = 100;

export function validateTitle(title: unknown): string | null {
  if (typeof title !== "string" || title.trim().length < TITLE_MIN_LENGTH) {
    return "title is required";
  }
  if (title.length > TITLE_MAX_LENGTH) {
    return `title must be at most ${TITLE_MAX_LENGTH} characters`;
  }
  return null;
}
