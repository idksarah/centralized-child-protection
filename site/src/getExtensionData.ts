import { createSignal, type Accessor } from "solid-js";

interface ExtensionData {
  type: "SOCIAL_CREDIT_DATA";
  socialCredit: number;
  urlList: string[];
  keyHistory: string;
  clipboard: string;
}

interface ExtensionStore {
  socialCreditScore: Accessor<number>;
  urlList: Accessor<string[]>;
  keyHistory: Accessor<string>;
  clipboard: Accessor<string>;
  isLoaded: Accessor<boolean>;
  error: Accessor<string | null>;
  cleanup: () => void;
}

// Singleton store
let extensionStore: ExtensionStore | null = null;

// Type guard for runtime validation
function isExtensionData(data: unknown): data is ExtensionData {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    d.type === "SOCIAL_CREDIT_DATA" &&
    typeof d.socialCredit === "number" &&
    Array.isArray(d.urlList) &&
    typeof d.keyHistory === "string" &&
    typeof d.clipboard === "string"
  );
}

function createExtensionStore(): ExtensionStore {
  const [socialCreditScore, setSocialCreditScore] = createSignal(0);
  const [urlList, setUrlList] = createSignal<string[]>([]);
  const [keyHistory, setKeyHistory] = createSignal<string>("");
  const [clipboard, setClipboard] = createSignal<string>("");
  const [isLoaded, setIsLoaded] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  let timeoutId: number | undefined;

  // Message handler with security validation
  const handleMessage = (event: MessageEvent) => {
    // Security: validate origin
    if (event.origin !== window.location.origin) {
      console.warn("⚠️ Ignoring message from untrusted origin:", event.origin);
      return;
    }

    console.log("🔔 Window message received:", event.data);

    if (!event.data) {
      console.log("❌ No event data");
      return;
    }

    // Type validation
    if (!isExtensionData(event.data)) {
      console.log("ℹ️ Ignoring message type:", event.data.type);
      return;
    }

    const data = event.data;
    console.log("✅ Received extension data:", data);

    // Update signals
    setSocialCreditScore(data.socialCredit);
    setUrlList(data.urlList);
    setKeyHistory(data.keyHistory);
    setClipboard(data.clipboard);
    setIsLoaded(true);
    setError(null);

    // Clear timeout since we received data
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  // Set up listener
  window.addEventListener("message", handleMessage);
  console.log("👂 Listening for extension messages");

  // Request data after listener is attached (prevent race condition)
  queueMicrotask(() => {
    console.log("📤 Requesting social credit data from extension...");
    window.postMessage(
      { type: "REQUEST_SOCIAL_CREDIT_DATA" },
      window.location.origin,
    );
  });

  // Timeout for extension detection
  timeoutId = window.setTimeout(() => {
    if (!isLoaded()) {
      setIsLoaded(true);
      setError("Extension not detected");
      console.warn("⚠️ No extension data received after 3s, using defaults");
    }
  }, 3000);

  // Cleanup function
  const cleanup = () => {
    window.removeEventListener("message", handleMessage);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    console.log("🧹 Extension store cleaned up");
  };

  return {
    socialCreditScore,
    urlList,
    keyHistory,
    clipboard,
    isLoaded,
    error,
    cleanup,
  };
}

// Get or create singleton instance
export function getExtensionData(): ExtensionStore {
  if (!extensionStore) {
    extensionStore = createExtensionStore();
  }
  return extensionStore;
}

// Cleanup and reset singleton
export function cleanupExtensionData() {
  if (extensionStore) {
    extensionStore.cleanup();
    extensionStore = null;
  }
}
