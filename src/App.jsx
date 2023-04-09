import { useState } from "react";

import bellSound from "../src/media/bell.wav";

import "./App.scss";

function App() {
  const [order, setOrder] = useState([]);
  const [inputData, setInputData] = useState("");
  const [ready, setReady] = useState([]);
  const [readySound, setReadySound] = useState(false);
  const soundClick = () => {
    setReadySound(true);
  };
  const soundEnded = () => {
    setReadySound(false);
  };
  const handleAddOrder = () => {
    const newArray = [...order, inputData];
    setOrder(newArray);
    setInputData("");
  };

  const addOrder = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      handleAddOrder();
    }
  };

  const readyOrder = (number, id) => {
    const newReadyOrder = [...ready, number];
    const newOrder = order.filter((item) => {
      return item !== number;
    });

    setOrder(newOrder);
    setReady([...newReadyOrder]);

    setTimeout(() => {
      const updatedReadyOrder = [...ready].filter((n) => n !== number);
      setReady(updatedReadyOrder);
    }, 5000);
    // remove order after 5 seconds
  };

  const speak = (text) => {
    const message = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find((voice) => voice.name === "Google русский");
    const russianVoice = voices.find((voice) => voice.lang === "ru-RU");
    message.voice = maleVoice && russianVoice;
    message.rate = 0.9;
    window.speechSynthesis.speak(message);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("This will run after 1 second!");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className="parent ">
        <div className="parent__filter">
          {" "}
          <h1>Готовится</h1>
          <div>
            {order.map((number, id) => (
              <button
                onClick={() => (
                  readyOrder(number, id),
                  soundClick(),
                  speak(`Заказ номер  ${number} готов`)
                )}
                key={id}
              >
                {" "}
                Заказ № {number}
              </button>
            ))}
          </div>
        </div>

        <div className="parent__filter filter__ready">
          <h1 className="ready">Готово</h1>
          <div>
            {ready.map((n, index) => (
              <div key={index}>
                {" "}
                <button className="ready__btn" key={index}>
                  Заказ № {n}
                </button>
              </div>
            ))}

            {readySound && (
              <audio src={bellSound} autoPlay onEnded={soundEnded}></audio>
            )}
          </div>
        </div>

        {/* <p>Проект Таалая Канатбека</p> */}
      </div>
      <div className="card">
        <form>
          {" "}
          <input
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="bg-white text-black outline-none "
            type="number"
            onKeyDown={addOrder}
          />
          <button
            className="card__btn"
            disabled={!inputData}
            onClick={() => handleAddOrder()}
          >
            Готовить
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
