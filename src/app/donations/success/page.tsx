"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Heart } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DonationDetails {
  donation: {
    id: string;
    amount: number;
    projectId: string;
    donorName: string;
    donorEmail: string;
  };
  session: {
    payment_status: string;
    customer_email: string;
  };
}

export default function DonationSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [donationDetails, setDonationDetails] = useState<DonationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setError("No payment session found.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/donations?session_id=${sessionId}`);
        const data = await response.json();

        if (response.ok && data.session?.payment_status === "paid") {
          setDonationDetails(data);
        } else {
          setError("Payment verification failed.");
        }
      } catch (err) {
        setError("An error occurred while verifying your payment.");
      } finally {
        setIsLoading(false);
      }
    }

    verifyPayment();
  }, [sessionId]);

  if (isLoading) {
    return (
      <Shell>
        <PageHeader
          heading="Verifying Payment"
          text="Please wait while we confirm your donation..."
        />
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <PageHeader
          heading="Payment Error"
          text="There was an issue with your payment."
        />
        <div className="w-full max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-6 flex justify-center">
            <Button onClick={() => router.push("/donations")}>
              Try Again
            </Button>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <PageHeader
        heading="Donation Successful!"
        text="Thank you for your generous contribution."
      />
      <div className="w-full max-w-2xl mx-auto">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-800">Payment Confirmed</CardTitle>
            <CardDescription className="text-green-600">
              Your donation has been successfully processed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {donationDetails && (
              <>
                <div className="bg-white p-6 rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Amount:</span>
                    <span className="text-lg font-bold text-gray-900">
                      ${donationDetails.donation.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Donor:</span>
                    <span className="text-sm text-gray-900">
                      {donationDetails.donation.donorName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <span className="text-sm text-gray-900">
                      {donationDetails.donation.donorEmail}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Transaction ID:</span>
                    <span className="text-xs text-gray-500 font-mono">
                      {donationDetails.donation.id}
                    </span>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <Heart className="inline w-4 h-4 mr-2 text-red-500" />
                    A receipt has been sent to your email address. Your donation will help make a real difference!
                  </p>
                </div>
              </>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={() => router.push("/dashboard")} 
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push("/projects")}
                className="flex-1"
              >
                View More Projects
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
