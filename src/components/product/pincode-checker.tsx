"use client";

import { useState } from "react";
import { MapPin, Truck, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DeliveryInfo {
  available: boolean;
  estimatedDays: number;
  codAvailable: boolean;
  message: string;
}

// Major metro pincodes (first 3 digits) - ships in 3-5 days
const METRO_PREFIXES = [
  "110", "120", "122", // Delhi NCR
  "400", "401", "410", // Mumbai
  "560", "562", // Bangalore
  "600", "601", "602", // Chennai
  "700", "711", "712", // Kolkata
  "500", "501", // Hyderabad
  "411", "412", // Pune
  "380", "382", // Ahmedabad
  "302", "303", // Jaipur
  "226", "227", // Lucknow
];

// Tier-2 areas - ships in 5-7 days
const TIER2_PREFIXES = [
  "440", "442", // Nagpur
  "641", "642", // Coimbatore
  "682", "683", // Kochi
  "570", "571", // Mysore
  "530", "531", // Visakhapatnam
  "590", "591", // Belgaum
  "625", "626", // Madurai
  "680", "686", // Thrissur/Kottayam (Kerala)
  "690", "691", // Trivandrum
  "673", "670", // Kozhikode/Kannur
  "695", // Thiruvananthapuram
  "360", "361", // Rajkot
  "395", // Surat
  "520", "521", // Vijayawada
  "605", "607", // Pondicherry/Cuddalore
  "620", "621", // Trichy
  "636", "637", // Salem/Erode
  "160", // Chandigarh
  "208", // Kanpur
  "800", "801", // Patna
  "452", "453", // Indore
  "462", "464", // Bhopal
];

function checkPincode(pincode: string): DeliveryInfo {
  const prefix = pincode.slice(0, 3);

  if (METRO_PREFIXES.includes(prefix)) {
    return {
      available: true,
      estimatedDays: 4,
      codAvailable: true,
      message: "Standard delivery in 3-5 business days",
    };
  }

  if (TIER2_PREFIXES.includes(prefix)) {
    return {
      available: true,
      estimatedDays: 6,
      codAvailable: true,
      message: "Delivery in 5-7 business days",
    };
  }

  // Default — most of India delivers in 7-10 days
  const firstDigit = parseInt(pincode[0]);
  if (firstDigit >= 1 && firstDigit <= 8) {
    return {
      available: true,
      estimatedDays: 9,
      codAvailable: firstDigit !== 7, // No COD for remote northeast
      message: "Delivery in 7-10 business days",
    };
  }

  return {
    available: false,
    estimatedDays: 0,
    codAvailable: false,
    message: "Delivery not available to this pincode",
  };
}

export function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<DeliveryInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!/^\d{6}$/.test(pincode)) return;
    setLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 400));
    const info = checkPincode(pincode);
    setResult(info);
    setLoading(false);

    // Save last used pincode
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("kpt-pincode", pincode);
    }
  };

  // Load saved pincode on mount
  useState(() => {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("kpt-pincode");
      if (saved && /^\d{6}$/.test(saved)) {
        setPincode(saved);
      }
    }
  });

  const getDeliveryDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>Check Delivery Availability</span>
      </div>

      <div className="flex gap-2">
        <Input
          type="text"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          placeholder="Enter pincode"
          value={pincode}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            setPincode(val);
            if (result) setResult(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCheck();
          }}
          className="max-w-[140px]"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleCheck}
          disabled={pincode.length !== 6 || loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Check"
          )}
        </Button>
      </div>

      {result && (
        <div
          className={`rounded-lg border p-3 text-sm ${
            result.available
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
          }`}
        >
          {result.available ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-medium">
                <Truck className="h-4 w-4" />
                <span>{result.message}</span>
              </div>
              <p className="text-xs pl-6">
                Expected by{" "}
                <strong>{getDeliveryDate(result.estimatedDays)}</strong>
              </p>
              <div className="flex items-center gap-1.5 text-xs pl-6">
                {result.codAvailable ? (
                  <>
                    <Check className="h-3 w-3" />
                    <span>Cash on Delivery available</span>
                  </>
                ) : (
                  <>
                    <X className="h-3 w-3" />
                    <span>Only prepaid orders available</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <X className="h-4 w-4" />
              <span>{result.message}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
