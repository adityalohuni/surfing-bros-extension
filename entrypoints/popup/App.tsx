import './App.css';

function App() {
  const openConsole = () => {
    const url = chrome.runtime.getURL('mcp/index.html');
    chrome.tabs.create({ url });
  };

  return (
    <div className="card">
      <h1>SurfingBro</h1>
      <p>Open the MCP console to connect your agent to the browser.</p>
      <button onClick={openConsole}>Open MCP Console</button>
    </div>
  );
}

export default App;
