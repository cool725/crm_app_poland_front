import Header from "./Header";
import { Outlet } from "react-router-dom";
import CustomScrollbar from "../common/CustomScrollbar";

const AppContainer: React.FC = () => {
  return (
    <CustomScrollbar>
      <div className="flex flex-col h-screen">
        <Header />

        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </CustomScrollbar>
  );
};

export default AppContainer;
