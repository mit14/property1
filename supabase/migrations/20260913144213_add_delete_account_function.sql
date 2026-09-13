/*
# Add delete_user_account function

1. New Functions
- `delete_user_account()` — SECURITY DEFINER function that deletes the authenticated user's profile row and all their data (properties cascade-delete child rows), then removes the auth.users entry.
2. Security
- SECURITY DEFINER so it can delete from auth.users (which the authenticated role cannot do directly).
- Scoped to auth.uid() — only deletes the calling user's own data.
*/

CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  DELETE FROM profiles WHERE id = current_user_id;
  DELETE FROM auth.users WHERE id = current_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION delete_user_account() TO authenticated;
