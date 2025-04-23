import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/db/prisma";
import { stripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SuccessPageProps {
  searchParams: {
    session_id?: string;
  };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !searchParams.session_id) {
    notFound();
  }

  const stripeSession = await stripe.checkout.sessions.retrieve(
    searchParams.session_id
  );

  if (!stripeSession) {
    notFound();
  }

  // Create order in database
  await prisma.order.create({
    data: {
      userId: session.user.id,
      productId: stripeSession.metadata?.productId,
      paymentIntent: stripeSession.payment_intent as string,
    },
  });

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. You can now download your product.
        </p>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
} 