import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Página no encontrada | DJ Decxin Remix</title>
        <meta name="description" content="La página que buscas no existe. Vuelve al sitio oficial de DJ Decxin Rmx." />
        <meta name="robots" content="noindex" />
        <link rel="canonical" href={`https://dj-decxin-rmx.lovable.app${location.pathname}`} />
        <meta property="og:title" content="Página no encontrada | DJ Decxin Remix" />
        <meta property="og:description" content="La página que buscas no existe." />
        <meta property="og:url" content={`https://dj-decxin-rmx.lovable.app${location.pathname}`} />
      </Helmet>
      <main className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <a href="/" className="text-primary underline hover:text-primary/90">
            Return to Home
          </a>
        </div>
      </main>
    </>
  );
};

export default NotFound;
