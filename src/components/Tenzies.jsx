import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";

//1) createTenzies =  фун-я, яка буде створювати нову фішку(масив нових фішок)
//цю фун-ю можна цілком винести за стей, бо вона проста JS
const createTenzies = (number) => {
  const newTenzies = []; //новий масив, куди будуть записуватися всі нові створені фішки
  for (let i = 0; i < number; i++) {
    //всі фішки перебиратимуться
    newTenzies.push({
      number: Math.ceil(Math.random() * 6), //буде випадати рандомне число округлене до найбільшого найближчого цілого
      id: i + 1,
      isLocked: false, //по дефолту ці фішки всі не відмічені, не заблоковакні
    });
  }
  return newTenzies; //поверне новий масив
};

const Tenzies = () => {
  const [numberDice, setNumberDice] = useState(10);

  const [tenzies, setTenzies] = useState(createTenzies(numberDice)); //стейт де зберігатимуться всі фішки, ми сюди у виклик відразу передамо створену вище фун-ю

  const [win, setWin] = useState(false); //перемога

  const [count, setCount] = useState(0);

  //2) функція, яка буде блокувати одну фішку, фарбувати її в зелений(якщо на фішку натиснуули, то її isLocked став true). так як в цю фун-ю нам має приходити id кожної фішки, то ми у виклик цієї фун-ї його і передамою Цю фун-ю ми передамо на онклік на кожну фішку.
  const lockDice = (diceId) => {
  
    //Після 5-ї фун-ї ми пропишемо перевірку, що якщо win true, виконай просто return і код нижче не виконуй. Таким чином ми фіксимо. що якщо коли летять конфеті юзер захоче розблокувати фішки, то не зміг цього зробити
    if (win) {
      return;
    }
    //прийме в себе тенз з id
    const newLockDice = tenzies.map((dice) => {
      //прописуємо нову фун-ю в якій мапимося по всьому масиву з фішками (по кожній фішці)
      if (dice.id === diceId) {
        //якщо id фішки з масиву збігаться з id який ми передали у функ-ю, то
        return {
          //повертаємо
          ...dice,
          isLocked: !dice.isLocked, // спредимо старий масив фішок, а isLocked ставиться на обернене значення(був true, став false i навпаки)
     
        };
      } else {
        //інакше
        return dice; //просто поверни ту ж фішку
      }
    });
    setTenzies(newLockDice);
 
  };

  //3) фун-я яка буде ролити(якщо тут не підходять фішки, буде рандомні нові викидати) і її підключимо на кнопку ролл
  const rollDice = () => {
    const addCount = () => setCount((prevCount) => prevCount + 1);
    const newRoll = tenzies.map((dice) => {
      //в новій змінній будемо мапитися по масиву з тензисами
      if (dice.isLocked) {
        //якщо тенз заблокований, поверни його ж
        return dice;
      } else {
        return {
          //інакше поверни
          ...dice, //всі старі тензи
          number: Math.ceil(Math.random() * 6), //а цифру тенза зміни на рандомну
        };
      }
    });
    setTenzies(newRoll); //стейт змінюємо на новий
    addCount();
  };

  //5) Функ-я, яка буде при setWin(true) при натисканні на кнопку Roll міняти на нову гру. Тобто гру закінчили і щоб створилася нова. Що має відбууватися: а)-фішки мають бути на false, б)- числа у всіх фішок рандомні, в)- напис на кнопці має змінюватися на New Game
  const newGame = () => {
    //так як у нас вже є фун-я яка створює новий маисв фішок, так ніби це нова гра, то ми ту фун-ю іі пропишемо тут
    setTenzies(createTenzies(numberDice)); //передамо її у виклик
    //але щоб коли ми виграли і створилася нова гра, то потрібно щоб забралося конфеті і напис знову повернувся на roll. Це все у нас з'являлося. коли win true, тому ми маєммо для нової гри    setWin поставити назад на false. На true воно встановлювалося при перевірці в UseEffect
    setWin(false);
    setCount(0);
  };

  //6)фун-я яка буде змінювати розмір поля, додавати певну кіл-ть фішок. в [numberDice, setNumberDice]= useState(10); ми прописали, що по дефолту їх 10
  const moreOfDice = () => {
    //фун-я яка буде добавляти кіл-ть фішок
    if (numberDice === 10) {
      //якщо їх 10, то
      setNumberDice(20); //то збільшуємо їх до 20 і
      setTenzies(createTenzies(20)); // і в стейт попадає, що треба сторити нову гру з кіл-тю фішок 20
    }
  };
  const lessOfDice = () => {
    //фун-я яка буде зменшувати кіл-ть фішок
    if (numberDice === 20) {
      setNumberDice(10);
      setTenzies(createTenzies(10));
    }
  };

  //4)фун-я яка перевіряє 1)-чи всі фішки мають однакову цифру 2)- чи всі вони заблоковані. Якщо і перша і друга умови дадуть true, то setWin ми поставимо на true.
  //Юзер взаємодіє тільки з фішками або з кнопкою roll, і при при взаємодії з кнопкою і пр взаємодії з фішками ми бачимо, що змінюється State Tenzies. Ми будемо виконувати цю перевірку кожен раз, коли відбувається зміна Statу Tenzies. в цьому нам допоможе useEffect. І в масив залежностей ми передамо [tenzies], тобто, коли буде змінюватися тензіс, буде відбуватися перевірка. useEffect обовязково відпрацює при завантаженні сторінки і буде відпрацьовуувати кожен наступний раз. коли буде змінюватися щось в списку залежностей(в Tenzies)
  useEffect(() => {
    //1)Перевіряємо чи всі цифри однакові
    const allNumberSame = tenzies.every(
      (dice) => dice.number === tenzies[0].number
    ); //взяли перший елемент нашого масиву (tenzies[0].number) і будемо кожне число кожної фішки (tenz.number) зрівнювати з числом першої фішки масиву тензіс;
    //2)Перевіряємо чи всі фішки заблоковані

    const allNumberLock = tenzies.every((dice) => dice.isLocked === true);
    if (allNumberSame && allNumberLock) {
      //метод every повертає true або false. І ми прписали, що якщо if(allNumberSame  && allNumberLock) true, (a if відпрацює тільки коли true) то setWin(true);
      setWin(true);
    }
  }, [tenzies]);

  return (
    <>
      {win && <Confetti />}
      <div className="tenzies">
        {/* <div className="tenz">1</div>
        <div className="tenz">1</div>
        <div className="tenz">1</div>
        <div className="tenz">1</div>
        <div className="tenz">1</div>
        <div className="tenz">1</div>
        <div className="tenz">1</div>
        <div className="tenz">1</div>
        <div className="tenz">1</div>
        <div className="tenz">1</div> */}
        {tenzies.map((dice) => (
          <div
            key={dice.id}
            className={dice.isLocked ? "dice locked" : "dice"}
            onClick={() => lockDice(dice.id)}
          >
            {dice.number}
          </div>
        ))}
      </div>
      {/* //замість всіх кнопок, ми будемо мапитися по div className="tenzies"
      І пропишемощо якщо тенз заблокований то поверни стилі для заблокованого, інакше тенз звичайний*/}

      <button onClick={win ? newGame : rollDice}>
        {win ? "New Game" : "Roll"}
      </button>
      {/* якщо фун-я нічого не приймає, або тільки event,  тоді краще прописати не серез анонімну як в нкопках з цифрами, а просто відразу її передати 
      Після створеня 5-ї фун-ї ми в кнопці замість тексту прописуємо, що якщо win(якщо win true) ? то зміни напис на "New Game" : "Roll" 
      А на onClick також прописуємо, якщо {win ? то виконай фун-ю  newGame : інакше rollTenz
      Тобто, якщо гру закінчено, то зміни напис. якщо ні - то не змінюй. І якщо гру закінчено, то виконай фун-ю яка створить нову гру, якщо ні, то виконай фун-ю, яка просто ролить фішки далі */}
      {/* <button onClick={numberOfDice}>{win ? "More dice" : "Less dice"}</button> */}
      <div className="change">
        <button onClick={moreOfDice}>More dice</button>
        <button onClick={lessOfDice}>Less dice</button>
      </div>

      <h2 className="count">Step: {count}</h2>
    </>
  );
};

export default Tenzies;
