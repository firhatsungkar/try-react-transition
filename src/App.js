import React, { useState, useEffect } from "react";
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [names, setNames] = useState([]);
  const [filter, setFilter] = useState(null)

  useEffect(() => {
    fetchRandomName(5)
      .then(newNames => {
        setNames([...newNames])
      })
  }, [])

  const fetchRandomName = async (amount=1) => {
    const url = `https://cors-anywhere.herokuapp.com/http://names.drycodes.com/${amount}?nameOptions=starwarsCharacters`
    const options = {
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
      }
    }
    const response = await fetch(url, options)
    const names = await response.json()
    return names.map( name => name.split('_').join(' '))
  }

  function onAddName() {
    fetchRandomName(1)
      .then( newNames => setNames([...names, ...newNames]))
  }

  function onDeletename(index=null) {
    const newNames = [...names].filter((_,i) => i !== index)
    setNames(newNames)
  }

  const filteredNames = filter ? names.filter(
    name => String(name).includes(filter)
  ) : names

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="App-actions">
          <div className="App-filter">
            <input
              type="text"
              name="name-filter"
              id="name-filter"
              placeholder="Filter name here..."
              className="App-filter__input"
              onChange={(e) => setFilter(e.target.value)}
              value={filter || ''}
            />
          </div>
          <div className="App-add-name">
            <button
              onClick={onAddName}
              className="btn btn--primary">
                Add Random Name
            </button>
          </div>
        </div>
        <div className="App-name">
          <ul className="App-name__list">
            <ReactCSSTransitionGroup
              transitionName="App-name__item--transition"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}
            >
            { filteredNames.length > 0 ? (
              filteredNames.map(
                (name, index) => (
                  <li
                    onClick={() => onDeletename(index)}
                    key={index}
                    className="App-name__item">
                    {name}
                  </li>
                )
              )
            ) : (
              <li className="App-name__item">
                { filter && names.length > 0
                    ? `No name contain "${filter}"`
                    : `No name available. Please add new!`
                }
              </li>
            )}
            </ReactCSSTransitionGroup>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
