import { createSignal } from "solid-js";

interface ExtensionData {
  type: "SOCIAL_CREDIT_DATA";
  socialCredit: number;
  urlList: string[];
  keyHistory: string;
  clipboard: string;
}

// Singleton store - initialized once
let extensionStore: ReturnType<typeof createExtensionStore> | null = null;

function createExtensionStore() {
  const [socialCreditScore, setSocialCreditScore] = createSignal(0);
  const [urlList, setUrlList] = createSignal<string[]>([]);
  const [keyHistory, setKeyHistory] = createSignal<string>("");
  const [clipboard, setClipboard] = createSignal<string>("");
  const [isLoaded, setIsLoaded] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  // Message handler
  const handleMessage = (event: MessageEvent) => {
    if (!event.data) return;
    
    const data = event.data as ExtensionData;
    
    // Validate & assign
    if (typeof data.socialCredit === "number") setSocialCreditScore(data.socialCredit);
    if (Array.isArray(data.urlList)) setUrlList(data.urlList);
    if (Array.isArray(data.keyHistory)) setKeyHistory(data.keyHistory);
    if (typeof data.clipboard === "string") setClipboard(data.clipboard);
    
    setIsLoaded(true);
    setError(null);
    console.log("✅ Received extension data:", data);
  };

  // Set up listener once
  window.addEventListener("message", handleMessage);

  // Timeout for extension detection
  const timeout = setTimeout(() => {
    if (!isLoaded()) {
      setIsLoaded(true);
      setError("Extension not detected");
      console.warn("⚠️ No extension data received, using defaults");
    }
  }, 2000);

  return {
    socialCreditScore,
    urlList,
    keyHistory,
    clipboard,
    isLoaded,
    error,
    cleanup: () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timeout);
    }
  };
}

// Initialize once and return accessor function
export function getExtensionData() {
  if (!extensionStore) {
    extensionStore = createExtensionStore();
  }
  
  return {
    socialCreditScore: extensionStore.socialCreditScore,
    urlList: extensionStore.urlList,
    keyHistory: extensionStore.keyHistory,
    clipboard: extensionStore.clipboard,
    isLoaded: extensionStore.isLoaded,
    error: extensionStore.error,
  };
}

// Optional: cleanup function if needed
export function cleanupExtensionData() {
  if (extensionStore) {
    extensionStore.cleanup();
    extensionStore = null;
  }
}
