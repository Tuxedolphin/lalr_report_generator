import NavBar from "../../components/NavBar";
import { Outlet } from "react-router-dom";
import { FC } from "react";
import NavBarHeightProvider from "../../context/NavBarHeightProvider";
import NavBarTextProvider from "../../context/NavBarTextProvider";

const Layout: FC = () => {
  return (
    <NavBarHeightProvider>
      <NavBarTextProvider>
        <NavBar></NavBar>
        <main>
          <Outlet />
        </main>
      </NavBarTextProvider>
    </NavBarHeightProvider>
  );
};

export default Layout;
