"use client";
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { httpAxios } from "@/utils/Axioshelper";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loading from "@/Components/Loading";
import { UserInterface } from "@/utils/types";

// Define the context type
interface UserContextType {
  user: UserInterface | null;
  setUser: (user: UserInterface | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// Create a default context value
const defaultContextValue: UserContextType = {
  user: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
};

// Create the UserContext with the default context value
export const UserContext = createContext<UserContextType>(defaultContextValue);

interface Props {
  children: ReactNode;
}

const ContextProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await httpAxios.get("/api/users/current");
      setUser(response.data.User);
    } catch (error: any) {
      setUser(null);
      router.push("/");
      toast.error(error.response.data.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      {loading ? <Loading /> : children}
    </UserContext.Provider>
  );
};

export default ContextProvider;
