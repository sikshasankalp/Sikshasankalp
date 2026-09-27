import { Button } from '../../buttons/Button';

export function GetInvolvedSection() {
  return (
    <section className="py-14 md:py-20 bg-brand-primary text-white">
      <div className="container-default text-center max-w-2xl mx-auto">
        <h2 className="text-h2 mb-4">आप भी इस संकल्प का हिस्सा बन सकते हैं</h2>
        <p className="text-base md:text-lg text-white/90 mb-8 leading-relaxed">
          किसी बच्चे को पढ़ाने से लेकर digital support, photography, health awareness या community activities में सहयोग करने तक — हर योगदान मायने रखता है।
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button to="/get-involved" variant="accent" size="lg" className="w-full sm:w-auto">
            Volunteer करें
          </Button>
          <Button to="/partner-with-us" className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10" size="lg">
            Partner With Us
          </Button>
        </div>
      </div>
    </section>
  );
}
