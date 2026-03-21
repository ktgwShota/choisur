export type ActionState<T = unknown> =
  | { success: true; data: T; error?: never; details?: unknown }
  | { success: false; error: string; data?: never; details?: unknown };
