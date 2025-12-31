"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface User {
	id: string;
	email: string;
	name: string | null;
	image: string | null;
}

interface Session {
	user: User;
}

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

interface SessionContextType {
	session: Session | null;
	status: SessionStatus;
	refresh: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
	session: null,
	status: "loading",
	refresh: async () => {},
});

export function useSession() {
	return useContext(SessionContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<Session | null>(null);
	const [status, setStatus] = useState<SessionStatus>("loading");

	const refresh = async () => {
		try {
			setStatus("loading");
			const res = await fetch("/api/auth/session");
			const data = await res.json();
			if (data.user) {
				setSession({ user: data.user });
				setStatus("authenticated");
			} else {
				setSession(null);
				setStatus("unauthenticated");
			}
		} catch {
			setSession(null);
			setStatus("unauthenticated");
		}
	};

	useEffect(() => {
		refresh();
	}, []);

	return (
		<SessionContext.Provider value={{ session, status, refresh }}>
			{children}
		</SessionContext.Provider>
	);
}
