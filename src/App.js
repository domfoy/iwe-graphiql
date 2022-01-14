import logo from './logo.svg';
import './App.css';

import IweGraphiQL from './iwe-graph-iql';

function App({
  envs,
  iweFetcher
}) {
  return (
    <div className="App">
      <IweGraphiQL
        envs={envs}
        iweFetcher={iweFetcher}
      >
      </IweGraphiQL>
    </div>
  );
}

export default App;
