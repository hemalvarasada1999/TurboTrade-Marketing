import LegalPageLayout from "./LegalPageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
    return (
        <LegalPageLayout
            title="Contact Us"
            description="We'd love to hear from you. Reach out with any questions or feedback."
        >
            <div className="grid md:grid-cols-2 gap-4">
                {/* Contact Info Cards */}
                <Card className="border-border hover:shadow-elegant transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-accent/10">
                                <Mail className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                                <a
                                    href="mailto:info@turbotrade.ai"
                                    className="text-muted-foreground hover:text-accent transition-colors"
                                >
                                    info@turbotrade.ai
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border hover:shadow-elegant transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-accent/10">
                                <Phone className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                                <a
                                    href="tel:+919321010161"
                                    className="text-muted-foreground hover:text-accent transition-colors"
                                >
                                    +91 9321010161
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border hover:shadow-elegant transition-shadow md:col-span-2">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-accent/10">
                                <MapPin className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-1">Address</h3>
                                <p className="text-muted-foreground">
                                    1st floor, RK Complex, <br />
                                    KSSIDC Compound, Indra Nagar, <br />
                                    Electronic City Phase I, Bengaluru, Karnataka 560100
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Contact Form */}
            {/* <Card className="border-border">
                <CardContent className="p-8">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Send us a message</h2>
                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Your name"
                                    className="focus-visible:ring-accent"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    className="focus-visible:ring-accent"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                placeholder="How can we help?"
                                className="focus-visible:ring-accent"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                placeholder="Tell us more about your inquiry..."
                                rows={6}
                                className="focus-visible:ring-accent resize-none"
                            />
                        </div>
                        <Button type="submit" className="w-full md:w-auto">
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                        </Button>
                    </form>
                </CardContent>
            </Card> */}

        </LegalPageLayout>
    );
};

export default Contact;
