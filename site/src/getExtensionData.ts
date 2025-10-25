import { createSignal, onMount } from "solid-js";

interface ExtensionData {
  type: "SOCIAL_CREDIT_DATA";
  socialCredit: number;
  urlList: string[];
  keyHistory: string;
  clipboard: string;
}

export function getExtensionData() {
  const [socialCreditScore, setSocialCreditScore] = createSignal(0);
  const [urlList, setUrlList] = createSignal<string[]>([]);
  const [keyHistory, setKeyHistory] = createSignal<string>("");
  const [clipboard, setClipboard] = createSignal<string | null>(null);
  const [isLoaded, setIsLoaded] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  onMount(() => {
    // 🔹 Listen for window messages from the content script
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window) return;
      if (!event.data || event.data.type !== "SOCIAL_CREDIT_DATA") return;

      const data = event.data as ExtensionData;

      // Validate & assign
      if (typeof data.socialCredit === "number")
        setSocialCreditScore(data.socialCredit);
      if (Array.isArray(data.urlList)) setUrlList(data.urlList);
      if (Array.isArray(data.keyHistory)) setKeyHistory(data.keyHistory);
      if (typeof data.clipboard === "string") setClipboard(data.clipboard);

      setIsLoaded(true);
      setError(null);

      console.log("✅ Received extension data:", data);
    };

    window.addEventListener("message", handleMessage);

    // if no extension detected
    const timeout = setTimeout(() => {
      if (!isLoaded()) {
        setIsLoaded(true);
        setError("Extension not detected");
        console.warn("⚠️ No extension data received, using defaults");
      }
    }, 2000);

    // Cleanup
    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timeout);
    };
  });

  return {
    socialCreditScore,
    urlList,
    keyHistory,
    clipboard,
    isLoaded,
    error,
  };
}
