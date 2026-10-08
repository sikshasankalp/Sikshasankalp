import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  BookOpen,
  Languages,
  Sparkles,
  HeartHandshake,
  Laptop,
  Briefcase,
  Sprout,
  ClipboardCheck,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { Button } from '../../buttons/Button';
import { useLanguage } from '../../../context/LanguageContext';

export interface RoadmapStep {
  id: string;
  number: string;
  titleEn: string;
  titleHi: string;
  shortDescEn: string;
  shortDescHi: string;
  detailEn: string;
  detailHi: string;
  phaseEn: string;
  phaseHi: string;
  nepEn: string;
  nepHi: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  accentBg: string;
  bulletPointsEn: string[];
  bulletPointsHi: string[];
}

export const ROADMAP_STEPS: RoadmapStep[] = [
  {
    id: 'inclusive-education',
    number: '01',
    titleEn: 'Inclusive Education',
    titleHi: 'समावेशी शिक्षा',
    shortDescEn: 'Reaching street & underserved children and integrating them into education',
    shortDescHi: 'फुटपाथ और वंचित बच्चों की पहचान कर शिक्षा से जोड़ना',
    detailEn: 'Identifying children living on footpaths, railway platforms, and construction sites. We build trust with families and create open learning hubs where every child feels dignified and welcome.',
    detailHi: 'फुटपाथ, बस्तियों और वंचित परिवेश में रहने वाले बच्चों की पहचान करना, उनके परिवारों का विश्वास जीतना और यह सुनिश्चित करना कि कोई भी बच्चा सामाजिक व आर्थिक मजबूरी के कारण शिक्षा से वंचित न रहे।',
    phaseEn: 'Phase 1: Mobilization & Trust',
    phaseHi: 'चरण 1: संपर्क व विश्वास',
    nepEn: 'NEP 2020: Equitable & Inclusive Education',
    nepHi: 'एनईपी 2020: न्यायसंगत और समावेशी शिक्षा',
    icon: Users,
    color: '#E05638',
    accentBg: 'rgba(224, 86, 56, 0.12)',
    bulletPointsEn: [
      'Street outreach & parent counselling',
      'Zero barrier open footpath learning hubs',
      'Safe, welcoming, and judgment-free atmosphere',
    ],
    bulletPointsHi: [
      'फुटपाथ व झुग्गी स्तर पर पहचान व अभिभावक संवाद',
      'बिना किसी रुकावट के खुली पाठशालाएं',
      'सुरक्षित, सम्मानजनक व उत्साहवर्धक माहौल',
    ],
  },
  {
    id: 'fln-foundational',
    number: '02',
    titleEn: 'Foundational Learning (FLN)',
    titleHi: 'बुनियादी साक्षरता व संख्याज्ञान (FLN)',
    shortDescEn: 'Reading, writing, addition, subtraction, division & cognitive basics',
    shortDescHi: 'Reading, writing, जोड़-घटाना, भाग आदि बुनियादी ज्ञान',
    detailEn: 'Focused pedagogical modules on basic alphabet recognition, sentence formation, reading fluency, and core numeracy (addition, subtraction, division) to eliminate foundational learning poverty.',
    detailHi: 'अक्षर ज्ञान, पठन प्रवाह, लेखन और बुनियादी गणितीय क्रियाओं (जोड़, घटाव, गुणा, भाग) पर विशेष ध्यान, ताकि बच्चे की मानसिक व तार्किक नींव सबसे पहले मजबूत हो।',
    phaseEn: 'Phase 1: Mobilization & Trust',
    phaseHi: 'चरण 1: संपर्क व विश्वास',
    nepEn: 'NEP 2020: Highest Priority to Foundational Literacy & Numeracy',
    nepHi: 'एनईपी 2020: बुनियादी साक्षरता एवं संख्या ज्ञान को सर्वोच्च प्राथमिकता',
    icon: BookOpen,
    color: '#D97706',
    accentBg: 'rgba(217, 119, 6, 0.12)',
    bulletPointsEn: [
      'Daily phonetic & reading practice circles',
      'Practical mental arithmetic with tangible beads and counters',
      'Diagnostic baseline & continuous reading level upgrades',
    ],
    bulletPointsHi: [
      'प्रतिदिन वर्णमाला व पढ़ने का सामूहिक अभ्यास',
      'दैनिक जीवन से जुड़ी गणितीय गतिविधियां व खेल',
      'बच्चों के स्तर अनुसार व्यक्तिगत सहयोग',
    ],
  },
  {
    id: 'multilingual-learning',
    number: '03',
    titleEn: 'Multilingual Learning',
    titleHi: 'बहुभाषी शिक्षण',
    shortDescEn: 'Hindi + English taught tailored to children’s natural understanding',
    shortDescHi: 'हिंदी + English और बच्चों की समझ के अनुसार शिक्षण',
    detailEn: 'Bridging language barriers by starting teaching in the child’s native dialect or mother tongue, gradually building bilingual mastery in fluent Hindi and conversational English.',
    detailHi: 'बच्चे की मातृभाषा और बोलचाल की भाषा का सम्मान करते हुए शिक्षण शुरू करना और धीरे-धीरे मानक हिंदी व व्यावहारिक अंग्रेजी में सहज आत्मविश्वास जगाना।',
    phaseEn: 'Phase 2: Joyful Discovery',
    phaseHi: 'चरण 2: आनंदमयी सीख',
    nepEn: 'NEP 2020: Multilingualism & Power of Language',
    nepHi: 'एनईपी 2020: बहुभाषावाद और मातृभाषा का महत्व',
    icon: Languages,
    color: '#0284C7',
    accentBg: 'rgba(2, 132, 199, 0.12)',
    bulletPointsEn: [
      'Instruction starting in familiar mother tongue',
      'Bilingual pictorial vocabulary story flashcards',
      'Spoken English confidence without exam anxiety',
    ],
    bulletPointsHi: [
      'बच्चे की सहज मातृभाषा से शुरुआत',
      'चित्रमयी शब्दावली व द्वैभाषिक कहानियों की पुस्तकें',
      'संवाद आधारित अंग्रेजी सीखने का सहज अभ्यास',
    ],
  },
  {
    id: 'experiential-learning',
    number: '04',
    titleEn: 'Experiential Learning',
    titleHi: 'अनुभवात्मक अधिगम (करके सीखना)',
    shortDescEn: 'Learning through activities, games, science kits and hands-on discovery',
    shortDescHi: 'Activities, games और practical learning के जरिए समझ',
    detailEn: 'Saying goodbye to dull rote memorization. Children understand science, nature, and geography through games, role-playing, practical experiments, and interactive creative activities.',
    detailHi: 'रटने की पुरानी प्रथा को खत्म कर खेल, पहेलियों, विज्ञान किट्स, रोल-प्ले और प्रत्यक्ष अनुभवों के जरिए हर विषय को रोचक और यादगार बनाना।',
    phaseEn: 'Phase 2: Joyful Discovery',
    phaseHi: 'चरण 2: आनंदमयी सीख',
    nepEn: 'NEP 2020: Experiential & Inquiry-Based Pedagogy',
    nepHi: 'एनईपी 2020: अनुभवात्मक व जिज्ञासा-आधारित शिक्षण',
    icon: Sparkles,
    color: '#7C3AED',
    accentBg: 'rgba(124, 58, 237, 0.12)',
    bulletPointsEn: [
      'Toy-based and game-integrated lesson plans',
      'Mini outdoor nature and community exploration',
      'Creative clay, drawing, and puzzle solving sessions',
    ],
    bulletPointsHi: [
      'खेल-खिलौनों व गतिविधि आधारित पाठ योजना',
      'आस-पास के वातावरण और समाज से सीखने के अवसर',
      'चित्रकला, शिल्प और दिमागी पहेलियां',
    ],
  },
  {
    id: 'life-skills',
    number: '05',
    titleEn: 'Life Skills & Values',
    titleHi: 'जीवन कौशल व संस्कार',
    shortDescEn: 'Communication, personal hygiene, self-confidence & decision making',
    shortDescHi: 'Communication, hygiene, confidence और decision-making',
    detailEn: 'Empowering children with personal hygiene routines (handwashing, dental care), public speaking confidence, emotional balance, peer collaboration, and strong ethical values.',
    detailHi: 'दैनिक स्वच्छता (हाथ धोना, दांतों की सफाई), संवाद कौशल, निडर आत्मविश्वास, आपसी सहयोग और सही-गलत का निर्णय लेने की समझ का विकास।',
    phaseEn: 'Phase 3: Life Skills & Values',
    phaseHi: 'चरण 3: कौशल व मूल्य',
    nepEn: 'NEP 2020: Holistic Ethics & 21st Century Life Skills',
    nepHi: 'एनईपी 2020: 21वीं सदी के जीवन कौशल व नैतिक मूल्य',
    icon: HeartHandshake,
    color: '#059669',
    accentBg: 'rgba(5, 150, 105, 0.12)',
    bulletPointsEn: [
      'Daily morning hygiene & grooming inspection',
      'Public speaking and self-expression circles',
      'Empathy, gender equality, and problem-solving exercises',
    ],
    bulletPointsHi: [
      'दैनिक स्वास्थ्य व व्यक्तिगत स्वच्छता पर विशेष जोर',
      'बिना झिझक अपनी बात रखने का मंच',
      'सहानुभूति, लैंगिक समानता व टीमवर्क के संस्कार',
    ],
  },
  {
    id: 'digital-literacy',
    number: '06',
    titleEn: 'Digital Literacy',
    titleHi: 'डिजिटल साक्षरता',
    shortDescEn: 'Tablet learning, interactive audio-visual modules & online resources',
    shortDescHi: 'Digital & online learning और स्मार्ट टूल्स का ज्ञान',
    detailEn: 'Bridging the digital divide for first-generation learners through learning tablets, smart screens, educational animated videos, and safe internet awareness.',
    detailHi: 'फुटपाथ के बच्चों को आधुनिक डिजिटल दुनिया से जोड़ना। टैबलेट्स, स्मार्ट स्क्रीन और इंटरैक्टिव वीडियो पाठों द्वारा तकनीक का सही उपयोग सिखाना।',
    phaseEn: 'Phase 3: Life Skills & Values',
    phaseHi: 'चरण 3: कौशल व मूल्य',
    nepEn: 'NEP 2020: Technology Integration in Educational Framework',
    nepHi: 'एनईपी 2020: शिक्षा में तकनीक का प्रभावी समावेश',
    icon: Laptop,
    color: '#2563EB',
    accentBg: 'rgba(37, 99, 235, 0.12)',
    bulletPointsEn: [
      'Interactive touch tablet learning sessions',
      'Visual storytelling & science animation lessons',
      'Basic typing, navigation & online safety basics',
    ],
    bulletPointsHi: [
      'टैबलेट और टच-स्क्रीन द्वारा डिजिटल अभ्यास',
      'दृश्य-श्रव्य (Audio-Visual) माध्यम से संकल्पनाएं स्पष्ट',
      'बेसिक कंप्यूटर समझ व सुरक्षित उपयोग',
    ],
  },
  {
    id: 'vocational-exposure',
    number: '07',
    titleEn: 'Vocational Exposure',
    titleHi: 'व्यावसायिक अनुभव व मार्गदर्शन',
    shortDescEn: 'Practical hands-on skills, workshops & early career awareness',
    shortDescHi: 'Practical skills और भविष्य के करियर के प्रति जागरूकता',
    detailEn: 'Introducing age-appropriate practical skills, craftsmanship exposure, creative hobby workshops, and career dreams to expand horizons beyond menial labour.',
    detailHi: 'बच्चों को छोटी उम्र से ही विभिन्न सम्मानजनक पेशों, व्यावहारिक कौशलों (कला, शिल्प, बुनियादी तकनीकी समझ) और करियर की संभावनाओं से रूबरू कराना।',
    phaseEn: 'Phase 3: Life Skills & Values',
    phaseHi: 'चरण 3: कौशल व मूल्य',
    nepEn: 'NEP 2020: Vocational Craft Exposure from Early Years',
    nepHi: 'एनईपी 2020: प्रारंभिक वर्षों से व्यावसायिक कौशल अनुभव',
    icon: Briefcase,
    color: '#B45309',
    accentBg: 'rgba(180, 83, 9, 0.12)',
    bulletPointsEn: [
      'Interaction with inspiring professionals & mentors',
      'Hands-on craft, design, and practical DIY activities',
      'Career mapping and dreaming beyond poverty cycles',
    ],
    bulletPointsHi: [
      'विभिन्न क्षेत्रों के सफल लोगों से संवाद',
      'हस्तकला, रचनात्मक डिजाइन व क्राफ्ट कार्यशालाएं',
      'गरीबी के चक्र से बाहर निकलकर बड़ा सोचने की प्रेरणा',
    ],
  },
  {
    id: 'holistic-development',
    number: '08',
    titleEn: 'Holistic Development',
    titleHi: 'समग्र बाल विकास (360°)',
    shortDescEn: 'Education + health checkups + mental wellbeing + physical sports',
    shortDescHi: 'Education + health + wellbeing + values का संपूर्ण संगम',
    detailEn: 'Treating education as an ecosystem of mind and body. We integrate regular pediatric health checkups, nutritional refreshments, sports, arts, and emotional counselling.',
    detailHi: 'केवल किताबों तक सीमित न रहकर बच्चे के शारीरिक, मानसिक और भावनात्मक विकास पर ध्यान देना—नियमित स्वास्थ्य जांच, पौष्टिक आहार, खेलकूद और मानसिक सुकून।',
    phaseEn: 'Phase 4: Transformation & Future',
    phaseHi: 'चरण 4: रूपांतरण व उज्ज्वल भविष्य',
    nepEn: 'NEP 2020: 360-Degree Holistic Progress Evaluation',
    nepHi: 'एनईपी 2020: समग्र व 360-डिग्री सर्वांगीण बाल विकास',
    icon: Sprout,
    color: '#16A34A',
    accentBg: 'rgba(22, 163, 74, 0.12)',
    bulletPointsEn: [
      'Quarterly pediatric medical and dental screenings',
      'Daily nutrition snacks for energy and concentration',
      'Yoga, physical sports, music, and mindfulness',
    ],
    bulletPointsHi: [
      'समय-समय पर डॉक्टरी जांच व दवाइयां',
      'प्रतिदिन पौष्टिक अल्पाहार (Nutrition Support)',
      'योग, खेलकूद, संगीत और ध्यान के सत्र',
    ],
  },
  {
    id: 'continuous-assessment',
    number: '09',
    titleEn: 'Continuous Assessment',
    titleHi: 'सतत मूल्यांकन व प्रगति ट्रैकिंग',
    shortDescEn: 'Stress-free learning evaluation, milestone tests & personalized tracking',
    shortDescHi: 'बच्चों की learning का regular test और progress tracking',
    detailEn: 'Fear-free, constructive evaluation. We track each child’s reading speed, math capabilities, and behavioral progress with individual report cards to target specific learning gaps.',
    detailHi: 'बिना परीक्षा के तनाव के, बच्चे की वास्तविक सीख का सतत आकलन। हर बच्चे का व्यक्तिगत प्रोग्रेस चार्ट बनाकर उसकी कमजोरियों को दूर करने की विशेष रणनीति।',
    phaseEn: 'Phase 4: Transformation & Future',
    phaseHi: 'चरण 4: रूपांतरण व उज्ज्वल भविष्य',
    nepEn: 'NEP 2020: Shift from Rote to Competency-Based Assessment',
    nepHi: 'एनईपी 2020: योग्यता व समझ पर आधारित सतत मूल्यांकन',
    icon: ClipboardCheck,
    color: '#4F46E5',
    accentBg: 'rgba(79, 70, 229, 0.12)',
    bulletPointsEn: [
      'No pass-fail stigma; focuses entirely on mastery',
      'Individualized student learning portfolio',
      'Parent-teacher progress celebrations on footpaths',
    ],
    bulletPointsHi: [
      'फेल होने का कोई डर नहीं, केवल सीखने पर बल',
      'हर बच्चे का अलग लर्निंग प्रोग्रेस रिकॉर्ड',
      'अभिभावकों के साथ प्रगति साझा करने की नियमित बैठकें',
    ],
  },
  {
    id: 'school-transition',
    number: '10',
    titleEn: 'School Transition & Retention',
    titleHi: 'औपचारिक स्कूल प्रवेश व निरंतरता',
    shortDescEn: 'Admission in formal schools, documentation & dropout prevention',
    shortDescHi: 'बच्चों को formal school में admission और retention',
    detailEn: 'The ultimate milestone. We prepare official documents (Aadhaar, birth proofs), secure admissions in recognized government & private schools, and continuously track attendance so no child drops out.',
    detailHi: 'हमारी यात्रा का अंतिम व सबसे बड़ा पड़ाव—दस्तावेज (आधार कार्ड, जन्म प्रमाण पत्र आदि) तैयार करवाकर मान्यता प्राप्त स्कूलों में दाखिला दिलाना और लगातार निगरानी रखकर ड्रॉपआउट रोकना।',
    phaseEn: 'Phase 4: Transformation & Future',
    phaseHi: 'चरण 4: रूपांतरण व उज्ज्वल भविष्य',
    nepEn: 'NEP 2020: 100% Gross Enrolment & Zero Dropout Goal',
    nepHi: 'एनईपी 2020: 100% सकल नामांकन अनुपात व शून्य ड्रॉपआउट लक्ष्य',
    icon: GraduationCap,
    color: '#C85A27',
    accentBg: 'rgba(200, 90, 39, 0.15)',
    bulletPointsEn: [
      'Government & private school admission facilitation',
      'Free uniforms, school bags, and stationery support',
      'Post-admission daily after-school remedial tutoring & retention monitoring',
    ],
    bulletPointsHi: [
      'सरकारी व निजी स्कूलों में नियमित दाखिला प्रक्रिया',
      'मुफ्त यूनिफॉर्म, बस्ता और अध्ययन सामग्री वितरण',
      'दाखिले के बाद भी शाम को होमवर्क व ट्यूशन सपोर्ट',
    ],
  },
];

