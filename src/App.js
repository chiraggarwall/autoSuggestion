import "./App.css";
import { useState, useRef, useEffect } from "react";

// Mock Server
const FAILURE_COUNT = 10;
const LATENCY = 200;

function getRandomBool(n) {
  const threshold = 1000;
  if (n > threshold) n = threshold;
  return Math.floor(Math.random() * threshold) % n === 0;
}

function getSuggestions(text) {
  var pre = "pre";
  var post = "post";
  var results = [];
  if (getRandomBool(2)) {
    results.push(pre + text);
  }
  if (getRandomBool(2)) {
    results.push(text);
  }
  if (getRandomBool(2)) {
    results.push(text + post);
  }
  if (getRandomBool(2)) {
    results.push(pre + text + post);
  }
  return new Promise((resolve, reject) => {
    const randomTimeout = Math.random() * LATENCY;
    setTimeout(() => {
      if (getRandomBool(FAILURE_COUNT)) {
        reject();
      } else {
        resolve(results);
      }
    }, randomTimeout);
  });
}

function App() {
  const [querySearch, setQuerySearch] = useState(null);
  const [visibleSuggestionArea, setVisibleSuggestionArea] = useState(false);
  const [list, setList] = useState([]);
  const inputRef = useRef();
  const suggestionAreaRef = useRef();
  function handleChange(e) {
    setQuerySearch(e.target.value);
    makeApiCall(querySearch);
  }
  async function makeApiCall(query) {
    let response = await getSuggestions(query);
    setList(response);
  }
  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (
        e.target !== inputRef.current &&
        e.target !== suggestionAreaRef.current
      ) {
        setVisibleSuggestionArea(false);
      }
    });
  });
  return (
    <main className="App">
      <input
        ref={inputRef}
        placeholder="search"
        value={querySearch}
        onChange={handleChange}
        onFocus={() => {
          setVisibleSuggestionArea(true);
        }}
      />
      {visibleSuggestionArea && (
        <div ref={suggestionAreaRef} id="suggestionArea">
          {list.map((e) => {
            return (
              <>
                <div
                  onClick={() => {
                    setQuerySearch(e);
                  }}
                >
                  {e}
                </div>
              </>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default App;
