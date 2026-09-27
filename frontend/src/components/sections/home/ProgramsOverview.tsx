import { BookOpen, GraduationCap, Library, Tent, HeartPulse, Home, TreePine, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const programs = [
  {
    icon: BookOpen,
    title: 'Education & Footpath Learning',
    description: 'जहाँ बच्चे हैं, वहीं से सीखने की शुरुआत।'
  },
  {
    icon: GraduationCap,
    title: 'School Admission & Support',
    description: 'बच्चों को औपचारिक शिक्षा और स्कूलों से जोड़ने में सहयोग।'
  },
  {
    icon: Users,
    title: 'Educational Support',
    description: 'पढ़ाई जारी रखने के लिए जरूरी मार्गदर्शन और मदद।'
  },
  {
    icon: Library,
    title: 'Free Digital Shiksha & Library',
    description: 'किताबों, नोट्स, PDFs और डिजिटल learning resources तक मुफ्त पहुँच।'
  },
  {
    icon: Tent,
    title: 'Bath Tent & Dignity Support',
    description: 'फुटपाथ पर रहने वाले परिवारों के लिए सुरक्षित स्नान की व्यवस्था।'
  },
  {
    icon: HeartPulse,
    title: 'Health & Hygiene',
    description: 'स्वच्छता और स्वास्थ्य के प्रति जागरूकता और सहयोग।'
  },
  {
    icon: Home,
    title: 'Family & Essential Support',
    description: 'जरूरतमंद परिवारों के लिए बुनियादी जरूरतों में मदद।'
  },
  {
    icon: TreePine,
    title: 'Environment & Plantation',
    description: 'पर्यावरण संरक्षण और हरियाली बढ़ाने की पहल।'
  }
];

export function ProgramsOverview() {
  return (
    <section className="py-16 md:py-24 bg-surface-muted">
      <div className="container-default">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-h2 mb-3">हम क्या करते हैं</h2>
          <p className="text-body-large">
            शिक्षा से लेकर स्वास्थ्य, गरिमा और परिवारों के सहयोग तक — हमारा काम बच्चों के जीवन को कई स्तरों पर बेहतर बनाने की कोशिश करता है।
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {programs.map((program, index) => (
            <Link 
              key={index}
              to="/programs" 
              className="card p-5 flex flex-col group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-3 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <program.icon className="w-5 h-5" />
              </div>
              <h3 className="text-h4 mb-1.5 group-hover:text-brand-primary transition-colors">{program.title}</h3>
              <p className="text-body-small mt-auto leading-relaxed">{program.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
