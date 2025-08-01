import { LiveQuote } from "@/lib/types";
import { create } from "zustand";

type QuotesStoreState = {
	liveQuotes: LiveQuote[];
	setLiveQuotes: (liveQuotes: LiveQuote[]) => void;
};

export const useQuotesStore = create<QuotesStoreState>((set) => ({
	liveQuotes: [],
	setLiveQuotes: (liveQuotes) => set({ liveQuotes }),
}));
