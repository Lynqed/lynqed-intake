import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import ProgressBar from "./ProgressBar";
import ScaleInput from "./ScaleInput";

interface FormData {
  company_info: {
    bedrijfsnaam: string;
    website_url: string;
    branche: string;
    omschrijving: string;
  };
  offer_target: {
    product_dienst: string;
    ideale_klant: string;
    ideale_klant_toelichting: string;
    doelgroep_specifiek: number;
    klantwaarde: string;
  };
  marketing: {
    kanalen: string[];
    budget: string;
    resultaat: string;
    lead_stabiliteit: number;
  };
  website: {
    tevredenheid: number;
    doel: string;
    afhaakmomenten: string;
  };
  process: {
    opvolging: string;
    bottleneck: string;
    doelen: string;
  };
  contact: {
    naam: string;
    email: string;
    telefoon: string;
  };
}

const initialData: FormData = {
  company_info: { bedrijfsnaam: "", website_url: "", branche: "", omschrijving: "" },
  offer_target: { product_dienst: "", ideale_klant: "", ideale_klant_toelichting: "", doelgroep_specifiek: 0, klantwaarde: "" },
  marketing: { kanalen: [], budget: "", resultaat: "", lead_stabiliteit: 0 },
  website: { tevredenheid: 0, doel: "", afhaakmomenten: "" },
  process: { opvolging: "", bottleneck: "", doelen: "" },
  contact: { naam: "", email: "", telefoon: "" },
};

const MARKETING_KANALEN = ["Google Ads", "SEO", "Social ads", "E-mailmarketing", "Geen structurele marketing"];
const BUDGET_OPTIONS = ["€0 – €500", "€500 – €2.000", "€2.000 – €5.000", "€5.000 – €15.000", "€15.000+"];
const KLANT_OPTIONS = ["Particulier", "Zakelijk (B2B)", "Beide"];
const DOEL_OPTIONS = ["Leads genereren", "Directe verkoop", "Informatie / branding", "Anders"];
const OPVOLGING_OPTIONS = ["Gestructureerd proces", "Handmatig / wisselend", "Nauwelijks / geen proces"];

