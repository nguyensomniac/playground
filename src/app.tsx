import React from 'react';
import ReactDOM from 'react-dom/client'
import { Playground } from './components/Playground';

import './styles.css'

const App = () => {
  const [selectionState, setSelectionState] = React.useState([]);
  React.useEffect(() => {
    window.onmessage = (event) => {
      if (event?.data?.pluginMessage?.type === 'SELECTION_CHANGE') {
        setSelectionState(event.data.pluginMessage.data)
      }
    }
  }, [setSelectionState])
  return (
    <div>
      <Playground initialState={selectionState} />
    </div>
  )
}

const container = document.getElementById('react-root');
const root = ReactDOM.createRoot(container)
root.render(<App />);