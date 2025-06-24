import { getPortfolio } from "@/lib/db";
import { notFound } from "next/navigation";
import PortfolioView from "@/components/PortfolioView";
import { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const portfolio = await getPortfolio(params.slug);
  
  if (!portfolio) {
    return {
      title: "Portfolio Not Found",
    };
  }

  const data = portfolio.portfolio_data;
  
  return {
    title: `${data.name} - ${data.title}`,
    description: data.currentRole || `Portfolio of ${data.name}`,
    openGraph: {
      title: `${data.name} - ${data.title}`,
      description: data.currentRole || `Portfolio of ${data.name}`,
      type: "website",
    },
  };
}

export default async function PortfolioPage({ params }: PageProps) {
  const portfolio = await getPortfolio(params.slug);

  if (!portfolio) {
    notFound();
  }

  return <PortfolioView data={portfolio.portfolio_data} viewCount={portfolio.view_count} />;
}