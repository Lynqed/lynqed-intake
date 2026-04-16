import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, Send, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ProgressBar from "./ProgressBar";
import ScaleInput from "./ScaleInput";
import lynqedLogo from "@/assets/lynqed-logo.png";

interface FormData {
  company_info: {
    bedrijfsnaam: string;
    website_url: string;
    branche: string;
    omschrijving: string;
  };
  goals: {
    doelen_3_6_maanden: string;
    wat_opleveren: string;
    wanneer_succesvol: string;
  };
  target: {
    ideale_klant: string;
    ideale_klant_toelichting: string;
    doelgroep_specifiek: number;
    klantwaarde: string;
  };
  marketing: {
    kanalen: string[];
    budget: string;
    leads_per_maand: string;
    website_tevredenheid: number;
    tracking_inzicht: string;
  };
  samenwerking: {
    bottleneck: string;
    verwachtingen: string;
    betrokkenen: string;
    naam: string;
    email: string;
    telefoon: string;
  };
}

const initialData: FormData = {
  company_info: { bedrijfsnaam: "", website_url: "", branche: "", omschrijving: "" },
  goals: { doelen_3_6_maanden: "", wat_opleveren: "", wanneer_succesvol: "" },
  target: { ideale_klant: "", ideale_klant_toelichting: "", doelgroep_specifiek: 0, klantwaarde: "" },
  marketing: { kanalen: [], budget: "", leads_per_maand: "", website_tevredenheid: 0, tracking_inzicht: "" },
  samenwerking: { bottleneck: "", verwachtingen: "", betrokkenen: "", naam: "", email: "", telefoon: "" },
};

const MARKETING_KANALEN = ["Google Ads", "SEO", "Social ads", "E-mailmarketing", "Geen structurele marketing"];
const BUDGET_OPTIONS = ["€0 – €500", "€500 – €2.000", "€2.000 – €5.000", "€5.000 – €15.000", "€15.000+"];
const KLANT_OPTIONS = ["Particulier", "Zakelijk (B2B)", "Beide"];

