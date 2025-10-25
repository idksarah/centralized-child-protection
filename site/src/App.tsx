import { createSignal } from 'solid-js'
import { render } from 'solid-js/web';
import { getExtensionData } from './getExtensionData';
import { fetchGPTResponse } from './FetchGPTResponse';
import './App.css'

export default function App() {
  const [userInput, setUserInput] = createSignal("");

  const [wrapperResponse, setWrapperResponse] = createSignal({
    value: ""
  });

  const [loading, setLoading] = createSignal(false);
  
  // EXTENSION DATA YAYAYA
  const { socialCreditScore, urlList,  isLoaded } = getExtensionData();
  
  async function getResponse() {
    setLoading(true);
    
    const response = await fetchGPTResponse(userInput(), socialCreditScore(), urlList());
    // const response = await fetchGPTResponse(userInput());
    setWrapperResponse(response);
    setLoading(false);
  }

  return (
    <div class="bg-white shadow-md rounded-lg p-8 m-auto max-w-lg">
      <textarea
        value={userInput()}
        onChange={(ev) => setUserInput(ev.target.value)}
      ></textarea>
      <button onClick={getResponse} disabled={loading()}>
        Get
      </button>
      {!loading() && wrapperResponse().value && (
        <>
          <p class="bg-gray-100">{wrapperResponse().value}</p>
        </>
      )}
      {/* and a container where the GPT response will be rendered. */}
    </div>
  );
}