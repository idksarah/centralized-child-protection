import { createSignal, For, onMount, onCleanup } from "solid-js";
import { fetchGPTResponse } from "./FetchGPTResponse";
import textToSpeech from "./TextToSpeech";
import "./App.css";
import chairmanTop from "../assets/jinping-top.png";
import { getExtensionData } from "./getExtensionData";
import chairmanIdle from "../assets/xi-jinping-main-1.png";
import chairmanGif from "../assets/xi-jinping-wiggle-bobble.gif"
import send from "../assets/send-white-icon.png";
import userPlaceholder from "../assets/xi-jinping-idle.jpg"; // generic avatar

export default function App() {
  const [messages, setMessages] = createSignal<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [userInput, setUserInput] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [chairmanActive, setChairmanActive] = createSignal(false);


  const placeholderUsers = Array.from({ length: 10 }, (_, i) => ({
    name: `User ${i + 1}`,
    message: "Recent message...",
  }));

  const { socialCreditScore, urlList, keyHistory, clipboard, isLoaded } =
    getExtensionData();

  async function getResponse() {
    const input = userInput().trim();
    setUserInput("");
    if (!input) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: input }]);

    // Show typing dots
    setChairmanActive(true);
    setLoading(true);

    let responseValue: string | null = null;
    let newSocialCredit: number | null = null;

    try {
      const response = await fetchGPTResponse(
        input,
        socialCreditScore(),
        urlList(),
        keyHistory(),
        clipboard(),
      );

      responseValue = response.value + "Your new social credit is " + response.newSocialCredit;
      newSocialCredit = response.newSocialCredit;
      console.log("new social credit: ", newSocialCredit)
      window.postMessage(
        {
          type: "UPDATE_SOCIAL_CREDIT",
          socialCredit: newSocialCredit,
          lastPrompt: input,
        },
        window.location.origin
      );

      // Add assistant message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: responseValue ?? "" },
      ]);
    } catch (error) {
      console.error("Error fetching GPT response:", error);
    } finally {
      setLoading(false);
    }

    // Handle TTS separately
    if (responseValue) {
      try {
        await textToSpeech(responseValue);
        setChairmanActive(false);
      } catch (error) {
        console.error("TTS error:", error);
      }
    }
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      console.log("gooning");
      getResponse();
    }
  };

  function TypingDots() {
    const [dots, setDots] = createSignal(".");

    let interval: number;

    onMount(() => {
      interval = window.setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
      }, 500);
    });

    onCleanup(() => clearInterval(interval));

    return <div class="assistant typing">{dots()}</div>;
  }

  return (
    <>
      <div id="wechat-layout">
        {/* Far-left user sidebar */}
        <aside id="profile-sidebar">
          <img
            src={chairmanTop}
            class={'avatar-main'}
            alt="profile"
          />
        </aside>

        {/* Middle chat list sidebar */}
        <aside id="chatlist-sidebar">
          <div class="search">Search</div>
          <For each={placeholderUsers}>
            {(u) => (
              <div class="chat-item">
                <img src={userPlaceholder} class="chat-avatar" alt="user" />
                <div class="chat-info">
                  <strong>{u.name}</strong>
                  <p>{u.message}</p>
                </div>
              </div>
            )}
          </For>
        </aside>

        {/* Main chat window */}
        <main id="main">
          <section id="header">
            <h2 id="title">centralized child protection</h2>
          </section>

          <section id="chat-container">
            <div id="chat-box">
              <For each={messages()}>
                {(msg) => (
                  <div
                    class={`message-row ${
                      msg.role === "user" ? "user-row" : "assistant-row"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <img
                        src={chairmanActive() ? chairmanGif : chairmanIdle}
                        class="avatar"
                        alt="assistant avatar"
                      />
                    )}
                    <div
                      class={`message ${
                        msg.role === "user" ? "user" : "assistant"
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.role === "user" && (
                      <img
                        src={chairmanIdle}
                        class={`avatar`}
                        alt="user avatar"
                      />
                    )}
                  </div>
                )}
              </For>
              {loading() && (
                <div class="message-row assistant-row">
                  <img
                    src={chairmanActive() ? chairmanGif : chairmanIdle}
                    class="avatar"
                    alt="assistant avatar"
                  />
                  <TypingDots />
                </div>
              )}
            </div>

            <div id="input-area">
              <textarea
                value={userInput()}
                onInput={(ev) => setUserInput(ev.target.value)}
                onKeyDown={handleKeyPress}
                id="input"
                placeholder="Type your message..."
              ></textarea>
              <img src={send} class="send" onClick={getResponse} />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
