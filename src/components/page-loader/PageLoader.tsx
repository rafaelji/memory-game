import "./PageLoader.css";

const PageLoader = () => {
  return (
    <div className="page-loader panel text-center">
      <div className="spinner spinner--xl" aria-hidden />
      <p className="page-loader__description">Loading…</p>
    </div>
  );
};

export default PageLoader;
