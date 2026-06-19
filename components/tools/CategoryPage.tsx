import { getCategory, getToolsByCategory, type ToolCategory } from "@/data/tools";
import { AudioSigil, RuneStrip } from "@/components/esoteric/AudioSigil";
import { ToolCard } from "./ToolCard";
import styles from "./CategoryPage.module.css";

export function CategoryPage({ categoryId }: Readonly<{ categoryId: ToolCategory }>) {
  const category = getCategory(categoryId);
  const categoryTools = getToolsByCategory(categoryId);
  const prototypes = categoryTools.filter((tool) => tool.status === "prototype").length;

  if (!category) {
    return null;
  }

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p>{category.shortName}</p>
          <h2>{category.name}</h2>
          <span>{category.description}</span>
        </div>
        <dl className={styles.stats}>
          <div>
            <dt>Herramientas</dt>
            <dd>{categoryTools.length}</dd>
          </div>
          <div>
            <dt>Prototipos</dt>
            <dd>{prototypes}</dd>
          </div>
        </dl>
        <div className={styles.categorySigil}>
          <AudioSigil variant="small" label={category.shortName.toUpperCase()} />
        </div>
      </div>

      <RuneStrip compact />

      <div className={styles.grid}>
        {categoryTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