const IntakeForm = () => {
  const [step, setStep] = useState(0); // 0 = intro
  const [data, setData] = useState<FormData>(initialData);
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 6;

  const updateField = <K extends keyof FormData>(
    section: K,
    field: keyof FormData[K],
    value: FormData[K][keyof FormData[K]]
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const toggleKanaal = (kanaal: string) => {
    setData((prev) => {
      const current = prev.marketing.kanalen;
      const updated = current.includes(kanaal)
        ? current.filter((k) => k !== kanaal)
        : [...current, kanaal];
      return { ...prev, marketing: { ...prev.marketing, kanalen: updated } };
    });
  };

  const handleSubmit = () => {
    console.log("Intake submitted:", JSON.stringify(data, null, 2));
    setSubmitted(true);
  };

  const next = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  // Intro screen
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hero-start to-hero-end flex items-center justify-center p-6">
        <div className="max-w-xl text-center space-y-8">
          <div className="space-y-1">
            <p className="text-primary-foreground/60 text-sm font-medium tracking-widest uppercase">Lynqed</p>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground leading-tight">
            Intake – inzicht in jouw bedrijf en marketing
          </h1>
          <p className="text-primary-foreground/75 text-lg leading-relaxed max-w-md mx-auto">
            Deze intake helpt om scherp te krijgen waar de grootste groeikansen liggen binnen jouw marketing en website. Op basis hiervan bereiden we een gerichte analyse en voorstel voor.
          </p>
          <div className="pt-4">
            <Button
              onClick={() => setStep(1)}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-base font-semibold rounded-xl shadow-lg"
            >
              Start intake
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <p className="text-primary-foreground/40 text-sm">Duurt ongeveer 5–8 minuten</p>
        </div>
      </div>
    );
  }

  // Post-submission
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hero-start to-hero-end flex items-center justify-center p-6">
        <div className="max-w-lg text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground">
            Bedankt – we gaan hiermee aan de slag
          </h1>
          <p className="text-primary-foreground/75 text-lg leading-relaxed">
            Op basis van deze intake bereiden we een gerichte analyse voor van jullie marketing, website en groeikansen. Deze nemen we mee in de volgende stap.
          </p>
          <div className="pt-4">
            <Button
              variant="outline"
              size="lg"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 rounded-xl"
              onClick={() => window.open("https://lynqed.frl", "_blank")}
            >
              Terug naar website
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-sm font-medium text-foreground mb-1.5">{children}</label>
  );

  const OptionButton = ({
    selected,
    onClick,
    children,
  }: {
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all duration-200 text-left ${
        selected
          ? "border-primary bg-primary/5 text-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/30"
      }`}
    >
      {children}
    </button>
  );

  const CheckboxButton = ({
    selected,
    onClick,
    children,
  }: {
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all duration-200 text-left ${
        selected
          ? "border-primary bg-primary/5 text-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/30"
      }`}
    >
      {children}
    </button>
  );

  const sectionTitles: Record<number, string> = {
    1: "Bedrijf & context",
    2: "Aanbod & doelgroep",
    3: "Marketing & kanalen",
    4: "Website & conversie",
    5: "Proces & groei",
    6: "Contactgegevens",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold tracking-wider text-primary uppercase">Lynqed</span>
            <span className="text-xs text-muted-foreground">Intake formulier</span>
          </div>
          <ProgressBar currentStep={step} totalSteps={totalSteps} />
        </div>
      </header>

      {/* Form content */}
      <main className="flex-1 flex items-start justify-center py-10 px-6">
        <div className="w-full max-w-2xl space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{sectionTitles[step]}</h2>
            <div className="h-px bg-border mt-4" />
          </div>

          <div className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <Label>Bedrijfsnaam</Label>
                  <Input
                    value={data.company_info.bedrijfsnaam}
                    onChange={(e) => updateField("company_info", "bedrijfsnaam", e.target.value)}
                    placeholder="Naam van het bedrijf"
                    className="bg-card"
                  />
                </div>
                <div>
                  <Label>Website URL</Label>
                  <Input
                    value={data.company_info.website_url}
                    onChange={(e) => updateField("company_info", "website_url", e.target.value)}
                    placeholder="https://..."
                    className="bg-card"
                  />
                </div>
                <div>
                  <Label>Branche</Label>
                  <Input
                    value={data.company_info.branche}
                    onChange={(e) => updateField("company_info", "branche", e.target.value)}
                    placeholder="Bijv. E-commerce, SaaS, Dienstverlening"
                    className="bg-card"
                  />
                </div>
                <div>
                  <Label>Korte omschrijving van wat jullie doen</Label>
                  <Textarea
                    value={data.company_info.omschrijving}
                    onChange={(e) => updateField("company_info", "omschrijving", e.target.value)}
                    placeholder="Beschrijf in een paar zinnen jullie kernactiviteit"
                    rows={3}
                    className="bg-card resize-none"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <Label>Wat is jullie belangrijkste product of dienst?</Label>
                  <Textarea
                    value={data.offer_target.product_dienst}
                    onChange={(e) => updateField("offer_target", "product_dienst", e.target.value)}
                    placeholder="Beschrijf jullie kernproduct of -dienst"
                    rows={3}
                    className="bg-card resize-none"
                  />
                </div>
                <div>
                  <Label>Wie is jullie ideale klant?</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {KLANT_OPTIONS.map((opt) => (
                      <OptionButton
                        key={opt}
                        selected={data.offer_target.ideale_klant === opt}
                        onClick={() => updateField("offer_target", "ideale_klant", opt)}
                      >
                        {opt}
                      </OptionButton>
                    ))}
                  </div>
                  <Input
                    value={data.offer_target.ideale_klant_toelichting}
                    onChange={(e) => updateField("offer_target", "ideale_klant_toelichting", e.target.value)}
                    placeholder="Optioneel: toelichting op de doelgroep"
                    className="bg-card mt-2"
                  />
                </div>
                <div>
                  <Label>Hoe specifiek is jullie doelgroep momenteel gedefinieerd?</Label>
                  <ScaleInput
                    value={data.offer_target.doelgroep_specifiek}
                    onChange={(v) => updateField("offer_target", "doelgroep_specifiek", v)}
                    minLabel="Niet specifiek"
                    maxLabel="Zeer specifiek"
                  />
                </div>
                <div>
                  <Label>Wat is de gemiddelde waarde van een klant (ongeveer)?</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                    <Input
                      value={data.offer_target.klantwaarde}
                      onChange={(e) => updateField("offer_target", "klantwaarde", e.target.value)}
                      placeholder="Bijv. 500"
                      className="bg-card pl-7"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <Label>Welke marketingkanalen gebruiken jullie actief?</Label>
                  <p className="text-xs text-muted-foreground mb-2">Meerdere opties mogelijk</p>
                  <div className="flex flex-wrap gap-2">
                    {MARKETING_KANALEN.map((kanaal) => (
                      <CheckboxButton
                        key={kanaal}
                        selected={data.marketing.kanalen.includes(kanaal)}
                        onClick={() => toggleKanaal(kanaal)}
                      >
                        {kanaal}
                      </CheckboxButton>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Hoeveel investeren jullie maandelijks in marketing?</Label>
                  <div className="flex flex-wrap gap-2">
                    {BUDGET_OPTIONS.map((opt) => (
                      <OptionButton
                        key={opt}
                        selected={data.marketing.budget === opt}
                        onClick={() => updateField("marketing", "budget", opt)}
                      >
                        {opt}
                      </OptionButton>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Wat levert marketing momenteel op?</Label>
                  <Input
                    value={data.marketing.resultaat}
                    onChange={(e) => updateField("marketing", "resultaat", e.target.value)}
                    placeholder="Bijv. leads, omzet, geen duidelijk beeld"
                    className="bg-card"
                  />
                </div>
                <div>
                  <Label>Hoe stabiel is de instroom van leads/opdrachten?</Label>
                  <ScaleInput
                    value={data.marketing.lead_stabiliteit}
                    onChange={(v) => updateField("marketing", "lead_stabiliteit", v)}
                    minLabel="Zeer wisselend"
                    maxLabel="Zeer stabiel"
                  />
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div>
                  <Label>Hoe tevreden zijn jullie over de prestaties van de website?</Label>
                  <ScaleInput
                    value={data.website.tevredenheid}
                    onChange={(v) => updateField("website", "tevredenheid", v)}
                    minLabel="Niet tevreden"
                    maxLabel="Zeer tevreden"
                  />
                </div>
                <div>
                  <Label>Wat is het belangrijkste doel van de website?</Label>
                  <div className="flex flex-wrap gap-2">
                    {DOEL_OPTIONS.map((opt) => (
                      <OptionButton
                        key={opt}
                        selected={data.website.doel === opt}
                        onClick={() => updateField("website", "doel", opt)}
                      >
                        {opt}
                      </OptionButton>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Waar haken bezoekers volgens jullie af?</Label>
                  <Textarea
                    value={data.website.afhaakmomenten}
                    onChange={(e) => updateField("website", "afhaakmomenten", e.target.value)}
                    placeholder="Bijv. na de homepage, op de prijspagina, bij het contactformulier..."
                    rows={3}
                    className="bg-card resize-none"
                  />
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <div>
                  <Label>Hoe worden leads momenteel opgevolgd?</Label>
                  <div className="flex flex-wrap gap-2">
                    {OPVOLGING_OPTIONS.map((opt) => (
                      <OptionButton
                        key={opt}
                        selected={data.process.opvolging === opt}
                        onClick={() => updateField("process", "opvolging", opt)}
                      >
                        {opt}
                      </OptionButton>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Wat is momenteel de grootste bottleneck in groei?</Label>
                  <Textarea
                    value={data.process.bottleneck}
                    onChange={(e) => updateField("process", "bottleneck", e.target.value)}
                    placeholder="Bijv. te weinig leads, lage conversie, geen capaciteit..."
                    rows={3}
                    className="bg-card resize-none"
                  />
                </div>
                <div>
                  <Label>Wat willen jullie de komende 3–6 maanden bereiken?</Label>
                  <Textarea
                    value={data.process.doelen}
                    onChange={(e) => updateField("process", "doelen", e.target.value)}
                    placeholder="Bijv. meer leads, hogere omzet, betere website..."
                    rows={3}
                    className="bg-card resize-none"
                  />
                </div>
              </>
            )}

            {step === 6 && (
              <>
                <div>
                  <Label>Naam</Label>
                  <Input
                    value={data.contact.naam}
                    onChange={(e) => updateField("contact", "naam", e.target.value)}
                    placeholder="Volledige naam"
                    className="bg-card"
                  />
                </div>
                <div>
                  <Label>E-mailadres</Label>
                  <Input
                    type="email"
                    value={data.contact.email}
                    onChange={(e) => updateField("contact", "email", e.target.value)}
                    placeholder="naam@bedrijf.nl"
                    className="bg-card"
                  />
                </div>
                <div>
                  <Label>Telefoonnummer (optioneel)</Label>
                  <Input
                    type="tel"
                    value={data.contact.telefoon}
                    onChange={(e) => updateField("contact", "telefoon", e.target.value)}
                    placeholder="+31 6 ..."
                    className="bg-card"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  We gebruiken deze informatie alleen om een gerichte analyse en voorstel voor te bereiden.
                </p>
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 pb-8">
            <Button
              variant="ghost"
              onClick={prev}
              disabled={step <= 1}
              className="text-muted-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Vorige
            </Button>

            {step < totalSteps ? (
              <Button onClick={next} className="px-8 rounded-xl">
                Volgende
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="px-8 rounded-xl">
                Verstuur intake
                <Send className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default IntakeForm;
