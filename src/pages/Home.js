import { Link } from 'react-router-dom';
import { FaChartLine, FaLink, FaLayerGroup } from 'react-icons/fa';

function Home() {
    return (
        <div className="bg-light" style={{ minHeight: 'calc(100vh - 120px)' }}>
            {/* Hero Section */}
            <section className="container py-5 d-flex flex-column align-items-center justify-content-center text-center">
                <div className="card bg-card shadow-sm p-5 mb-4 w-100" style={{ maxWidth: 700 }}>
                    <h1 className="display-5 fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>
                        Centralized Affiliate Management & Analytics, All in One Place.
                    </h1>
                    <p className="lead mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                        Track, manage, and analyze affiliate links across all platforms — effortlessly.
                    </p>
                    <Link to="/dashboard" className="btn btn-primary btn-lg px-4 shadow">
                        Get Started
                    </Link>
                </div>
                {/* Optional illustration (replace src with a relevant undraw.co SVG if desired) */}
                {/* <img src="/illustration.svg" alt="Affiliate Analytics" className="mb-4" style={{ maxWidth: 320 }} /> */}
            </section>

            {/* Feature Highlights */}
            <section className="container pb-5">
                <div className="row justify-content-center g-4">
                    <div className="col-12 col-md-4">
                        <div className="card h-100 border-0 shadow-sm text-center p-4">
                            <div className="mb-3">
                                <FaChartLine size={40} style={{ color: 'var(--color-secondary)' }} />
                            </div>
                            <h5 className="fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                                Real-time Analytics
                            </h5>
                            <p className="text-muted mb-0">
                                Instantly monitor clicks, conversions, and performance metrics for all your affiliate links.
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="card h-100 border-0 shadow-sm text-center p-4">
                            <div className="mb-3">
                                <FaLink size={40} style={{ color: 'var(--color-secondary)' }} />
                            </div>
                            <h5 className="fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                                Multi-Platform Integration
                            </h5>
                            <p className="text-muted mb-0">
                                Seamlessly manage affiliate links from all your networks and platforms in one dashboard.
                            </p>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="card h-100 border-0 shadow-sm text-center p-4">
                            <div className="mb-3">
                                <FaLayerGroup size={40} style={{ color: 'var(--color-secondary)' }} />
                            </div>
                            <h5 className="fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                                Centralized Campaign Management
                            </h5>
                            <p className="text-muted mb-0">
                                Organize, track, and optimize all your affiliate campaigns from a single, unified interface.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;