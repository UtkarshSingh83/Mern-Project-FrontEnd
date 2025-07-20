import App from "../App";
import Footer from "./Footer";
import Header from "./Header";

function AppLayout({ children }) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default AppLayout;