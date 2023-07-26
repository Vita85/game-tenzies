import Tenzies from "./components/Tenzies";


function App() {
  
  return (
    <div className="container">
      <div className="game-box">
        <div className="game-title">
          <h1>Tenzies</h1>
          <p>
            Roll until all dice are the same. Click each die to freeze it at its
            current value between rolls.
          </p>
    
        </div>
       <Tenzies />

      </div>
    </div>
  );
}

export default App;
