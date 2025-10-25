import { createSignal, For } from "solid-js";
import { fetchGPTResponse } from "./FetchGPTResponse";
import textToSpeech from "./TextToSpeech";
import "./App.css";
import chairmanTop from "../assets/jinping-top.png";
import { getExtensionData } from "./getExtensionData";
import chairmanBottom from "../assets/jinping-bottom.png";
import send from "../assets/send-white-icon.png";
import userPlaceholder from "../assets/xi-jinping-idle.jpg"; // generic avatar

export default function App() {
  const [messages, setMessages] = createSignal<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [userInput, setUserInput] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const placeholderUsers = Array.from({ length: 10 }, (_, i) => ({
    name: `User ${i + 1}`,
    message: "Recent message...",
  }));
  
  const { socialCreditScore, urlList, keyHistory, clipboard, isLoaded } = getExtensionData();

  async function getResponse() {
    const input = userInput().trim();
    if (!input) return;

    setMessages([...messages(), { role: "user", text: input }]);
    setUserInput("");

    const response = await fetchGPTResponse(userInput(), socialCreditScore(), urlList(), keyHistory(), clipboard());
    // const response = await fetchGPTResponse(userInput());
    setMessages([...messages(), { role: "assistant", text: response.value }]);
    setLoading(true);
    await textToSpeech(response.value);
    setLoading(false);
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      console.log("gooning");
      getResponse();
    }
  }

  return (
    <>
    <div id="wechat-layout">
      {/* Far-left user sidebar */}
      <aside id="profile-sidebar">
        <img
          src={chairmanTop}
          class={`avatar-main ${loading() ? "floating" : ""}`}
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
                      src={chairmanBottom}
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
                      src={userPlaceholder}
                      class={`avatar ${loading() ? "floating" : ""}`}
                      alt="user avatar"
                    />
                  )}
                </div>
              )}
            </For>
            {loading() && <div class="assistant typing">...</div>}
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
