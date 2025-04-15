import { Outlet } from "react-router-dom";

const App: React.FC = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default App;
