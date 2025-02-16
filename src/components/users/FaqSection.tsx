import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

const FAQSection = () => {
  const questions = [
    {
      question: "How many doctors are available?",
      answer: "We have over 20,000+ verified doctors across 25+ specialties available for online consultation. Our doctors are carefully selected and verified to ensure you receive the highest quality care."
    },
    {
      question: "What is the duration of consultation?",
      answer: "Typical consultation duration is 15-30 minutes, but can be extended based on your medical needs. Follow-up consultations are usually shorter, around 10-15 minutes."
    },
    {
      question: "How does online consultation work?",
      answer: "Simply book an appointment with your preferred doctor, join the video call at the scheduled time, discuss your health concerns, and receive a digital prescription if needed. All consultations are private and secure."
    },
    {
      question: "What are the payment options?",
      answer: "We accept various payment methods including credit/debit cards, digital wallets, and net banking. All payments are secure and you'll only be charged after the consultation is complete."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto my-16">
      <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {questions.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};


export default FAQSection;