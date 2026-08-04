import WatchClient from "./WatchClient";

export async function generateStaticParams() {
    // Generate placeholder path to satisfy Next.js static build requirements
    return [{ id: "placeholder" }];
}

export default async function Page({ params }) {
    const { id } = await params;
    return <WatchClient id={id} />;
}
