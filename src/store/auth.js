import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

const useAuthStore = create((set, get) => ({
    allUserData: null,
    loading: false,

    user: () => {
        const currentState = get();
        return {
        user_id: currentState.allUserData?.user_id || null,
        username: currentState.allUserData?.username || null,
        };
    },

    setUser: (user) => set({ allUserData: user }),

    setLoading: (loading) => set({ loading }),

    isLoggedIn: () => get().allUserData !== null,
}));

if (import.meta.env.DEV) {
    mountStoreDevtool("Auth Store", useAuthStore);
}

export { useAuthStore };