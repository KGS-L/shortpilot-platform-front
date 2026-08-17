import { act, type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { LandingAuthActions } from "./landing-auth-actions";

vi.mock("next/link", () => {
  const Link = ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  );
  return { default: Link, Link };
});

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** Matrice I/O de la spec landing : états déconnecté / connecté / session nettoyée de la nav. */
describe("LandingAuthActions — nav auth-aware de la landing", () => {
  let container: HTMLDivElement | undefined;
  let root: Root | undefined;

  function renderActions() {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => root!.render(<LandingAuthActions />));
  }

  afterEach(() => {
    act(() => root?.unmount());
    container?.remove();
    container = undefined;
    root = undefined;
    localStorage.clear();
  });

  it("rend l'état déconnecté côté serveur (fallback sans JS)", () => {
    const html = renderToStaticMarkup(<LandingAuthActions />);
    expect(html).toContain("Se connecter");
    expect(html).toContain("Créer gratuitement");
    expect(html).not.toContain("Mon tableau de bord");
  });

  it("visiteur déconnecté : « Se connecter » + « Créer gratuitement », aucun lien dashboard", () => {
    renderActions();
    expect(container!.textContent).toContain("Se connecter");
    expect(container!.textContent).toContain("Créer gratuitement");
    expect(container!.querySelector('a[href="/dashboard"]')).toBeNull();
  });

  it("visiteur connecté (token présent) : « Mon tableau de bord » → /dashboard", () => {
    localStorage.setItem("omnelyo_access_token", "token-test");
    renderActions();
    const link = container!.querySelector('a[href="/dashboard"]');
    expect(link).not.toBeNull();
    expect(link!.textContent).toContain("Mon tableau de bord");
  });

  it("token retiré : la nav retombe sur « Se connecter » (session expirée ou nettoyée)", () => {
    localStorage.setItem("omnelyo_access_token", "token-test");
    renderActions();
    act(() => {
      localStorage.removeItem("omnelyo_access_token");
      window.dispatchEvent(new Event("storage"));
    });
    expect(container!.textContent).toContain("Se connecter");
    expect(container!.querySelector('a[href="/dashboard"]')).toBeNull();
  });
});
