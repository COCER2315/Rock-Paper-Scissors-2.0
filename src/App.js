import React, { useState, useEffect } from 'react';
import Rock from './icons/Rock';
import Paper from './icons/Paper';
import Scissors from './icons/Scissors';
import './App.css';

const choices = [
  { id: 1, name: 'rock', component: Rock, losesTo: 2 },
  { id: 2, name: 'paper', component: Paper, losesTo: 3 },
  { id: 3, name: 'scissors', component: Scissors, losesTo: 1 }
];



export default function App() {
  const [magic, setMagic] = useState(false);
  const [magicUse, setMagicUse] = useState(null);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [roundState, setRoundState] = useState(null); // win, lose, draw
  const [matchState, setMatchState] = useState(null);

  useEffect(() => {
    nextRound();
  }, []);

  function nextRound() {
    setRoundState(null);
    setUserChoice(null);

    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    setComputerChoice(randomChoice);
    // 30% chance of the user being able to use magic in each round
    // if this ability is granted, user is presented with a choice of either
    // reducing their own loss count by 1 or halving their chance of losing in
    // the next 2 rounds (implemented later)
    if (Math.random() >= 0.8) {
      setMagic(true);
    }
    else{
      setMagic(false);
    }
  }

  // next match 
  // 1 match has indefinitely many rounds, until the user or the computer's loss count reaches 5
  function nextMatch() {
    setRoundState(null);
    setUserChoice(null);
    setWins(0);
    setLosses(0);

    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    setComputerChoice(randomChoice);
    // 30% chance of the user being able to use magic in each round
    // if this ability is granted, user is presented with a choice of either
    // reducing their own loss count by 1 
    // or 
    // have a 50% chance not increasing loss count if a user loss occurs or double increase
    // the computer's loss count if a user win occurs in the next round
    // (implemented later)
    if (Math.random() >= 0.8) {
      setMagic(true);
    }
    else{
      setMagic(false);
    }
  }

  function handleUserChoice(choice) {
    if (wins === 5){
      setMatchState('user wins');
    }
    else{
      setMatchState('computer wins');
    }
    const chosenChoice = choices.find(c => c.id === choice);
    setUserChoice(chosenChoice);
     if(magic){
    // commented out due to not working yet
      if (magicUse === 'cancel one loss!') {
        setLosses(losses => losses - 1);
        setRoundState('magical cancelling');
        if (chosenChoice.losesTo === computerChoice.id) {
          // lose
          setLosses(losses => losses + 1);
          setRoundState('lose');
        } else if (computerChoice.losesTo === chosenChoice.id) {
          // win
          setWins(wins => wins + 1);
          setRoundState('win');
        } else if (computerChoice.id === chosenChoice.id) {
          // draw
          setRoundState('draw');
        }
      }
      else {
        if (chosenChoice.losesTo === computerChoice.id && Math.random() >= 0.5) {
          // lose (chance reduced by half)
          setLosses(losses => losses + 1);
          setRoundState('lose');
        }
        else if (chosenChoice.losesTo === computerChoice.id) {
          setRoundState('magical cancelling');
        }
        else if (computerChoice.losesTo === chosenChoice.id) {
          // win (normal)
          setWins(wins => wins + 2);
          setRoundState('magically boosted');
        } else if (computerChoice.id === chosenChoice.id) {
          // draw (normal)
          setRoundState('draw');
        }
    
      }
     }
    else{
      if (chosenChoice.losesTo === computerChoice.id) {
        // lose
        setLosses(losses => losses + 1);
        setRoundState('lose');
      } else if (computerChoice.losesTo === chosenChoice.id) {
        // win
        setWins(wins => wins + 1);
        setRoundState('win');
      } else if (computerChoice.id === chosenChoice.id) {
        // draw
        setRoundState('draw');
      }
    }
  }

  function chooseMagicUse(use){
    const uses = ['cancel one loss!' , 'next round boost!'];
    const chosenUse = uses.find(c => c === use);
    setMagicUse(chosenUse);
  }

  function renderComponent(choice) {
    const Component = choice.component; // Paper, Rock, Scissors
    return <Component />;
  }

  return (
    <div className="app">
      {/* information goes here */}
      <div className="info">
        <h2>Rock Paper Scissors 2.0</h2>

        {/* wins vs losses stats */}
        <div className="wins-losses">
          <div className="losses">
            <span className="number">{losses}</span>
            <span className="text">{losses === 1 ? 'User Losses' : 'User Losses'}</span>
          </div>

          <div className="wins">
            <span className="number">{wins}</span>
            <span className="text">{wins === 1 ? 'Computer Losses' : 'Computer Losses'}</span>
          </div>
        </div>
      </div>

      {/* the popup to show win/lose/draw */}
      {roundState && (
        <div
          className={`round-state ${roundState}`}
          onClick={() => nextRound()}
        >
          <div>
            <div className="round-state-content">
              <p>{renderComponent(userChoice)}</p>
              {/* <p>you {roundState} this round!</p> */}
              {roundState === 'win' && <p>You won this round!</p>}
              {roundState === 'lose' && <p>You lost this round!</p>}
              {roundState === 'draw' && <p>You drew this round!</p>}
              {roundState === 'magical cancelling' && <p>Your loss was canceled by magic!</p>}
              {roundState === 'magically boosted' && <p>Computer got 1 extra loss because of your magic!</p>}
              <p>{renderComponent(computerChoice)}</p>
            </div>

            <button>Next Round</button>
          </div>
        </div>
      )}

      {/* the popup to tell the user to choose how to use their granted magic*/}
      {// to be implemented later
      }

      {/* the popup that displays the winner*/}
      {// to be implemented later
      }

      <div className="choices">
        {/* choices captions */}
        <div>You</div>
        <div />
        <div>Computer</div>

        {/* buttons for user choice */}
        <div>
          <button className="rock" onClick={() => handleUserChoice(1)}>
            <Rock />
          </button>
          <button className="paper" onClick={() => handleUserChoice(2)}>
            <Paper />
          </button>
          <button className="scissors" onClick={() => handleUserChoice(3)}>
            <Scissors />
          </button>
        </div>

        <div className="vs">vs</div>

        {/* show the computer's choice */}
        <div>
          <button className="computer-choice">?</button>
        </div>
      </div>
      {/* to do add let user choose how to use magic */}
      {// JS implemented, CSS not yet
      }
      {magicUse && (
        <div
          className={'magicUse'}
        >
        <div>
          <button className="cancel one loss!" onClick={() => chooseMagicUse('cancel one loss!')}>
          </button>
          <button className="next round boost!" onClick={() => chooseMagicUse('next round boost!')}>
          </button>
        </div>
      </div>
      )}
    </div>

  );
}
