import NavBar from "../../components/NavBar";
import { Outlet } from "react-router-dom";
import { FC } from "react";
import NavBarHeightProvider from "../../context/NavBarHeightProvider";

interface LayoutProps {
  text: string;
}

const Layout: FC<LayoutProps> = (props) => {
  return (
    <NavBarHeightProvider>
      <NavBar {...props}></NavBar>
      <main>
        <Outlet />
      </main>
    </NavBarHeightProvider>
  );
};

export default Layout;
