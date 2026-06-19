import { notFound } from "next/navigation";
import { getToolById, tools } from "@/data/tools";
import Rt60Calculator from "@/features/acustica/rt60/Rt60Calculator";
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

  if (tool.id === "rt60") {
    return <Rt60Calculator tool={tool} />;
  }

  return <PlaceholderTool tool={tool} />;
}
