-- Add a role for server-side authorization. Existing users default to EDITOR.
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'EDITOR';

CREATE INDEX "User_role_status_idx" ON "User"("role", "status");