const IntakeForm = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 5;

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("intake_submissions").insert({
        company_info: data.company_info as any,
        goals: data.goals as any,
        target: data.target as any,
        marketing: data.marketing as any,
        samenwerking: data.samenwerking as any,
      });
      if (error) throw error;
      toast.success("Intake succesvol verstuurd!");
      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Er ging iets mis bij het versturen. Probeer het opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  // Intro screen
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hero-start to-hero-end flex items-center justify-center p-6">
        <div className="max-w-xl text-center space-y-8">
          <div className="flex justify-center">
            <img src={lynqedLogo} alt="Lynqed" className="h-12" />
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
            <img src={lynqedLogo} alt="Lynqed" className="h-10 mb-2" />
          </div>
          <CheckCircle2 className="h-14 w-14 text-primary mx-auto" />
          <h1 className="text-3xl font-bold text-primary-foreground">
            Bedankt – we gaan hiermee aan de slag
          </h1>
          <p className="text-primary-foreground/75 text-lg leading-relaxed">
            Op basis van deze intake bereiden we een gerichte analyse voor die we meenemen in de volgende stap.
          </p>
          <div className="pt-4">
            <a
              href="https://lynqed.frl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-11 px-8 rounded-xl border-2 border-primary text-primary font-medium text-sm hover:bg-primary/10 transition-colors"
            >
              Terug naar website
            </a>
          </div>
        </div>
      </div>
    );
  }

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-sm font-medium text-foreground mb-1.5">{children}</label>
  );

  const HelperText = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xs text-muted-foreground mt-1.5">{children}</p>
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

  const sectionConfig: Record<number, { title: string; intro: string }> = {
    1: {
      title: "Bedrijf & basis",
      intro: "Om goed van start te gaan, willen we eerst een helder beeld krijgen van jullie bedrijf en wat jullie doen.",
    },
    2: {
      title: "Doelen & richting",
      intro: "In dit onderdeel willen we begrijpen waar jullie naartoe willen groeien en wat deze samenwerking moet opleveren.",
    },
    3: {
      title: "Doelgroep & positionering",
      intro: "Hier kijken we naar wie jullie willen bereiken en hoe jullie je onderscheiden.",
    },
    4: {
      title: "Huidige marketing & website",
      intro: "Dit geeft inzicht in wat er nu al gebeurt en waar mogelijk kansen liggen.",
    },
    5: {
      title: "Samenwerking & verwachtingen",
      intro: "Tot slot stemmen we af hoe de samenwerking eruit moet zien.",
    },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <img src={lynqedLogo} alt="Lynqed" className="h-7" />
            <span className="text-xs text-muted-foreground">Intake formulier</span>
          </div>
          <ProgressBar currentStep={step} totalSteps={totalSteps} />
        </div>
      </header>

      {/* Form content */}
      <main className="flex-1 flex items-start justify-center py-10 px-6">
        <div className="w-full max-w-2xl space-y-8">
          {/* Section header */}
          <div>
            <h2 className="text-2xl font-bold text-foreground">{sectionConfig[step].title}</h2>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
              {sectionConfig[step].intro}
            </p>
            <div className="h-px bg-border mt-5" />
          </div>

          <div className="space-y-7">
            {/* STEP 1 — Bedrijf & basis */}
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

            {/* STEP 2 — Doelen & richting */}
            {step === 2 && (
              <>
                <div>
                  <Label>Wat willen jullie de komende 3–6 maanden bereiken?</Label>
                  <Textarea
                    value={data.goals.doelen_3_6_maanden}
                    onChange={(e) => updateField("goals", "doelen_3_6_maanden", e.target.value)}
                    placeholder="Bijv. meer leads, hogere omzet, betere online zichtbaarheid..."
                    rows={3}
                    className="bg-card resize-none"
                  />
                </div>
                <div>
                  <Label>Wat moet dit traject opleveren?</Label>
                  <Textarea
                    value={data.goals.wat_opleveren}
                    onChange={(e) => updateField("goals", "wat_opleveren", e.target.value)}
                    placeholder="Beschrijf het gewenste resultaat van deze samenwerking"
                    rows={3}
                    className="bg-card resize-none"
                  />
                </div>
                <div>
                  <Label>Wanneer is het voor jullie succesvol?</Label>
                  <Textarea
                    value={data.goals.wanneer_succesvol}
                    onChange={(e) => updateField("goals", "wanneer_succesvol", e.target.value)}
                    placeholder="Bijv. X aantal leads per maand, bepaalde omzetgroei..."
                    rows={3}
                    className="bg-card resize-none"
                  />
                  <HelperText>Je hoeft dit niet perfect te formuleren, een duidelijke richting is voldoende.</HelperText>
                </div>
              </>
            )}

            {/* STEP 3 — Doelgroep & positionering */}
            {step === 3 && (
              <>
                <div>
                  <Label>Wie is jullie ideale klant?</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {KLANT_OPTIONS.map((opt) => (
                      <OptionButton
                        key={opt}
                        selected={data.target.ideale_klant === opt}
                        onClick={() => updateField("target", "ideale_klant", opt)}
                      >
                        {opt}
                      </OptionButton>
                    ))}
                  </div>
                  <Input
                    value={data.target.ideale_klant_toelichting}
                    onChange={(e) => updateField("target", "ideale_klant_toelichting", e.target.value)}
                    placeholder="Optioneel: toelichting op de doelgroep"
                    className="bg-card mt-2"
                  />
                </div>
                <div>
                  <Label>Hoe specifiek is jullie doelgroep momenteel gedefinieerd?</Label>
                  <ScaleInput
                    value={data.target.doelgroep_specifiek}
                    onChange={(v) => updateField("target", "doelgroep_specifiek", v)}
                    minLabel="Niet specifiek"
                    maxLabel="Zeer specifiek"
                  />
                </div>
                <div>
                  <Label>Wat is de gemiddelde waarde van een klant (ongeveer)?</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                    <Input
                      value={data.target.klantwaarde}
                      onChange={(e) => updateField("target", "klantwaarde", e.target.value)}
                      placeholder="Bijv. 500"
                      className="bg-card pl-7"
                    />
                  </div>
                </div>
              </>
            )}

            {/* STEP 4 — Huidige marketing & website */}
            {step === 4 && (
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
                  <Label>Hoeveel leads of aanvragen krijgen jullie per maand (ongeveer)?</Label>
                  <Input
                    value={data.marketing.leads_per_maand}
                    onChange={(e) => updateField("marketing", "leads_per_maand", e.target.value)}
                    placeholder="Bijv. 10, 50, geen idee"
                    className="bg-card"
                  />
                </div>
                <div>
                  <Label>Hoe tevreden zijn jullie over de prestaties van de website?</Label>
                  <ScaleInput
                    value={data.marketing.website_tevredenheid}
                    onChange={(v) => updateField("marketing", "website_tevredenheid", v)}
                    minLabel="Niet tevreden"
                    maxLabel="Zeer tevreden"
                  />
                </div>
              </>
            )}

            {/* STEP 5 — Samenwerking & verwachtingen */}
            {step === 5 && (
              <>
                <div>
                  <Label>Wat is momenteel de grootste bottleneck in groei?</Label>
                  <Textarea
                    value={data.samenwerking.bottleneck}
                    onChange={(e) => updateField("samenwerking", "bottleneck", e.target.value)}
                    placeholder="Bijv. te weinig leads, lage conversie, geen capaciteit..."
                    rows={3}
                    className="bg-card resize-none"
                  />
                </div>
                <div>
                  <Label>Wat verwachten jullie van Lynqed?</Label>
                  <Textarea
                    value={data.samenwerking.verwachtingen}
                    onChange={(e) => updateField("samenwerking", "verwachtingen", e.target.value)}
                    placeholder="Bijv. strategisch advies, uitvoering, sparringpartner..."
                    rows={3}
                    className="bg-card resize-none"
                  />
                </div>
                <div>
                  <Label>Wie zijn er betrokken bij dit traject?</Label>
                  <Input
                    value={data.samenwerking.betrokkenen}
                    onChange={(e) => updateField("samenwerking", "betrokkenen", e.target.value)}
                    placeholder="Bijv. eigenaar, marketingmanager, extern bureau"
                    className="bg-card"
                  />
                </div>

                <div className="h-px bg-border" />
                <p className="text-sm font-medium text-foreground">Contactgegevens</p>

                <div>
                  <Label>Naam</Label>
                  <Input
                    value={data.samenwerking.naam}
                    onChange={(e) => updateField("samenwerking", "naam", e.target.value)}
                    placeholder="Volledige naam"
                    className="bg-card"
                  />
                </div>
                <div>
                  <Label>E-mailadres</Label>
                  <Input
                    type="email"
                    value={data.samenwerking.email}
                    onChange={(e) => updateField("samenwerking", "email", e.target.value)}
                    placeholder="naam@bedrijf.nl"
                    className="bg-card"
                  />
                </div>
                <div>
                  <Label>Telefoonnummer (optioneel)</Label>
                  <Input
                    type="tel"
                    value={data.samenwerking.telefoon}
                    onChange={(e) => updateField("samenwerking", "telefoon", e.target.value)}
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
