"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { categories, tools } from "@/data/tools";
import { AudioSigil, CorruptedBottomBar, CorruptedGrimoireRail, RuneStrip } from "@/components/esoteric/AudioSigil";
import { useUiStore } from "@/store/ui-store";
import styles from "./AppShell.module.css";

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const { sidebarCollapsed, toggleSidebar, visualMode, toggleVisualMode } = useUiStore();

  useEffect(() => {
    document.documentElement.dataset.visualMode = visualMode;
  }, [visualMode]);

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return tools.slice(0, 9);
    }

    return tools
      .filter((item) => {
        const haystack = [item.name, item.description, item.category, ...item.tags].join(" ").toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .slice(0, 12);
  }, [query]);

  return (
    <div className={`${styles.shell} ${sidebarCollapsed ? styles.shellCollapsed : ""}`}>
      <aside className={styles.sidebar} aria-label="Navegacion principal">
        <div className={styles.brandRow}>
          <Link href="/" className={styles.brand} aria-label="Audio Swiss Knife home">
            <span className={styles.brandMark}>ASK</span>
            <span className={styles.brandText}>
              <strong>Audio Swiss Knife</strong>
              <small>
                <span className={styles.operatorNormal}>Floure audio tools</span>
                <span className={styles.operatorCorrupted}>0xF10VR_E grimoire</span>
              </small>
            </span>
          </Link>
          <button className={styles.iconButton} type="button" onClick={toggleSidebar} aria-label="Colapsar menu">
            {sidebarCollapsed ? ">" : "<"}
          </button>
        </div>

        <div className={styles.sidebarSeal}>
          <AudioSigil variant="small" label="0xF10" />
          <RuneStrip compact />
        </div>

        <nav className={styles.navList}>
          {categories.map((category) => {
            const href = `/${category.id}`;
            const active = pathname === href;

            return (
              <Link key={category.id} href={href} className={`${styles.navItem} ${active ? styles.active : ""}`}>
                <span className={styles.navGlyph}>{category.shortName.slice(0, 2).toUpperCase()}</span>
                <span className={styles.navText}>
                  <strong>{category.shortName}</strong>
                  <small>{category.description}</small>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sideFooter}>
          <span className={styles.modeLabel}>Visual</span>
          <button
            className={styles.modeSwitch}
            type="button"
            onClick={toggleVisualMode}
            aria-label="Cambiar modo visual"
            aria-pressed={visualMode === "corrupted"}
          >
            <span>{visualMode === "normal" ? "Normal" : "Corrupted"}</span>
            <b>{visualMode === "normal" ? "FLOURE PRO" : "0xF10VR_E"}</b>
          </button>
        </div>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.kicker}>Client-side audio toolkit</p>
            <h1>{pathname === "/" ? "Home" : pathname.replace("/", "")}</h1>
          </div>
          <label className={styles.searchBox}>
            <span>Buscar</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="RT60, LUFS, Opus, EDO..."
              type="search"
            />
          </label>
        </header>

        {query ? (
          <section className={styles.searchPanel} aria-label="Resultados de busqueda">
            <div className={styles.searchHeader}>
              <span>{filteredTools.length} resultados</span>
              <button type="button" onClick={() => setQuery("")}>
                limpiar
              </button>
            </div>
            <div className={styles.searchResults}>
              {filteredTools.map((item) => (
                <Link key={item.id} href={item.route} className={styles.searchResult}>
                  <strong>{item.name}</strong>
                  <span>{item.description}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <main className={styles.main}>{children}</main>
        <CorruptedGrimoireRail />
        <CorruptedBottomBar />
      </div>
    </div>
  );
}
