import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import LandingPage, { metadata } from "./page";

vi.mock("next/link", () => {
  const Link = ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  );
  return { default: Link, Link };
});

function extractJsonLd(html: string) {
  const match = html.match(/<script type="application\/ld\+json">([^<]*)<\/script>/);
  expect(match).not.toBeNull();
  return JSON.parse(match![1]);
}

/** Critères d'acceptation de la spec landing : structure, honnêteté tarifaire et données structurées. */
describe("LandingPage — rendu serveur", () => {
  it("h1 unique, aucun <video>, aucun prix USD", () => {
    const html = renderToStaticMarkup(<LandingPage />);
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).not.toContain("<video");
    expect(html).not.toContain("USD");
  });

  it("JSON-LD valide : Organization, SoftwareApplication (offers XOF) et FAQPage (5 questions)", () => {
    const html = renderToStaticMarkup(<LandingPage />);
    const graph = extractJsonLd(html)["@graph"] as Array<Record<string, unknown>>;
    const types = graph.map((node) => node["@type"]);
    expect(types).toEqual(expect.arrayContaining(["Organization", "SoftwareApplication", "FAQPage"]));

    const software = graph.find((node) => node["@type"] === "SoftwareApplication") as { offers: Array<Record<string, string>> };
    expect(software.offers.map((offer) => offer.price)).toEqual(["0", "9900", "29900"]);
    expect(software.offers.every((offer) => offer.priceCurrency === "XOF")).toBe(true);

    const faq = graph.find((node) => node["@type"] === "FAQPage") as { mainEntity: Array<{ name: string }> };
    expect(faq.mainEntity).toHaveLength(5);
    expect(faq.mainEntity.map((item) => item.name)).toContain("Pourquoi raconter plutôt que découper ?");
  });

  it("prix affichés (espaces fines) cohérents avec les offers JSON-LD", () => {
    const html = renderToStaticMarkup(<LandingPage />);
    expect(html).toContain("9\u202F900");
    expect(html).toContain("29\u202F900");
  });

  it("metadata : canonical « / » déclaré par la landing uniquement", () => {
    expect(metadata.alternates?.canonical).toBe("/");
  });
});
