import { Routes, Route } from 'react-router-dom';
import Welcome from './screens/Welcome';
import Chat from './screens/Chat';
import MemoryViewer from './screens/MemoryViewer';
import Settings from './screens/Settings';
import HybridView from './screens/HybridView';
import GraphView from './screens/GraphView';
import Layout from './components/Layout';
import TitleBar from './components/TitleBar';

function App() {
  return (
    <>
      <TitleBar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route element={<Layout />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/hybrid" element={<HybridView />} />
          <Route path="/memory" element={<MemoryViewer />} />
          <Route path="/graph" element={<GraphView />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
