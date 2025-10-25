import { createSignal } from 'solid-js';
import { fetchGPTResponse } from './FetchGPTResponse';
import textToSpeech  from './TextToSpeech';
import './App.css'
import chairman from "../assets/xi-jinping-idle.jpg";

export default function App() {
  const [userInput, setUserInput] = createSignal("");

  const [wrapperResponse, setWrapperResponse] = createSignal({
    value: ""
  });

  const [loading, setLoading] = createSignal(false);
  
  async function getResponse() {
    setLoading(true);

    const response = await fetchGPTResponse(userInput());
    setWrapperResponse(response);
    textToSpeech(response.value);
    setLoading(false);
  }

  return (
    <div id="main">
      <section id="header">
        <h2 id="title">centralized child protection</h2>
      </section>
      <img src={chairman} id="chairman"></img>
      <section id="yap">
        <textarea
          value={userInput()}
          onInput={(ev) => setUserInput(ev.target.value)}
          id="input"
        ></textarea>
        <button onClick={getResponse} disabled={loading()}>
          Get
        </button>
      </section>
      
        {!loading() && wrapperResponse().value && (
          <>
            <p id="wrapperResponse">{wrapperResponse().value}</p>
          </>
        )}
        {/* and a container where the GPT response will be rendered. */}
    </div>
  );
}