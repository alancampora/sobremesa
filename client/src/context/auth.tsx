import { fetchLogout, fetchMe } from "@/api/auth";
import React, { createContext, useContext, useState, useEffect } from "react";

type LogoutParams = {
  finallyCallback: Function;
};
interface AuthContextType {
  user: any; // Replace `any` with your user type
  refetchUser: () => Promise<void>;
  loading: boolean;
  logout: (params: LogoutParams) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    await fetchMe({
      successCallback: (data: any) => {
        setUser(data.user);
        setLoading(false);
      },
      errorCallback: () => {
        setUser(null);
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = (params: LogoutParams) => {
    setUser(null);
    fetchLogout({ ...params });
  };

  const refetchUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, refetchUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
