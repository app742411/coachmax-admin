import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMyProfile } from "../api/userApi";

interface UserData {
 _id: string;
 name: string;
 email: string;
 mobile?: string;
 role: string;
 profileImg?: string;
 isOtpVerified?: boolean;
 [key: string]: any;
}

interface UserContextType {
 user: UserData | null;
 loading: boolean;
 refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 const [user, setUser] = useState<UserData | null>(null);
 const [loading, setLoading] = useState(true);

 const refreshProfile = useCallback(async () => {
  try {
   const res = await getMyProfile();
   if (res.success && res.data) {
    const profileData = {
     ...res.data,
     profileImg: res.profileImg || res.data.profile || res.data.adminProfileImg
    };
    setUser(profileData);
    localStorage.setItem("user", JSON.stringify(profileData));
   }
  } catch (err) {
   console.error("Failed to fetch profile:", err);
  } finally {
   setLoading(false);
  }
 }, []);

 useEffect(() => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
   refreshProfile();
  } else {
   setLoading(false);
  }
 }, [refreshProfile]);

 return (
  <UserContext.Provider value={{ user, loading, refreshProfile }}>
   {children}
  </UserContext.Provider>
 );
};

export const useUser = () => {
 const context = useContext(UserContext);
 if (context === undefined) {
  throw new Error("useUser must be used within a UserProvider");
 }
 return context;
};
