import Header from "./Header";
import { Outlet } from "react-router-dom";

const AppContainer: React.FC = () => {
  return (
    <div>
      <Header />

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default AppContainer;
