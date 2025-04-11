import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
    exp: number;
    email: string;
    role: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<DecodedToken | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const decoded: DecodedToken = jwtDecode(token);

            // Check if token is expired
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem("token");
                router.push("/login");
            } else {
                setUser(decoded);
            }
        } catch (err) {
            console.error("Invalid token:", err);
            localStorage.removeItem("token");
            router.push("/login");
        }

        setLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        router.push("/login");
    };

    return {user, loading, logout, isAuthenticated: !!user};
};
