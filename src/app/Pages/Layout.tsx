import NavBar from "../../components/NavBar";
import { Outlet } from "react-router-dom";
import { FC } from "react";
import UpdateBackgroundProvider from "../../context/UpdateBackgroundProvider";

interface LayoutProps {
  text: string;
}

const Layout: FC<LayoutProps> = (props) => {
  return (
    <UpdateBackgroundProvider>
      <NavBar {...props}></NavBar>
      <main>
        <Outlet />
      </main>
    </UpdateBackgroundProvider>
  );
};

export default Layout;
