import LegalPageLayout from "./LegalPageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  return (
    <LegalPageLayout
      title="Contact Us"
      description="We'd love to hear from you. Reach out with any questions or feedback."
    >
      <div className="grid md:grid-cols-3 gap-6">
        {/* Email Card */}
        <Card className="border-border hover:shadow-elegant transition-shadow bg-card h-full flex flex-col justify-center">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1 text-base">Email</h3>
                <a
                  href="mailto:inquiry@turbotrade.ai"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm break-all"
                >
                  inquiry@turbotrade.ai
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phone Card */}
        <Card className="border-border hover:shadow-elegant transition-shadow bg-card h-full flex flex-col justify-center">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1 text-base">Phone</h3>
                <a
                  href="tel:+919321010161"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  +91 9321010161
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Card */}
        <Card className="border-border hover:shadow-elegant transition-shadow bg-card h-full flex flex-col justify-center">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1 text-base">Address</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  1st floor, RK Complex, KSSIDC Compound, Indra Nagar, Electronic City Phase I, Bengaluru, Karnataka 560100
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </LegalPageLayout>
  );
};

export default Contact;
