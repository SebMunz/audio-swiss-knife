import { notFound } from "next/navigation";
import { getToolById, tools } from "@/data/tools";
import PlaceholderTool from "@/features/placeholder-tool/PlaceholderTool";

export function generateStaticParams() {
  return tools.map((tool) => ({
    toolId: tool.id
  }));
}

export default function ToolPage({ params }: Readonly<{ params: { toolId: string } }>) {
  const tool = getToolById(params.toolId);

  if (!tool) {
    notFound();
  }

  return <PlaceholderTool tool={tool} />;
}
