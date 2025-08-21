import { useContext } from "react";
import type { AuthContextValue } from "../../types/auth.ts";
import { AuthContext } from "../../providers/auth";

function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export default useAuth;
