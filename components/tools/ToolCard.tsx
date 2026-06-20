import Link from "next/link";
import { ToolRune } from "@/components/esoteric/AudioSigil";
import { getCorruptedCopy } from "@/data/corrupted-copy";
import type { ToolDefinition } from "@/data/tools";
import styles from "./ToolCard.module.css";

export function ToolCard({ tool }: Readonly<{ tool: ToolDefinition }>) {
  const corruptedCopy = getCorruptedCopy(tool);

  return (
    <Link href={tool.route} className={styles.card}>
      <div className={styles.cardTop}>
        <span className={`${styles.status} ${styles[tool.status]}`}>{tool.status}</span>
        <span className={styles.category}>{tool.category}</span>
      </div>
      <div className={styles.toolRune}>
        <ToolRune toolId={tool.id} />
      </div>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      <div className={styles.corruptedCopy}>
        <span>{corruptedCopy.title}</span>
        <p>{corruptedCopy.description}</p>
      </div>
      <div className={styles.tags}>
        {tool.tags.slice(0, 3).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </Link>
  );
}