export function EducationRoadmapSection() {
  const { language } = useLanguage();
  const isHi = language === 'Hindi';
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const current = ROADMAP_STEPS[activeIdx];
  const StepIcon = current.icon;

  // Auto-tour through the journey
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % ROADMAP_STEPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? ROADMAP_STEPS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % ROADMAP_STEPS.length);
  };

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#181614] via-[#1c1917] to-[#141210] text-white border-y border-[#2c2621] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C85A27]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-default relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C85A27]/15 border border-[#C85A27]/30 text-[#E07A48] text-xs sm:text-sm font-semibold tracking-wide uppercase mb-4 shadow-xs">
            <Award className="w-4 h-4 text-[#E07A48]" />
            <span>{isHi ? 'एनईपी 2020 दृष्टिकोण • फुटपाथ से उज्ज्वल भविष्य' : 'NEP 2020 Aligned • From Footpath to Bright Future'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight leading-[1.2] mb-4">
            {isHi ? (
              <>
                हमारी शिक्षण पद्धति:{' '}
                <span className="text-[#E07A48]">NEP 2020</span> के विज़न से प्रेरित
              </>
            ) : (
              <>
                Our Education Approach{' '}
                <span className="text-[#E07A48]">Aligned with NEP 2020</span>
              </>
            )}
          </h2>

          <p className="text-stone-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-6">
            {isHi
              ? 'हम फुटपाथ और वंचित पृष्ठभूमि के बच्चों को गतिविधि-आधारित, समावेशी और समग्र शिक्षा प्रदान करते हैं—ताकि उनका बुनियादी ज्ञान मजबूत हो और वे सम्मान के साथ औपचारिक स्कूल में प्रवेश कर सकें।'
              : 'We provide inclusive, activity-based, and child-centred education to children from underserved communities, focusing on foundational learning, school readiness, life skills, and holistic development.'}
          </p>

          {/* 3 Vision Pillars from Poster */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-stone-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E07A48]" />
              {isHi ? 'हर बच्चा सीखेगा' : 'Every Child Learns'}
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-stone-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E07A48]" />
              {isHi ? 'हर बच्चे का सम्मान' : 'Every Child Belongs'}
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-stone-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E07A48]" />
              {isHi ? 'हर बच्चे का सुनहरा भविष्य' : 'Every Child Has a Future'}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP WAVY INTERACTIVE PATHWAY (Visible on lg+) */}
        {/* ========================================================================= */}
        <div className="hidden lg:block mb-12 relative">
          {/* Header Controls for Auto Tour */}
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-stone-400">
              <Compass className="w-4 h-4 text-[#C85A27]" />
              <span>{isHi ? '10-चरणीय सीखने की जीवन-यात्रा' : '10-Step Interactive Learning Roadmap'}</span>
              <span className="text-stone-600">•</span>
              <span className="text-[#E07A48] font-bold">
                {isHi ? `चरण ${current.number} / 10` : `Step ${current.number} of 10`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/15 text-stone-200 border border-white/10 transition-colors"
                title={isPlaying ? 'Pause auto walkthrough' : 'Play auto walkthrough'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#E07A48]" />
                    <span>{isHi ? 'रोकें' : 'Pause Tour'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#E07A48]" />
                    <span>{isHi ? 'ऑटो टूर चलाएं' : 'Auto Journey'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SVG Wavy Ribbon Track Container */}
          <div className="relative w-full h-[180px] bg-[#161412] rounded-3xl border border-[#2b2520] p-4 overflow-hidden shadow-inner">
            {/* Background SVG Wavy Line */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1000 180"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient id="wavyPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E05638" stopOpacity="0.4" />
                  <stop offset="25%" stopColor="#D97706" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#0284C7" stopOpacity="0.8" />
                  <stop offset="75%" stopColor="#16A34A" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#C85A27" stopOpacity="1" />
                </linearGradient>
                <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Underlying glowing track */}
              <path
                d="M 40 90 Q 90 35, 145 90 T 250 90 T 355 90 T 460 90 T 565 90 T 670 90 T 775 90 T 880 90 T 960 90"
                stroke="url(#wavyPathGrad)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                filter="url(#glowFilter)"
              />
              <path
                d="M 40 90 Q 90 35, 145 90 T 250 90 T 355 90 T 460 90 T 565 90 T 670 90 T 775 90 T 880 90 T 960 90"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                fill="none"
              />
            </svg>

            {/* 10 Milestone Interactive Pins Placed on the Path */}
            <div className="relative w-full h-full flex items-center justify-between px-3 z-10">
              {ROADMAP_STEPS.map((step, idx) => {
                const isActive = idx === activeIdx;
                const Icon = step.icon;
                // Alternating vertical wave bounce: even steps slightly up, odd steps slightly down
                const verticalOffset = idx % 2 === 0 ? '-translate-y-5' : 'translate-y-5';

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      setActiveIdx(idx);
                      setIsPlaying(false);
                    }}
                    className={`group relative flex flex-col items-center transition-all duration-300 transform ${verticalOffset} focus:outline-none`}
                  >
                    {/* Active Pulsing Ring */}
                    {isActive && (
                      <span
                        className="absolute -inset-2 rounded-full animate-ping opacity-60 pointer-events-none"
                        style={{ backgroundColor: step.color }}
                      />
                    )}

                    {/* Milestone Pin Icon Bubble */}
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-md ${
                        isActive
                          ? 'scale-125 ring-4 ring-white/30 text-white z-20'
                          : 'bg-[#221e1a] border-[#3d342c] text-stone-400 hover:border-stone-300 hover:text-white hover:scale-110'
                      }`}
                      style={{
                        backgroundColor: isActive ? step.color : undefined,
                        borderColor: isActive ? '#ffffff' : undefined,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Step Number Badge */}
                    <span
                      className={`text-[11px] font-bold mt-1.5 px-1.5 py-0.5 rounded transition-colors ${
                        isActive
                          ? 'bg-white text-black font-extrabold shadow-xs'
                          : 'text-stone-400 group-hover:text-stone-200'
                      }`}
                    >
                      {step.number}
                    </span>

                    {/* Micro Title preview below */}
                    <span
                      className={`text-[10px] font-medium max-w-[70px] text-center truncate mt-0.5 ${
                        isActive ? 'text-[#E07A48] font-bold' : 'text-stone-500 group-hover:text-stone-300'
                      }`}
                    >
                      {isHi ? step.titleHi : step.titleEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE HORIZONTAL PILL SELECTOR (Visible on mobile/tablet) */}
        {/* ========================================================================= */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-stone-400">
              {isHi ? `कदम ${current.number} / 10` : `Step ${current.number} of 10`}
            </span>
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/10 text-stone-200"
            >
              {isPlaying ? <Pause className="w-3 h-3 text-[#E07A48]" /> : <Play className="w-3 h-3 text-[#E07A48]" />}
              <span>{isPlaying ? (isHi ? 'रोकें' : 'Pause') : (isHi ? 'ऑटो टूर' : 'Auto')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {ROADMAP_STEPS.map((step, idx) => {
              const isActive = idx === activeIdx;
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    setActiveIdx(idx);
                    setIsPlaying(false);
                  }}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    isActive
                      ? 'bg-[#C85A27] text-white border-transparent shadow-md'
                      : 'bg-[#221e1a] text-stone-300 border-[#383028] hover:bg-[#2b2621]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{step.number}</span>
                  <span className="max-w-[90px] truncate">{isHi ? step.titleHi : step.titleEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE DETAIL SPOTLIGHT CARD (Animated on step change) */}
        {/* ========================================================================= */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1e1b18] rounded-3xl border border-[#352c25] p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
              {/* Subtle accent corner highlight */}
              <div
                className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-25"
                style={{ backgroundColor: current.color }}
              />

              <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 md:gap-12 items-center relative z-10">
                {/* Left Side: Step Details & Pedagogy */}
                <div>
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase text-white shadow-xs"
                      style={{ backgroundColor: current.color }}
                    >
                      {isHi ? `चरण ${current.number}` : `STEP ${current.number}`}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-stone-300 border border-white/10">
                      {isHi ? current.phaseHi : current.phaseEn}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2a241f] text-[#E07A48] border border-[#C85A27]/30">
                      {isHi ? current.nepHi : current.nepEn}
                    </span>
                  </div>

                  {/* Step Title in En and Hi */}
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-2 leading-tight">
                    {isHi ? current.titleHi : current.titleEn}
                  </h3>
                  <p className="text-base sm:text-lg font-medium text-[#E07A48] mb-4">
                    {isHi ? current.shortDescHi : current.shortDescEn}
                  </p>

                  {/* Main Detail Paragraph */}
                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6">
                    {isHi ? current.detailHi : current.detailEn}
                  </p>

                  {/* Bullet points of execution */}
                  <div className="space-y-2.5 mb-8">
                    {(isHi ? current.bulletPointsHi : current.bulletPointsEn).map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-200">
                        <CheckCircle2
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: current.color }}
                        />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>

                  {/* Navigation & Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors border border-white/10"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>{isHi ? 'पिछला चरण' : 'Previous'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#C85A27] hover:bg-[#d46531] text-white transition-colors shadow-md"
                    >
                      <span>{isHi ? 'अगला चरण' : 'Next Step'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="sm:ml-auto">
                      <Button to="/programs" variant="ghost" className="text-xs sm:text-sm text-[#E07A48] hover:text-white px-2">
                        <span>{isHi ? 'सभी प्रोग्राम्स देखें' : 'View Ground Programs'}</span>
                        <ArrowRight className="w-4 h-4 ml-1 inline-block" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Side: Visual Showcase Card */}
                <div className="w-full">
                  <div className="bg-[#141210] rounded-2xl border border-[#2d251f] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden min-h-[320px]">
                    {/* Top Right Big Icon watermark */}
                    <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
                      <StepIcon className="w-32 h-32" />
                    </div>

                    <div>
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                        style={{ backgroundColor: current.color }}
                      >
                        <StepIcon className="w-7 h-7 text-white" />
                      </div>

                      <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                        {isHi ? 'जमीनी हकीकत व प्रभाव' : 'Ground Reality & Impact'}
                      </div>

                      <h4 className="text-lg sm:text-xl font-bold text-white mb-3">
                        {isHi
                          ? `फुटपाथ के बच्चे को ${current.titleHi} से कैसे लाभ होता है?`
                          : `How ${current.titleEn} transforms street children:`}
                      </h4>

                      <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6">
                        {isHi
                          ? 'शिक्षा केवल कक्षा की दीवारों में नहीं होती। हमारा प्रत्येक चरण बच्चे के मन से डर को दूर कर उसके भीतर आत्मविश्वास और आत्मसम्मान पैदा करता है।'
                          : 'Education transcends classroom walls. Every single milestone is designed to dismantle fear, instill dignity, and build cognitive readiness for a bright tomorrow.'}
                      </p>
                    </div>

                    {/* Step Indicator Progress Bar */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                        <span>{isHi ? 'शिक्षा यात्रा प्रगति' : 'Learning Pathway Progress'}</span>
                        <span className="font-bold text-[#E07A48]">
                          {((activeIdx + 1) * 10)}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: current.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${((activeIdx + 1) / ROADMAP_STEPS.length) * 100}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM SDG IMPACT CARDS (Directly from official poster) */}
        {/* ========================================================================= */}
        <div className="mt-12 pt-10 border-t border-[#2b2520] grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-[#1b1815] rounded-2xl p-5 border border-[#2d2620] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C5192D] flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-md">
              4
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                UN SDG Goal 4
              </div>
              <div className="text-sm font-bold text-white">
                {isHi ? 'गुणवत्तापूर्ण शिक्षा (Quality Education)' : 'Quality Education for Every Child'}
              </div>
            </div>
          </div>

          <div className="bg-[#1b1815] rounded-2xl p-5 border border-[#2d2620] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FF3A21] flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-md">
              5
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                UN SDG Goal 5
              </div>
              <div className="text-sm font-bold text-white">
                {isHi ? 'लैंगिक समानता (Gender Equality)' : 'Gender Equality in Street Learning'}
              </div>
            </div>
          </div>

          <div className="bg-[#1b1815] rounded-2xl p-5 border border-[#2d2620] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#DD1367] flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-md">
              10
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                UN SDG Goal 10
              </div>
              <div className="text-sm font-bold text-white">
                {isHi ? 'असमानताओं में कमी (Reduced Inequalities)' : 'Reduced Inequalities on the Ground'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EducationRoadmapSection;
