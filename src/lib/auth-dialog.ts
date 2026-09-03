/**
 * Opens the global sign-in dialog from anywhere.
 *
 * The dialog itself lives once in the root layout; callers fire this instead of
 * threading state through the tree. `view` picks which pane it lands on.
 */
export type AuthDialogView = "login" | "signup" | "therapist_signup";

export const AUTH_DIALOG_EVENT = "hpi:auth:open";

export function openAuthDialog(view: AuthDialogView = "login") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_DIALOG_EVENT, { detail: { view } }));
}
